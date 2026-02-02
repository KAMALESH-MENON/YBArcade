from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Assuming host is a user
    
    host = relationship("User", foreign_keys=[host_id])
    users = relationship("User", back_populates="room", foreign_keys="[User.room_id]")
    game_id = Column(Integer, ForeignKey("games.id"))
    game = relationship("Game", back_populates="rooms")
