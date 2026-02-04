"use client";

import { useContext } from "react";
import Link from "next/link";
import { GameContext } from "@/contexts/GameContext";

export default function Header() {
  const gameContext = useContext(GameContext);

  return (
    <header className="flex w-full items-center justify-between bg-gray-800 p-4 text-white">
      <Link href="/" className="text-2xl font-bold">
        YBArcade
      </Link>
      <nav>
        {gameContext?.isAuthenticated ? (
          <button onClick={gameContext.logout} className="rounded-md bg-red-500 px-4 py-2">
            Logout
          </button>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="rounded-md bg-blue-500 px-4 py-2">
              Login
            </Link>
            <Link href="/register" className="rounded-md bg-green-500 px-4 py-2">
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
