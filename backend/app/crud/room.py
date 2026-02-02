from sqlalchemy.orm import Session, selectinload

from app.models.room import Room
from app.schemas.room import RoomCreate


def get_all_rooms(db: Session, skip: int = 0, limit: int = 100) -> list[Room]:
    return db.query(Room).offset(skip).limit(limit).all()


def get_room_by_code(db: Session, *, code: str) -> Room | None:
    return db.query(Room).options(selectinload(Room.host)).filter(Room.code == code).first()


def create_room(db: Session, *, room: RoomCreate, host_id: int) -> Room:
    db_room = Room(code=room.code, host_id=host_id)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room


def update_room_host(db: Session, *, room: Room, new_host_id: int | None) -> Room:
    room.host_id = new_host_id
    db.add(room)
    db.commit()
    db.refresh(room)
    return room
