from app.game_logic.base_game import BaseGame
import random

ROLES = ["Civilian", "Undercover"]
WORDS = [
    ("apple", "orange"),
    ("house", "home"),
    ("car", "bike"),
    ("dog", "cat"),
]

class UndercoverGame(BaseGame):

    def __init__(self, players: list):
        self.players = players
        self.game_state = {
            "players": {},
            "game_status": "not_started",
            "current_turn": None,
            "descriptions": {},
            "votes": {}
        }
    def start_game(self):
        # Assign roles
        undercover_player = random.choice(self.players)
        
        # Assign words
        word_pair = random.choice(WORDS)
        civilian_word, undercover_word = word_pair

        for player in self.players:
            if player == undercover_player:
                role = "Undercover"
                word = undercover_word
            else:
                role = "Civilian"
                word = civilian_word
            
            self.game_state["players"][player] = {
                "role": role,
                "word": word,
                "is_eliminated": False
            }
        
        self.game_state["game_status"] = "started"
        self.game_state["current_turn"] = self.players[0]

    def handle_player_action(self, player, action: dict):
        action_type = action.get("type")
        if action_type == "submit_description":
            if player == self.game_state["current_turn"]:
                self.game_state["descriptions"][player] = action.get("description")
                
                # Move to the next player
                current_player_index = self.players.index(player)
                next_player_index = (current_player_index + 1) % len(self.players)
                self.game_state["current_turn"] = self.players[next_player_index]

                # If all players have submitted a description, move to voting phase
                if len(self.game_state["descriptions"]) == len(self.players):
                    self.game_state["game_status"] = "voting"
                    self.game_state["current_turn"] = None
        
        elif action_type == "submit_vote":
            if self.game_state["game_status"] == "voting":
                voted_player = action.get("player")
                self.game_state["votes"][player] = voted_player

                # If all players have voted, tally the votes
                if len(self.game_state["votes"]) == len(self.players):
                    self.tally_votes()

    def tally_votes(self):
        vote_counts = {}
        for voted_player in self.game_state["votes"].values():
            vote_counts[voted_player] = vote_counts.get(voted_player, 0) + 1
        
        eliminated_player = max(vote_counts, key=vote_counts.get)
        self.game_state["players"][eliminated_player]["is_eliminated"] = True
        self.game_state["game_status"] = "elimination"
        self.check_win_condition()

    def check_win_condition(self):
        active_civilians = 0
        active_undercovers = 0

        for player_data in self.game_state["players"].values():
            if not player_data["is_eliminated"]:
                if player_data["role"] == "Civilian":
                    active_civilians += 1
                elif player_data["role"] == "Undercover":
                    active_undercovers += 1
        
        if active_undercovers == 0:
            self.game_state["game_status"] = "finished"
            self.game_state["winner"] = "Civilians"
        elif active_undercovers >= active_civilians:
            self.game_state["game_status"] = "finished"
            self.game_state["winner"] = "Undercover"
        else:
            # Reset for the next round
            self.game_state["game_status"] = "started"
            self.game_state["descriptions"] = {}
            self.game_state["votes"] = {}
            self.game_state["current_turn"] = self.players[0]


    def get_game_state(self):
        # Logic to get the current game state
        return self.game_state
