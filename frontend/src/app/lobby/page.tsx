"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LobbyPage() {
  const [roomCode, setRoomCode] = useState("");
  const [clientId, setClientId] = useState<number | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Generate a unique client ID for the session
    const existingClientId = sessionStorage.getItem("clientId");
    if (existingClientId) {
      setClientId(parseInt(existingClientId, 10));
    } else {
      let newClientId = Math.floor(Math.random() * 1000000);
      // Ensure clientId is not 0, as it might have special meaning or cause issues
      if (newClientId === 0) {
        newClientId = 1; // Or generate again
      }
      sessionStorage.setItem("clientId", newClientId.toString());
      setClientId(newClientId);
    }
  }, []);

  // Only call useWebSocket if clientId is not null
  const { sendMessage } = useWebSocket(clientId ?? 0);

  const handleCreateRoom = async () => {
    if (!clientId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/rooms?user_id=${clientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const room = await res.json();
      router.push(`/room/${room.code}?clientId=${clientId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleJoinRoom = () => {
    if (!clientId) return;
    sendMessage({
      type: "join_room",
      room_code: roomCode,
    });
    router.push(`/room/${roomCode}`);
  };

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
