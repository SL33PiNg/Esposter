<script setup lang="ts">
import { RoutePath } from "@/models/router";
import { gsap } from "gsap";

const backgroundImageUrl = `url(${NOT_FOUND_BACKGROUND})`;

setResponseStatus(404);

onMounted(() => {
  gsap.to(".hover", {
    duration: 3,
    x: gsap.utils.random(5, 10),
    y: gsap.utils.random(10, 100),
    rotation: gsap.utils.random(-20, 20),
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
});
</script>

<template>
  <NuxtLayout>
    <div class="image" h="full" display="flex" flex="col" justify="center" items="center">
      <div mt="25" display="flex" flex="col" items="center" z="1">
        <div class="text-#ddd" text="center 5xl">Lost in space?</div>
        <NuxtInvisibleLink pt="4" :to="RoutePath.Index">
          <StyledButton>Go back home</StyledButton>
        </NuxtInvisibleLink>
      </div>
      <div class="hover" mt="-25">
        <VisualFloatingAstronaut />
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.image {
  background-image: v-bind(backgroundImageUrl);
  background-color: #000;
  background-position: center;
  background-size: cover;
}
</style>
