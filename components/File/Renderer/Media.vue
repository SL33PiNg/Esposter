<script setup lang="ts">
import type { FileRendererProps } from "@/models/file";
import { typeRendererMap } from "@/models/file";
import { getLanguageForFileUrl } from "@/services/file/code";
import type { Component } from "vue";

const props = defineProps<FileRendererProps>();
const { url, mimetype } = $(toRefs(props));

const defaultRenderer = defineAsyncComponent(() => import("@/components/File/Renderer/Default.vue"));
const rendererProps = $ref<FileRendererProps & Record<string, string>>({ url, mimetype });
const renderer = $computed<Component>(() => {
  const result =
    typeRendererMap[mimetype] || typeRendererMap[mimetype.substring(0, mimetype.indexOf("/"))] || defaultRenderer;
  if (result !== defaultRenderer) return result;

  const language = getLanguageForFileUrl(url);
  if (!language) return result;

  rendererProps.language = language;
  return defineAsyncComponent(() => import("@/components/File/Renderer/Code.vue"));
});
</script>

<template>
  <component :is="renderer" :="rendererProps" />
</template>
