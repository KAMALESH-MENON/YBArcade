from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))

    room = relationship("Room", back_populates="users", foreign_keys=[room_id])
