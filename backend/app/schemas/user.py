from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class UserInDBBase(UserBase):
    id: int
    room_id: int | None = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass
