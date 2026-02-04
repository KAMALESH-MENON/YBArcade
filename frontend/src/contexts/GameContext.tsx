"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";

interface ChatMessage {
  username: string;
  message: string;
}

interface GameState {
  players: any;
  game_status: string;
  current_turn: string | null;
  descriptions: any;
  votes: any;
  winner: string | null;
  host_id: number | null;
  chatMessages: ChatMessage[];
}

interface GameContextType {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
  currentUsername: string | null;
  setCurrentUsername: (username: string | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
    chatMessages: [],
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      const decodedToken: { sub: string, username: string } = jwtDecode(storedToken);
      setCurrentUserId(decodedToken.sub);
      setCurrentUsername(decodedToken.username);
    }
  }, []);

  const addChatMessage = (message: ChatMessage) => {
    setGameState((prevState) => ({
      ...prevState,
      chatMessages: [...prevState.chatMessages, message],
    }));
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/login/access-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });
    if (!res.ok) {
      throw new Error("Login failed");
    }
    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);
    setIsAuthenticated(true);
    const decodedToken: { sub: string, username: string } = jwtDecode(data.access_token);
    setCurrentUserId(decodedToken.sub);
    setCurrentUsername(decodedToken.username);
  };

  const register = async (username: string, email: string, password: string) => {
    const clientId = uuidv4();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        client_id: clientId,
      }),
    });
    if (!res.ok) {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setCurrentUsername(null);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        currentUserId,
        setCurrentUserId,
        currentUsername,
        setCurrentUsername,
        addChatMessage,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
