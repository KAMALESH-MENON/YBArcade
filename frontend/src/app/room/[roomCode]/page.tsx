"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import { GameContext } from "@/contexts/GameContext";
import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomCode = params.roomCode as string;
  const clientIdFromUrl = searchParams.get("clientId");
  const parsedClientId = clientIdFromUrl ? parseInt(clientIdFromUrl, 10) : null;

  // Only call useWebSocket if parsedClientId is not null
  const { sendMessage, isConnected } = useWebSocket(parsedClientId || 0);
  const gameContext = useContext(GameContext);
  const [description, setDescription] = useState("");
  const [votedPlayer, setVotedPlayer] = useState("");

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: "join_room",
        room_code: roomCode,
      });
    }
  }, [roomCode, sendMessage, isConnected]);

  const handleStartGame = () => {
    sendMessage({
      type: "start_game",
    });
  };

  const handleDescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({
      type: "submit_description",
      description: description,
    });
    setDescription("");
  };

  const handleVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({
      type: "submit_vote",
      player: votedPlayer,
    });
    setVotedPlayer("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Room: {roomCode}</h1>
        <p className="text-sm sm:text-lg">Game Status: {gameContext?.gameState.game_status}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-5xl">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl sm:text-2xl">Players</h2>
          <ul className="text-center md:text-left">
            {gameContext?.gameState.players &&
              Object.keys(gameContext.gameState.players).map((player) => (
                <li key={player}>
                  {player}
                  {gameContext.gameState.players[player].is_eliminated && " (Eliminated)"}
                  {gameContext.gameState.host_id === gameContext.gameState.players[player].id && " (Host)"}
                </li>
              ))}
          </ul>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl sm:text-2xl">Game Info</h2>
          <p>Current Turn: {gameContext?.gameState.current_turn}</p>
          <p>Winner: {gameContext?.gameState.winner}</p>
        </div>
      </div>

      {gameContext?.gameState.game_status === "not_started" &&
        gameContext?.currentUserId === gameContext?.gameState.host_id && (
          <div className="mt-8">
            <button
              onClick={handleStartGame}
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              Start Game
            </button>
          </div>
        )}

      {gameContext?.gameState.game_status === "started" && (
        <div className="mt-8 w-full max-w-sm">
          <form onSubmit={handleDescriptionSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border border-gray-300 p-2"
              placeholder="Enter your description"
            />
            <button type="submit" className="rounded-md bg-green-500 px-4 py-2 text-white">
              Submit Description
            </button>
          </form>
        </div>
      )}

      {gameContext?.gameState.game_status === "voting" && (
        <div className="mt-8 w-full max-w-sm">
          <h2 className="text-xl sm:text-2xl">Descriptions</h2>
          <ul className="mb-4">
            {gameContext?.gameState.descriptions &&
              Object.entries(gameContext.gameState.descriptions).map(([player, desc]) => (
                <li key={player}>
                  {player}: {desc as string}
                </li>
              ))}
          </ul>
          <form onSubmit={handleVoteSubmit} className="flex flex-col gap-2">
            <select
              value={votedPlayer}
              onChange={(e) => setVotedPlayer(e.target.value)}
              className="rounded-md border border-gray-300 p-2"
            >
              <option value="">Vote to eliminate</option>
              {gameContext?.gameState.players &&
                Object.keys(gameContext.gameState.players).map((player) => (
                  <option key={player} value={player}>
                    {player}
                  </option>
                ))}
            </select>
            <button type="submit" className="rounded-md bg-red-500 px-4 py-2 text-white">
              Submit Vote
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
