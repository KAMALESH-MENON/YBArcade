from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate


def get_user_by_id(db: Session, *, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, *, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, *, user: UserCreate) -> User:
    db_user = User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def add_user_to_room(db: Session, *, user: User, room_id: int) -> User:
    user.room_id = room_id
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def remove_user_from_room(db: Session, *, user: User) -> User:
    user.room_id = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
