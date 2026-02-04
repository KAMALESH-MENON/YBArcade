"use client";

import { useEffect, useContext, useRef, useState } from "react";
import { GameContext } from "@/contexts/GameContext";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8000/ws";

export function useWebSocket() {
  const gameContext = useContext(GameContext);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!gameContext || !gameContext.currentUserId) return;

    const { setGameState, setCurrentUserId, setCurrentUsername, addChatMessage, currentUserId } = gameContext;

    const socket = new WebSocket(`${SOCKET_URL}/${currentUserId}`);
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
        setGameState(prevState => ({ ...prevState, ...(data.state || data) })); // Merge with existing state
      } else if (data.type === "chat_message") {
        addChatMessage({ username: data.username, message: data.message });
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [gameContext, gameContext.currentUserId]);

  const sendMessage = (message: any) => {
    if (!socketRef.current) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not open; message skipped", message);
      return;
    }
    socketRef.current.send(JSON.stringify(message));
  };

  return { sendMessage, isConnected };
}
