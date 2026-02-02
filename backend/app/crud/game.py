from sqlalchemy.orm import Session

from app.models.game import Game
from app.schemas.game import GameCreate


def create_game(db: Session, *, game: GameCreate) -> Game:
    db_game = Game(name=game.name)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game
