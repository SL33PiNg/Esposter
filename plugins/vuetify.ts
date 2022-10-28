import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// @NOTE: We should be able to just import from vuetify
import { createVuetify, ThemeDefinition, VuetifyOptions } from "vuetify/lib/framework.mjs";

type PaletteMode = "light" | "dark";

const baseColors: Record<PaletteMode, ThemeDefinition["colors"]> = {
  light: {
    background: "#dae0e6",
    surface: "#ffffff",
    border: "#cccccc",
  },
  dark: {
    background: "#18191a",
    surface: "#36393f",
    border: "#cccccc",
  },
};

const getBaseColorsExtension = (colors: ThemeDefinition["colors"]) => ({
  surfaceOpacity80: `${colors?.surface}cc`,
});

const theme: VuetifyOptions["theme"] = {
  themes: {
    light: {
      dark: false,
      colors: {
        ...baseColors.light,
        ...getBaseColorsExtension(baseColors.light),
      },
    },
    dark: {
      dark: true,
      colors: {
        ...baseColors.dark,
        ...getBaseColorsExtension(baseColors.dark),
      },
    },
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({ components, directives, theme });
  nuxtApp.vueApp.use(vuetify);
});
