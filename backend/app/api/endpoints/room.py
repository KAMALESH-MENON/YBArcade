from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import string
import random
from typing import List

from app import crud
from app.api import deps
from app.schemas.room import Room, RoomCreate

router = APIRouter()


def generate_room_code(length: int = 4):
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


@router.post("/rooms", response_model=Room)
def create_room(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int # Temporary: assume user_id is passed as query param for host
) -> Room:
    # Ensure the user exists or create them
    user = crud.user.get_user_by_id(db=db, user_id=user_id)
    if not user:
        user_in = UserCreate(username=f"User_{user_id}")
        user = crud.user.create_user(db=db, user=user_in)
    
    room_code = generate_room_code()
    room_in = RoomCreate(code=room_code)
    room = crud.room.create_room(db=db, room=room_in, host_id=user.id)
    return room

@router.get("/rooms", response_model=List[Room])
def read_rooms(
    db: Session = Depends(deps.get_db),
) -> List[Room]:
    rooms = crud.room.get_all_rooms(db=db)
    return rooms
