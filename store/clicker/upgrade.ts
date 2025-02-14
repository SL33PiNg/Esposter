import type { Upgrade } from "@/models/clicker";
import { useGameStore } from "@/store/clicker/game";
import { usePointStore } from "@/store/clicker/point";

export const useUpgradeStore = defineStore("clicker/upgrade", () => {
  const gameStore = useGameStore();
  const { game } = $(storeToRefs(gameStore));
  const pointStore = usePointStore();
  const { decrementPoints } = pointStore;

  const upgradeList = ref<Upgrade[]>([]);
  const initialiseUpgradeList = (upgrades: Upgrade[]) => {
    upgradeList.value = upgrades;
  };

  const unlockedUpgrades = computed<Upgrade[]>(() =>
    upgradeList.value.filter((u) =>
      u.unlockConditions.every((uc) => {
        for (const boughtBuilding of game.boughtBuildings)
          if (boughtBuilding.name === uc.target) return boughtBuilding.amount >= uc.amount;

        for (const boughtUpgrade of game.boughtUpgrades) if (boughtUpgrade.name === uc.target) return true;

        return false;
      })
    )
  );

  const createBoughtUpgrade = (newUpgrade: Upgrade) => {
    game.boughtUpgrades.push(newUpgrade);
    decrementPoints(newUpgrade.price);
  };
  return { upgradeList, initialiseUpgradeList, unlockedUpgrades, createBoughtUpgrade };
});
