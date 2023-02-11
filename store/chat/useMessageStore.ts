import type { AzureUpdateEntity } from "@/models/azure";
import type { MessageEntity } from "@/models/azure/message";
import type { CreateMessageInput, DeleteMessageInput } from "@/server/trpc/routers/message";
import { useMessageInputStore } from "@/store/chat/useMessageInputStore";
import { useRoomStore } from "@/store/chat/useRoomStore";

export const useMessageStore = defineStore("chat/message", () => {
  const { $client } = useNuxtApp();
  const roomStore = useRoomStore();
  const messageInputStore = useMessageInputStore();
  const messagesMap = ref<Record<string, MessageEntity[]>>({});
  const messageList = computed(() => {
    if (!roomStore.currentRoomId || !messagesMap.value[roomStore.currentRoomId]) return null;
    return messagesMap.value[roomStore.currentRoomId];
  });
  const pushMessageList = (messages: MessageEntity[]) => {
    if (!roomStore.currentRoomId || !messagesMap.value[roomStore.currentRoomId]) return;
    messagesMap.value[roomStore.currentRoomId].push(...messages);
  };

  const messageListNextCursorMap = ref<Record<string, string | null>>({});
  const messageListNextCursor = computed(() => {
    if (!roomStore.currentRoomId || !messageListNextCursorMap.value[roomStore.currentRoomId]) return null;
    return messageListNextCursorMap.value[roomStore.currentRoomId];
  });
  const updateMessageListNextCursor = (messageListNextCursor: string | null) => {
    if (!roomStore.currentRoomId) return;
    messageListNextCursorMap.value[roomStore.currentRoomId] = messageListNextCursor;
  };

  const initialiseMessageList = (messages: MessageEntity[]) => {
    if (!roomStore.currentRoomId) return;
    messagesMap.value[roomStore.currentRoomId] = messages;
  };
  const createMessage = (newMessage: CreateMessageInput & MessageEntity) => {
    if (!roomStore.currentRoomId || !messagesMap.value[roomStore.currentRoomId]) return;
    messagesMap.value[roomStore.currentRoomId].unshift(newMessage);
  };
  const sendMessage = async () => {
    if (!roomStore.currentRoomId || !messageInputStore.messageInput) return;

    const createMessageInput: CreateMessageInput = {
      partitionKey: roomStore.currentRoomId,
      message: messageInputStore.messageInput,
    };
    messageInputStore.updateMessageInput("");
    const newMessage = await $client.message.createMessage.mutate(createMessageInput);
    if (newMessage) createMessage(newMessage);
  };
  const updateMessage = (updatedMessage: AzureUpdateEntity<MessageEntity>) => {
    if (!roomStore.currentRoomId || !messagesMap.value[roomStore.currentRoomId]) return;

    const messages = messagesMap.value[roomStore.currentRoomId];
    const index = messages.findIndex(
      (m) => m.partitionKey === updatedMessage.partitionKey && m.rowKey === updatedMessage.rowKey
    );
    if (index > -1) messagesMap.value[roomStore.currentRoomId][index] = { ...messages[index], ...updatedMessage };
  };
  const deleteMessage = (input: DeleteMessageInput) => {
    if (!roomStore.currentRoomId || !messagesMap.value[roomStore.currentRoomId]) return;

    const messages = messagesMap.value[roomStore.currentRoomId];
    messagesMap.value[roomStore.currentRoomId] = messages.filter(
      (m) => !(m.partitionKey === input.partitionKey && m.rowKey === input.rowKey)
    );
  };

  return {
    messageList,
    pushMessageList,
    messageListNextCursor,
    updateMessageListNextCursor,
    initialiseMessageList,
    createMessage,
    sendMessage,
    updateMessage,
    deleteMessage,
  };
});
