<script setup lang="ts">
import { Target } from "@/models/clicker";
import { useGameStore } from "@/store/clicker/game";
import { filename } from "pathe/utils";
import { v4 as uuidV4 } from "uuid";

const gameStore = useGameStore();
const { game } = $(storeToRefs(gameStore));
const amount = $computed(() => {
  const cursorBuilding = game.boughtBuildings.find((b) => b.name === Target.Cursor);
  return cursorBuilding?.amount ?? 0;
});
const rotatingDivIds = $computed(() => Array.from({ length: amount }, () => uuidV4()));

// @NOTE: Hacky way to do dynamic image paths with nuxt 3 for now
// https://github.com/nuxt/framework/issues/7121
const icon = $computed(() => {
  const glob = import.meta.glob("@/assets/clicker/icons/menu/*.png", { eager: true, import: "default" });
  const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value as unknown as string])
  );
  return images.Cursor;
});

const animateCursors = (amount: number) => {
  const initialRotationOffsets = Array.from({ length: amount }, (_, index) => (360 / amount) * index);

  for (let i = 0; i < amount; i++) {
    const rotationOffset = initialRotationOffsets[i];
    const rotatingDivId = rotatingDivIds[i];
    const rotatingDiv = document.getElementById(rotatingDivId) as HTMLDivElement;
    rotatingDiv.animate(
      [{ transform: `rotate(${rotationOffset}deg)` }, { transform: `rotate(${rotationOffset + 360}deg)` }],
      { duration: 60 * 1000, iterations: Infinity }
    );
  }
};

onMounted(() => animateCursors(amount));
watch(
  () => amount,
  (newValue) => animateCursors(newValue),
  { flush: "post" }
);
</script>

<template>
  <div
    v-for="rotatingDivId in rotatingDivIds"
    :id="rotatingDivId"
    :key="rotatingDivId"
    w="64"
    h="64"
    position="absolute"
    top="0"
  >
    <v-img position="absolute" width="2rem" height="2rem" rotate="135" :src="icon" :alt="Target.Cursor" />
  </div>
</template>
