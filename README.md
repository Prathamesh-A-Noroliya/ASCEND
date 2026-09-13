# ASCEND

Your life. Your quest. Your evolution.

ASCEND is a full-stack life RPG that transforms real-world tasks into character progression.

## Architecture

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Next.js + TypeScript
- Database: MongoDB + Mongoose
- Authentication: JWT session
- Deployment: Vercel

## Features

- Secure signup and login
- Persistent user characters
- Personal quests
- Quest creation, editing and deletion
- Start and complete quests
- XP and gold rewards
- Character attributes
- Streak progression
- MongoDB persistence
- Responsive gaming interface

## Project Structure

ASCEND-FULLSTACK/
├── backend/
└── frontend/

## Local Setup

Frontend: cd frontend; npm install; npm run dev

Backend: cd backend; npm install; npm run dev

## Environment

Create .env.local files from the provided .env.example files. Never commit real credentials or secrets.

## API

POST /api/auth/signup
POST /api/auth/login
GET /api/health
GET /api/character
GET /api/quests
POST /api/quests
PATCH /api/quests/:id
DELETE /api/quests/:id
POST /api/quests/:id/start
POST /api/quests/:id/complete

## Hackathon

Built for Tech Zephyr 4.0 - Life RPG.
