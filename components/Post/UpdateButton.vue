<script setup lang="ts">
import { RoutePath } from "@/models/router";

interface PostUpdateButtonProps {
  postId: string;
}

const props = defineProps<PostUpdateButtonProps>();
const { postId } = $(toRefs(props));
const onUpdatePost = () => navigateTo(RoutePath.PostUpdate(postId));
</script>

<template>
  <v-btn rd="0!" icon="mdi-pencil" size="small" @click="onUpdatePost" />
</template>
