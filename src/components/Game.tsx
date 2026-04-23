"use client";

import { useState, useEffect, useCallback } from "react";
import Grid from "./Grid";
import GuessInput from "./GuessInput";
import type { Car } from "@/lib/types";
import type { GameState, GridLayout } from "@/lib/types";
import { isValidAnswer, isGameOver, isCarAlreadyUsed, solvedCount, MAX_GUESSES, getTodayGrid } from "@/lib/game";
import { loadGameState, saveGameState } from "@/lib/storage";

const TODAY = new Date().toISOString().split("T")[0];

export default function Game() {
  const [grid, setGrid] = useState<GridLayout | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [lastResult, setLastResult] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    const g = getTodayGrid(TODAY);
    const s = loadGameState(TODAY, g.id);
    setGrid(g);
    setState(s);
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
    setLastResult(null);
  }, []);

  const handleGuess = useCallback(
    (car: Car) => {
      if (!grid || !state || !selectedCell) return;

      const { row, col } = selectedCell;
      const rowParam = grid.rows[row];
      const colParam = grid.columns[col];
      const correct = isValidAnswer(car, rowParam, colParam);

      const newCells = state.cells.map((cell, i) => {
        if (i !== row * 3 + col) return cell;
        return correct ? { solved: true, carId: car.id } : cell;
      });

      const newState: GameState = {
        ...state,
        cells: newCells,
        guessesUsed: state.guessesUsed + 1,
      };

      setState(newState);
      saveGameState(newState);
      setLastResult(correct ? "correct" : "incorrect");

      if (correct) {
        setSelectedCell(null);
      }
    },
    [grid, state, selectedCell]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedCell(null);
    setLastResult(null);
  }, []);

  if (!grid || !state) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="text-gray-400">Loading…</div>
      </div>
    );
  }

  const gameOver = isGameOver(state);
  const solved = solvedCount(state);
  const guessesLeft = MAX_GUESSES - state.guessesUsed;
  const usedCarIds = new Set(state.cells.map((c) => c.carId).filter(Boolean) as string[]);

  const activeRow = selectedCell ? grid.rows[selectedCell.row] : null;
  const activeCol = selectedCell ? grid.columns[selectedCell.col] : null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-950 px-4 py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Car<span className="text-amber-400">Grid</span>
        </h1>
        <p className="mt-1 text-sm text-gray-400">{TODAY}</p>
      </div>

      {/* Stats bar */}
      <div className="mb-4 flex gap-6 text-center text-sm">
        <div>
          <div className="font-bold text-white">{solved}/9</div>
          <div className="text-gray-500">Solved</div>
        </div>
        <div>
          <div className={`font-bold ${guessesLeft <= 2 ? "text-red-400" : "text-white"}`}>
            {guessesLeft}
          </div>
          <div className="text-gray-500">Remaining</div>
        </div>
        <div>
          <div className="font-bold text-white">{state.guessesUsed}</div>
          <div className="text-gray-500">Guesses</div>
        </div>
      </div>

      {/* Grid */}
      <div className="w-full max-w-lg">
        <Grid
          layout={grid}
          cells={state.cells}
          selectedCell={selectedCell}
          gameOver={gameOver}
          onCellClick={handleCellClick}
        />
      </div>

      {/* Game over banner */}
      {gameOver && (
        <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 px-6 py-4 text-center">
          <p className="text-lg font-bold text-white">
            {solved === 9 ? "Perfect!" : `${solved}/9 solved`}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {state.guessesUsed} guess{state.guessesUsed !== 1 ? "es" : ""} used
            {state.guessesUsed > 0 && (
              <> · {Math.round((solved / state.guessesUsed) * 100)}% accuracy</>
            )}
          </p>
          <p className="mt-3 text-xs text-gray-500">New grid tomorrow</p>
        </div>
      )}

      {/* Guess modal */}
      {selectedCell && !gameOver && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            {/* Modal header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
                  Find a car that is…
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  <span className="text-amber-400">{activeRow?.label}</span>
                  {" × "}
                  <span className="text-amber-400">{activeCol?.label}</span>
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="ml-4 rounded-lg p-1 text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Result flash */}
            {lastResult === "incorrect" && (
              <div className="mb-3 rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-400">
                Not quite — try another car.
              </div>
            )}

            {/* Search input */}
            <GuessInput onSelect={handleGuess} usedCarIds={usedCarIds} />

            {/* Guess counter */}
            <p className="mt-4 text-center text-xs text-gray-500">
              {guessesLeft} guess{guessesLeft !== 1 ? "es" : ""} remaining
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
