<script setup lang="ts">
import { usePopupStore } from "@/store/clicker/popup";

const popupStore = usePopupStore();
const { onClick } = popupStore;
</script>

<template>
  <div mt="12" position="relative">
    <ClickerModelRotatingCursors />
    <ClickerModelPinaColada
      position="relative"
      width="256"
      height="256"
      :g-attrs="{ class: 'clickable', cursor: 'pointer' }"
      @click="onClick"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.clickable:active) {
  transform: $clickShrink;
  transform-origin: center;
}
</style>
