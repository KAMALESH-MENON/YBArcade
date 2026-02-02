import logging
import os
from sqlalchemy.orm import Session
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.models.game import Game
from app.schemas.game import GameCreate
from app import crud

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main() -> None:
    logger.info("Initializing service")
    db: Session = SessionLocal()
    init_db(db)
    
    # Create a default game if it doesn't exist
    undercover_game = db.query(Game).filter(Game.name == "Undercover").first()
    if not undercover_game:
        logger.info("Creating default 'Undercover' game")
        game_in = GameCreate(name="Undercover")
        crud.game.create_game(db=db, game=game_in)
    
    db.close()
    logger.info("Service finished initialization")

if __name__ == "__main__":
    main()
