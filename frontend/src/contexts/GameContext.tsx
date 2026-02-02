"use client";

import { createContext, useState, ReactNode } from "react";

// This is a simplified game state for the frontend
// It should be updated to match the backend's game state
interface GameState {
  players: any;
  game_status: string;
  current_turn: string | null;
  descriptions: any;
  votes: any;
  winner: string | null;
  host_id: number | null; // Added host_id
}

interface GameContextType {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  currentUserId: number | null; // Added currentUserId
  setCurrentUserId: (id: number | null) => void; // Setter for currentUserId
  currentUsername: string | null; // Added currentUsername
  setCurrentUsername: (username: string | null) => void; // Setter for currentUsername
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    game_status: "not_started",
    current_turn: null,
    descriptions: {},
    votes: {},
    winner: null,
    host_id: null,
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  return (
    <GameContext.Provider value={{ gameState, setGameState, currentUserId, setCurrentUserId, currentUsername, setCurrentUsername }}>
      {children}
    </GameContext.Provider>
  );
}
