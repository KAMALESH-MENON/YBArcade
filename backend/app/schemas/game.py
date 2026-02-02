from pydantic import BaseModel

class GameBase(BaseModel):
    name: str

class GameCreate(GameBase):
    pass

class GameUpdate(GameBase):
    pass

class GameInDBBase(GameBase):
    id: int

    class Config:
        from_attributes = True

class Game(GameInDBBase):
    pass
