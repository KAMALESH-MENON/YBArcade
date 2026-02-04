from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    client_id: str

class UserUpdate(UserBase):
    pass

class UserInDBBase(UserBase):
    id: int
    room_id: int | None = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass
