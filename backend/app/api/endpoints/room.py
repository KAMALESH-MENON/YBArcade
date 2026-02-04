from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import string
import random
from typing import List

from app.models.user import User
from app import crud, models
from app.api import deps
from app.schemas.room import Room, RoomCreate

router = APIRouter()


def generate_room_code(length: int = 4):
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


@router.post("/rooms", response_model=Room)
def create_room(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Room:
    room_code = generate_room_code()
    room_in = RoomCreate(code=room_code)
    room = crud.room.create_room(db=db, room=room_in, host_id=current_user.id)
    return room

@router.get("/rooms", response_model=List[Room])
def read_rooms(
    db: Session = Depends(deps.get_db),
) -> List[Room]:
    rooms = crud.room.get_all_rooms(db=db)
    return rooms
