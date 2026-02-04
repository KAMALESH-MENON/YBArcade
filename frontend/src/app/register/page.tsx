"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { GameContext } from "@/contexts/GameContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const gameContext = useContext(GameContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameContext) return;

    try {
      await gameContext.register(username, email, password);
      router.push("/login");
    } catch (err) {
      setError("Failed to register");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-sm flex-col gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="rounded-md border border-gray-300 p-2"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-md border border-gray-300 p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
placeholder="Password"
          className="rounded-md border border-gray-300 p-2"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white">
          Register
        </button>
      </form>
    </main>
  );
}
