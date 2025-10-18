import { create } from "zustand";

interface PlayerState {
  name: string;
  score: number;
}

interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  currentTurn: 1 | 2;
  setScore: (player: 1 | 2, score: number) => void;
  switchTurn: () => void;
  reset: () => void;
}

export const usePlayers = create<GameState>((set) => ({
  player1: { name: "Player 1", score: 0 },
  player2: { name: "Player 2", score: 0 },
  currentTurn: 1,

  setScore: (player, score) =>
    set((state) => ({
      [player === 1 ? "player1" : "player2"]: {
        ...state[player === 1 ? "player1" : "player2"],
        score,
      },
    })),

  switchTurn: () =>
    set((state) => ({
      currentTurn: state.currentTurn === 1 ? 2 : 1,
    })),

  reset: () =>
    set({
      player1: { name: "Player 1", score: 0 },
      player2: { name: "Player 2", score: 0 },
      currentTurn: 1,
    }),
}));
