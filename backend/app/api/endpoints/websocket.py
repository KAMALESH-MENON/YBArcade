from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import json

from app import crud
from app.api import deps
from app.schemas.user import UserCreate
from app.models.user import User # Import User model

from app.game_logic.undercover import UndercoverGame

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
        self.games: Dict[str, UndercoverGame] = {} # Maps room_code to game instance
        self.room_connections: Dict[str, List[str]] = {} # Maps room_code to list of client_ids

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        # This will be handled in the websocket_endpoint when user disconnects from room.

    async def send_personal_message(self, message: Any, client_id: str):
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_json(message)
            except WebSocketDisconnect:
                self.disconnect(client_id)

    async def broadcast(self, message: Any, room_code: str):
        if room_code in self.room_connections:
            for client_id in list(self.room_connections[room_code]):
                if client_id in self.active_connections:
                    try:
                        await self.active_connections[client_id].send_json(message)
                    except WebSocketDisconnect:
                        self.disconnect(client_id)
                        self.room_connections[room_code].remove(client_id)


manager = ConnectionManager()


@router.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    db: Session = Depends(deps.get_db),
):
    await manager.connect(websocket, client_id)
    # Get or create user
    username = f"User_{client_id}"
    user = crud.user.get_user_by_username(db=db, username=username)
    if not user:
        user_in = UserCreate(username=username, client_id=client_id)
        user = crud.user.create_user(db=db, user=user_in)
    
    # Send user info back to the client
    await manager.send_personal_message({"type": "user_info", "user_id": user.id, "username": user.username, "clientId": user.client_id}, client_id)

    room_code: str | None = None
    room = None

    try:
        while True:
            data = await websocket.receive_json()
            action_type = data.get("type")

            if action_type == "join_room":
                room_code = data["room_code"]
                room = crud.room.get_room_by_code(db=db, code=room_code)
                if room:
                    crud.user.add_user_to_room(db=db, user=user, room_id=room.id)
                    
                    if room_code not in manager.room_connections:
                        manager.room_connections[room_code] = []
                    if client_id not in manager.room_connections[room_code]:
                        manager.room_connections[room_code].append(client_id)
                    
                    # Ensure room.users is refreshed to get the latest list of players
                    db.refresh(room)
                    
                    room_data = {
                        "type": "room_update",
                        "room_code": room.code,
                        "players": {u.username: {"id": u.id, "is_host": u.id == room.host_id, "clientId": u.client_id} for u in room.users},
                        "host_id": room.host_id
                    }
                    await manager.broadcast(room_data, room.code)
                else:
                    await manager.send_personal_message({"type": "error", "message": f"Room {room_code} not found"}, client_id)

            elif action_type == "start_game":
                if room_code and room and room.code in manager.games: # Check if room object is available
                    game = manager.games[room_code]
                    players = [u.username for u in db.query(User).filter(User.room_id == room.id).all()] # Fetch fresh player list
                    game = UndercoverGame(players=players) # Re-initialize with current players
                    game.start_game()
                    manager.games[room_code] = game
                    await manager.broadcast({"type": "game_state_update", "state": game.get_game_state()}, room.code)
                else:
                    await manager.send_personal_message({"type": "error", "message": "Game not found or not in a room"}, client_id)

            elif action_type in ["submit_description", "submit_vote"]:
                if room_code and room_code in manager.games:
                    game = manager.games[room_code]
                    game.handle_player_action(user.username, data)
                    await manager.broadcast({"type": "game_state_update", "state": game.get_game_state()}, room.code)
                else:
                    await manager.send_personal_message({"type": "error", "message": "Game not found or not in a room"}, client_id)

            elif action_type == "chat_message":
                if room_code:
                    await manager.broadcast({"type": "chat_message", "username": user.username, "message": data.get("message")}, room_code)
            else:
                if room_code:
                    await manager.broadcast({"type": "chat_message", "message": f"User_{client_id} says: {data.get('message')}"}, room_code)

    except WebSocketDisconnect:
        if user:
            crud.user.remove_user_from_room(db=db, user=user)
        
        manager.disconnect(client_id)
        if room_code and client_id in manager.room_connections.get(room_code, []):
            manager.room_connections[room_code].remove(client_id)
            
            # Host reassignment logic
            if room and room.host_id == user.id:
                db.refresh(room) # Refresh room to get the latest list of users
                remaining_players = [u for u in room.users if u.id != user.id]
                if remaining_players:
                    new_host = random.choice(remaining_players)
                    crud.room.update_room_host(db=db, room=room, new_host_id=new_host.id)
                    await manager.broadcast({"type": "host_reassigned", "new_host_id": new_host.id, "new_host_username": new_host.username}, room.code)
                else:
                    crud.room.update_room_host(db=db, room=room, new_host_id=None)
                    # Optionally, delete the room if empty, or set game status to ended
            
            await manager.broadcast({"type": "chat_message", "message": f"User_{client_id} left the room"}, room.code)
