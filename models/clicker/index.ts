export enum UpgradeTarget {
  Cursor = "Cursor",
}

export enum UpgradeType {
  Additive = "Additive",
  Multiplicative = "Multiplicative",
}

export interface Upgrade {
  name: string;
  description: string;
  flavorDescription: string;
  price: number;
  value: number;
  upgradeTarget: UpgradeTarget;
  upgradeType: UpgradeType;
}

export interface Game {
  noPoints: number;
  boughtUpgradeList: Upgrade[];
}
