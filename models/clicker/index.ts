export enum ItemType {
  Upgrade = "Upgrade",
  Building = "Building",
  Mouse = "Mouse",
}

export enum CursorUpgradeName {
  "Reinforced Index Finger" = "Reinforced Index Finger",
  "Carpal Tunnel Prevention Cream" = "Carpal Tunnel Prevention Cream",
  Ambidextrous = "Ambidextrous",
  "Thousand Fingers" = "Thousand Fingers",
  "Million Fingers" = "Million Fingers",
  "Billion Fingers" = "Billion Fingers",
  "Trillion Fingers" = "Trillion Fingers",
  "Quadrillion Fingers" = "Quadrillion Fingers",
  "Quintillion Fingers" = "Quintillion Fingers",
  "Sextillion Fingers" = "Sextillion Fingers",
  "Septillion Fingers" = "Septillion Fingers",
  "Octillion Fingers" = "Octillion Fingers",
  "Nonillion Fingers" = "Nonillion Fingers",
  "Decillion Fingers" = "Decillion Fingers",
}

export enum GrandmaUpgradeName {
  "Forwards From Grandma" = "Forwards From Grandma",
  "Steel-plated Rolling Pins" = "Steel-plated Rolling Pins",
  "Lubricated Dentures" = "Lubricated Dentures",
  "Prune Juice" = "Prune Juice",
  "Double-thick Glasses" = "Double-thick Glasses",
  "Aging Agents" = "Aging Agents",
  "Xtreme Walkers" = "Xtreme Walkers",
  "The Unbridling" = "The Unbridling",
  "Reverse Dementia" = "Reverse Dementia",
  "Timeproof Hair Dyes" = "Timeproof Hair Dyes",
  "Good Manners" = "Good Manners",
  "Generation Degeneration" = "Generation Degeneration",
  "Visits" = "Visits",
  "Kitchen Cabinets" = "Kitchen Cabinets",
}

export const UpgradeName = { ...CursorUpgradeName };
export type UpgradeName = CursorUpgradeName;

export enum BuildingName {
  Cursor = "Cursor",
  Grandma = "Grandma",
  Farm = "Farm",
  Mine = "Mine",
  Factory = "Factory",
  Bank = "Bank",
  Temple = "Temple",
  "Wizard Tower" = "Wizard Tower",
  Shipment = "Shipment",
  "Alchemy Lab" = "Alchemy Lab",
  Portal = "Portal",
  "Time Machine" = "Time Machine",
  "Antimatter Condenser" = "Antimatter Condenser",
  Prism = "Prism",
  Chancemaker = "Chancemaker",
  "Fractal Engine" = "Fractal Engine",
  "Javascript Console" = "Javascript Console",
  Idleverse = "Idleverse",
  "Cortex Baker" = "Cortex Baker",
}

export const Target = { ...ItemType, ...UpgradeName, ...BuildingName };
export type Target = ItemType | UpgradeName | BuildingName;

export enum EffectType {
  Additive = "Additive",
  Multiplicative = "Multiplicative",
  // Adds value based on number of specific buildings we have
  BuildingAdditive = "BuildingAdditive",
  // Considers all buildings except for buildings we specify
  BuildingAdditiveNor = "BuildingAdditiveNor",
  UpgradeMultiplier = "UpgradeMultiplier",
}

export interface EffectConfiguration {
  type: EffectType;
  // Only used for effect types that are based off other specific targets
  // e.g. BuildingAdditive requires number of buildings (targets)
  targets?: Target[];
}

export interface Effect {
  value: number;
  targets: Target[];
  configuration: EffectConfiguration;
}

export interface UnlockCondition {
  target: Target;
  amount: number;
}

export interface Upgrade<TName = UpgradeName> {
  name: TName;
  description: string;
  flavorDescription: string;
  price: number;
  effects: Effect[];
  unlockConditions: UnlockCondition[];
}

export interface Building {
  name: BuildingName;
  flavorDescription: string;
  basePrice: number;
  baseValue: number;
}

export interface BuildingWithStats extends Building {
  amount: number;
  producedValue: number;
}

export interface Game {
  noPoints: number;
  boughtUpgrades: Upgrade[];
  boughtBuildings: BuildingWithStats[];
  createdAt: Date;
}
