from pydantic import BaseModel
from typing import Optional, List
from .user import User  # Ensure User schema is imported

class RoomBase(BaseModel):
    code: str

class RoomCreate(RoomBase):
    pass

class RoomUpdate(RoomBase):
    pass

class RoomInDBBase(RoomBase):
    id: int
    host_id: Optional[int] = None # Add host_id
    users: List[User] = [] # Use List from typing
    host: Optional[User] = None # Add host relationship

    class Config:
        from_attributes = True

class Room(RoomInDBBase):
    pass
