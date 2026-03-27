# National Duty ⚽ - Progress Tracker

## Project Overview
**National Duty** is a football quiz game where players guess the National Team based on 11 club logos arranged in a 4-3-3 formation on a pitch.

## Game Modes
1. **Current Squads** – Guess using 2026 national team rosters
2. **Iconic Squads** – Guess using historic tournament lineups (e.g., Brazil 1998, Turkey 2002)
3. **Mixed Mode** – All teams from both eras, shuffled randomly

## Critical Rules
- 🔴 **Club Logo Accuracy**: For Iconic Squads, each player's club logo MUST reflect the club they played for **during that specific tournament year**.
  - Example: Turkey 2002 → Emre Belözoğlu = Inter Milan, Hakan Şükür = Parma
- All logos use Wikipedia `Special:FilePath` URL pattern
- Formation: always 4-3-3 (1 GK, 4 DEF, 3 MID, 3 FWD)
- Mobile-first responsive design

## Tech Stack
- Vite + React 19
- Tailwind CSS v4 (`@tailwindcss/vite`)
- canvas-confetti (celebration effects)
- No backend (static JSON data)

## Feature Status
| Feature | Status |
|---------|--------|
| Project Setup (Vite + React + Tailwind) | ✅ Done |
| progress.md | ✅ Done |
| national_teams.json (10 teams, 2026) | ✅ Done |
| FootballPitch.jsx component | ✅ Done |
| StartScreen.jsx (3 mode cards) | ✅ Done |
| App.jsx navigation (3 modes) | ✅ Done |
| Confetti on correct answer | ✅ Done |
| Auto-progress (1.5s) | ✅ Done |
| UI polish (larger logos) | ✅ Done |
| Mixed Mode | ✅ Done |
| Contextual tournament headers | ✅ Done |
| More teams / data expansion | ⬜ Planned |
