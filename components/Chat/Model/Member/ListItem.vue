<script setup lang="ts">
import type { User } from "@prisma/client";

interface MemberListItemProps {
  member: User;
}

const props = defineProps<MemberListItemProps>();
const { member } = $(toRefs(props));
</script>

<template>
  <v-list-item v-if="member.name" :title="member.name" :value="member.name">
    <template #prepend>
      <v-badge m="r-4" color="green" location="bottom end" dot>
        <v-avatar v-if="member.image">
          <v-img :src="member.image" :alt="member.name" />
        </v-avatar>
        <DefaultAvatar v-else :name="member.name" />
      </v-badge>
    </template>
  </v-list-item>
</template>
