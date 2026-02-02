from abc import ABC, abstractmethod

class BaseGame(ABC):

    @abstractmethod
    def start_game(self, players: list):
        pass

    @abstractmethod
    def handle_player_action(self, player, action: dict):
        pass

    @abstractmethod
    def get_game_state(self):
        pass
