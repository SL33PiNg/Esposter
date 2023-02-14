import { useEmojiStore } from "@/store/chat/useEmojiStore";
import { useRoomStore } from "@/store/chat/useRoomStore";
import type { Unsubscribable } from "@trpc/server/observable";

export const useEmojiSubscribables = () => {
  const { $client } = useNuxtApp();
  const roomStore = useRoomStore();
  const { currentRoomId } = $(storeToRefs(roomStore));
  const emojiStore = useEmojiStore();
  const { createEmoji, updateEmoji, deleteEmoji } = emojiStore;

  let createEmojiUnsubscribable = $ref<Unsubscribable>();
  let updateEmojiUnsubscribable = $ref<Unsubscribable>();
  let deleteEmojiUnsubscribable = $ref<Unsubscribable>();

  onMounted(() => {
    if (!currentRoomId) return;

    createEmojiUnsubscribable = $client.emoji.onCreateEmoji.subscribe(
      { partitionKey: currentRoomId },
      { onData: (data) => createEmoji(data) }
    );
    updateEmojiUnsubscribable = $client.emoji.onUpdateEmoji.subscribe(
      { partitionKey: currentRoomId },
      { onData: (data) => updateEmoji(data) }
    );
    deleteEmojiUnsubscribable = $client.emoji.onDeleteEmoji.subscribe(
      { partitionKey: currentRoomId },
      { onData: (data) => deleteEmoji(data) }
    );
  });

  onUnmounted(() => {
    createEmojiUnsubscribable?.unsubscribe();
    updateEmojiUnsubscribable?.unsubscribe();
    deleteEmojiUnsubscribable?.unsubscribe();
  });
};