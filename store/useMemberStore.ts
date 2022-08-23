import { useRoomStore } from "@/store/useRoomStore";
import type { User } from "@prisma/client";
import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", () => {
  const roomStore = useRoomStore();
  const membersMap = ref<Record<string, User[]>>({});
  const pushMemberList = (members: User[]) => {
    if (!roomStore.currentRoomId || !membersMap.value[roomStore.currentRoomId]) return;
    membersMap.value[roomStore.currentRoomId].push(...members);
  };
  const memberList = computed(() => {
    if (!roomStore.currentRoomId || !membersMap.value[roomStore.currentRoomId]) return [];
    return membersMap.value[roomStore.currentRoomId];
  });

  const memberListNextCursorMap = ref<Record<string, string | null>>({});
  const memberListNextCursor = computed(() => {
    if (!roomStore.currentRoomId || !memberListNextCursorMap.value[roomStore.currentRoomId]) return null;
    return memberListNextCursorMap.value[roomStore.currentRoomId];
  });
  const updateMemberListNextCursor = (memberListNextCursor: string | null) => {
    if (!roomStore.currentRoomId) return;
    memberListNextCursorMap.value[roomStore.currentRoomId] = memberListNextCursor;
  };

  const initialiseMembersList = (members: User[]) => {
    if (!roomStore.currentRoomId) return;
    membersMap.value[roomStore.currentRoomId] = members;
  };
  const createMember = (newMember: User) => {
    if (!roomStore.currentRoomId) return;

    const members = membersMap.value[roomStore.currentRoomId] ?? [];
    members.push(newMember);
    membersMap.value[roomStore.currentRoomId] = members;
  };
  const updateMember = (updatedMember: User) => {
    if (!roomStore.currentRoomId) return;

    const members = membersMap.value[roomStore.currentRoomId] ?? [];
    const index = members.findIndex((m) => m.id === updatedMember.id);
    if (index > -1) membersMap.value[roomStore.currentRoomId][index] = { ...members[index], ...updatedMember };
  };

  return {
    memberList,
    pushMemberList,
    memberListNextCursor,
    updateMemberListNextCursor,
    initialiseMembersList,
    createMember,
    updateMember,
  };
});