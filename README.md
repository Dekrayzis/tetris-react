# Tetris (React + Vite + TypeScript)

A modern Tetris clone built with React and Vite. The game includes multiple levels (with increasing speed), sound/music, a “Zone” mechanic, results/game-over overlays, and a Firestore-backed high score table.

## Background
I originally created this as a javascript game project in late 2019 to test my abilities in creating my first game in javascript with a four week deadline.
Originally, I used vanilla javascript along with React 15, Redux, and Redux saga.
As of Feburary 2026, I have since reworked this project to use typescript with React 18, react-query, and Vite 7. Redux has been fully dropped.

## Features

- **Classic Tetris gameplay**
- **Levels & speed scaling**
- **Zone mechanic** for banking line clears into higher scoring
- **Title screen** enhanced with falling tetrominoes.
- **Game over screen** with restart option.
- **How to play** modal with instructions when beginning the first level if never played before. (Value stored in localStorage).
- **Scoreboard / highscores** (stored in Firebase Firestore)
- **Keyboard-first UX** (overlay dialogs focus their primary action)
- **Music + SFX**

## Controls

- **Left Arrow**: move left
- **Right Arrow**: move right
- **Down Arrow**: soft drop
- **Up Arrow**: rotate
- **B**: fast drop
- **Z**: activate Zone (when available)

## Getting started

### Requirements

- Node.js (LTS recommended)

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Highscores (Firebase / Firestore)

High scores are stored in Firestore. The Firebase app is initialized in:

`src/firebase/config.ts`

If you are forking this repo, you’ll typically want to:

- **Create your own Firebase project**
- **Enable Firestore**
- Update the Firebase configuration to point at your project

## Gameplay notes

### Leveling up

Each level becomes more challenging as the tetromino drop rate increases.

### Zone

Zone allows you to rack up points by delaying row clears while the Zone meter drains. The more rows you complete during Zone, the more points you can earn.

### Row-clear awards

- **Back-2-back**: 2 rows at once
- **Tetris**: 4 rows at once
- **Ocktris**: 8 rows at once
- **Decahexatris**: 16 rows at once
- **Perfectris**: 18+ rows at once

## Project structure (high level)

- `src/components/`: UI + game screens (board, overlays, HUD)
- `src/hooks/`: core game hooks (intervals, stage/player logic, music)
- `src/data/levels.ts`: per-level configuration
- `src/firebase/`: Firestore client setup

## Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: build production bundle
- `npm run preview`: preview production bundle locally
