import { skipHydrate } from "pinia";
import { useDisplay } from "vuetify";

export const useLayoutStore = defineStore("layout", () => {
  const { mobile } = $(useDisplay());
  const leftDrawerOpen = ref(!mobile);
  const rightDrawerOpen = ref(!mobile);
  // These variables are only affected by screen resizing
  // They will be read-only to outer components deeper in the layout
  // because we want the decision of showing the outer components (i.e. buttons that open the drawers)
  // to only be dependent on screen-resizing for better UI/UX and not disappear and shift the UI
  // suddenly whenever we open and close the drawer
  const leftDrawerOpenAuto = ref(!mobile);
  const rightDrawerOpenAuto = ref(!mobile);
  // mobile initial state can only be detected on client side so we skip SSR picking it up
  return {
    leftDrawerOpen: skipHydrate(leftDrawerOpen),
    rightDrawerOpen: skipHydrate(rightDrawerOpen),
    leftDrawerOpenAuto: skipHydrate(leftDrawerOpenAuto),
    rightDrawerOpenAuto: skipHydrate(rightDrawerOpenAuto),
  };
});
