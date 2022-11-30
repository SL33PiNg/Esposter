import { defineStore } from "pinia";

export const useClickStore = defineStore("clicker/click", () => {
  const baseClickPower = ref(1);
  const clickPower = computed(() => baseClickPower.value);
  return { baseClickPower, clickPower };
});
