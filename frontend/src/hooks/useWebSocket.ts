"use client";

import { useEffect, useContext, useRef, useState } from "react";
import { GameContext } from "@/contexts/GameContext";

const SOCKET_URL = "ws://127.0.0.1:8000/ws"; // This should be in an env file

export function useWebSocket(clientId: number) {
  const gameContext = useContext(GameContext);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!gameContext) return;

    const { setGameState, setCurrentUserId, setCurrentUsername } = gameContext;

    const socket = new WebSocket(`${SOCKET_URL}/${clientId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("connected to websocket");
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log("disconnected from websocket");
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("received message:", data);
      
      if (data.type === "user_info") {
        setCurrentUserId(data.user_id);
        setCurrentUsername(data.username);
      } else if (data.type === "room_update" || data.type === "game_state_update") {
        setGameState(data.state || data); // Update game state with the received data
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [gameContext, clientId]);

  const sendMessage = (message: any) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage, isConnected };
}
