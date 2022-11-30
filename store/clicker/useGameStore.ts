import { Game } from "@/models/clicker/game";
import { CLICKER_STORE } from "@/util/constants.client";
import { isServer } from "@/util/constants.common";
import { defineStore, skipHydrate } from "pinia";

export const useGameStore = defineStore("clicker/game", () => {
  const clickerStore = isServer() ? null : localStorage.getItem(CLICKER_STORE);
  const initialGame: Game = { noPoints: 0 };
  const game = ref<Game | null>(isServer() ? null : clickerStore ? JSON.parse(clickerStore) : initialGame);
  const incrementPoints = (points: number) => {
    if (!game.value) return;
    game.value.noPoints += points;
    localStorage.setItem(CLICKER_STORE, JSON.stringify(game.value));
  };
  // Game state requires local storage which only exists in the client so we won't hydrate in server
  return { game: skipHydrate(game), incrementPoints };
});
