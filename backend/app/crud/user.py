from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


from typing import Any

from sqlalchemy.orm import Session
...
def get(db: Session, id: Any) -> User | None:
    return db.query(User).filter(User.id == id).first()


def get_user_by_email(db: Session, *, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create(db: Session, *, obj_in: UserCreate) -> User:
    hashed_password = get_password_hash(obj_in.password)
    db_obj = User(
        email=obj_in.email,
        username=obj_in.username,
        client_id=obj_in.client_id,
        hashed_password=hashed_password,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def authenticate(db: Session, *, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


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
