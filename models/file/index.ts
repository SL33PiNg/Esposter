import type { Component } from "vue";

export interface FileRendererProps {
  url: string;
  mimetype: string;
  preview?: true;
}

export const typeRendererMap: Record<string, Component> = {
  image: defineAsyncComponent(() => import("@/components/File/Renderer/Image.vue")),
  video: defineAsyncComponent(() => import("@/components/File/Renderer/Video.vue")),
  audio: defineAsyncComponent(() => import("@/components/File/Renderer/Audio.vue")),
};
