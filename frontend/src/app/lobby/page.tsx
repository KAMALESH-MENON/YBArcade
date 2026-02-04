"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { GameContext } from "@/contexts/GameContext";

export default function LobbyPage() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();
  const gameContext = useContext(GameContext);
  
  useEffect(() => {
    if (!gameContext?.isAuthenticated) {
      router.push("/login");
    }
  }, [gameContext, router]);

  const { sendMessage } = useWebSocket();

  const handleCreateRoom = async () => {
    if (!gameContext?.currentUserId) return;
    try {
      const res = await fetch(`/api/rooms?user_id=${gameContext.currentUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        throw new Error(`Create room failed: ${res.status}`);
      }
      const room = await res.json();
      router.push(`/room/${room.code}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleJoinRoom = () => {
    if (!gameContext?.currentUserId) return;
    sendMessage({
      type: "join_room",
      room_code: roomCode,
    });
    router.push(`/room/${roomCode}`);
  };

  if (!gameContext?.isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Lobby</h1>
      </div>
      <div className="mt-8 flex flex-col gap-4 w-full max-w-sm sm:max-w-md">
        <button
          onClick={handleCreateRoom}
          className="rounded-md bg-blue-500 px-4 py-2 text-white w-full"
        >
          Create Room
        </button>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="rounded-md border border-gray-300 p-2 flex-grow"
            placeholder="Enter room code"
          />
          <button
            onClick={handleJoinRoom}
            className="rounded-md bg-green-500 px-4 py-2 text-white w-full sm:w-auto"
          >
            Join Room
          </button>
        </div>
      </div>
    </main>
  );
}
