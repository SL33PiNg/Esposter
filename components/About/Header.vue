<script setup lang="ts">
import { useDisplay } from "vuetify";

const isDark = useIsDark();
const { smAndDown } = $(useDisplay());
</script>

<template>
  <div text="center">
    <div font="900" leading="tight" :class="{ accent: isDark }" :text="smAndDown ? '5xl' : '7xl'">
      The
      <span :class="{ accent: !isDark }">Progressive</span>
      <br />
      JavaScript Application
    </div>
    <br />
    <div class="text-grey" text="2xl">An approachable, performant and versatile javascript application.</div>
  </div>
</template>

<style scoped lang="scss">
.accent {
  color: transparent;
  background-image: $vueGradient;
  background-clip: text;
}
</style>
