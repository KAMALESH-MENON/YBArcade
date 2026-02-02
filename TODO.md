# YBArcade TODO List

This file outlines the tasks required to build the YBArcade platform, as detailed in the PRD, Design Doc, and Tech Stack documents.

## Phase 1: Project Setup & Backend Foundation

- [ ] **Initialize Backend Project (FastAPI)**
    - [ ] Set up a new FastAPI project.
    - [ ] Create the basic project structure (e.g., `main.py`, `core`, `models`, `schemas`, `api`).
    - [ ] Initialize a Git repository and commit the initial project structure.
- [ ] **Database Setup (PostgreSQL & SQLAlchemy)**
    - [ ] Set up a PostgreSQL database.
    - [ ] Configure SQLAlchemy to connect to the database.
    - [ ] Define initial database models for `User`, `Room`, and `Game` (if needed).
- [ ] **WebSocket Integration**
    - [ ] Add WebSocket support to the FastAPI backend (using `FastAPI WebSockets` for MVP).
    - [ ] Create a basic WebSocket endpoint for testing real-time communication.
- [ ] **Dockerize Backend**
    - [ ] Create a `Dockerfile` for the FastAPI application.
    - [ ] Create a `docker-compose.yml` for running the backend and PostgreSQL together.

## Phase 2: Backend - Lobby and Room Management

- [ ] **Room Creation API**
    - [ ] Create an HTTP endpoint to create a new game room.
    - [ ] The endpoint should return a unique room code.
- [ ] **Room Joining Logic**
    - [ ] Implement WebSocket logic to handle a user joining a room using a room code.
    - [ ] Broadcast a "user joined" event to all users in the room.
- [ ] **Player Session Management**
    - [ ] Handle player connections and disconnections.
    - [ ] Broadcast "user left" events when a player disconnects.
    - [ ] Implement logic to reassign the host if the host disconnects.

## Phase 3: Backend - "Undercover" Game Logic

- [ ] **Game Engine Architecture**
    - [ ] Design and implement a base `Game` class or interface (Strategy Pattern).
    - [ ] This should define methods like `start_game`, `handle_player_action`, `get_game_state`, etc.
- [ ] **"Undercover" Game Class**
    - [ ] Create an `UndercoverGame` class that inherits from the base `Game` class.
    - [ ] Implement the game's state machine (e.g., `LOBBY`, `IN_GAME`, `VOTING`, `FINISHED`).
- [ ] **Role and Word Assignment**
    - [ ] Implement logic to assign roles (Civilian, Undercover) to players secretly.
    - [ ] Implement logic to distribute the secret words to players.
- [ ] **Game Flow Logic**
    - [ ] Implement turn-based logic for players to give their descriptions.
    - [ ] Implement the voting phase logic.
    - [ ] Implement the elimination logic and win condition checks.
- [ ] **WebSocket Event Handling**
    - [ ] Handle incoming WebSocket events for player actions (e.g., submitting a description, casting a vote).
    - [ ] Broadcast game state updates to all players in the room (e.g., turn changes, vote results).

## Phase 4: Frontend - Project Setup and Basic UI

- [ ] **Initialize Frontend Project (Next.js)**
    - [ ] Set up a new Next.js project.
    - [ ] Configure Tailwind CSS for styling.
- [ ] **Implement Basic Layout**
    - [ ] Create a main layout component.
    - [ ] Implement a simple landing page where users can enter a username (guest login).
- [ ] **State Management**
    - [ ] Set up React Context for managing global state (e.g., user info, room state).
- [ ] **WebSocket Client**
    - [ ] Integrate the Socket.IO client.
    - [ ] Create a service or hook for managing the WebSocket connection.

## Phase 5: Frontend - Lobby and Room Implementation

- [ ] **Lobby UI**
    - [ ] Create a UI for creating a new room.
    - [ ] Create a UI for joining a room with a code.
- [ ] **Game Room/Lobby UI**
    - [ ] Create a view for the game lobby where players wait before the game starts.
    - [ ] Display the list of players in the room.
    - [ ] Add a "Start Game" button for the host.
- [ ] **Real-time Updates**
    - [ ] Handle incoming WebSocket events to update the player list in real-time.

## Phase 6: Frontend - "Undercover" Game UI and Logic

- [ ] **Game View UI**
    - [ ] Create the main game interface for "Undercover".
    - [ ] Display the current player's role and word.
    - [ ] Display whose turn it is.
- [ ] **Gameplay Components**
    - [ ] Create a component for players to submit their word descriptions.
    - [ ] Create a UI for the voting phase.
    - [ ] Display the results of the voting and elimination.
- [ ] **Game State Synchronization**
    - [ ] Handle incoming WebSocket events to update the game state, current turn, and other game-related information.
    - [ ] Display a "Game Over" screen with the winning team.
- [ ] **Responsive Design**
    - [ ] Ensure the game is playable on both desktop and mobile devices.

## Phase 7: Deployment and Testing

- [ ] **Deploy Backend**
    - [ ] Deploy the Dockerized FastAPI application to a cloud provider (e.g., AWS, Railway).
    - [ ] Ensure WebSocket connections are supported and working.
- [ ] **Deploy Frontend**
    - [ ] Deploy the Next.js application to Vercel.
- [ ] **End-to-End Testing**
    - [ ] Perform manual end-to-end testing of the full gameplay loop.
    - [ ] Test with multiple players to ensure real-time updates are working correctly.

## Phase 8: Future Enhancements (Post-MVP)

- [ ] **User Accounts**
- [ ] **Public Matchmaking**
- [ ] **Add More Games** (e.g., Werewolf, Pictionary)
- [ ] **Voice Chat Integration**
- [ ] **Spectator Mode**
- [ ] **Leaderboards and Stats**
