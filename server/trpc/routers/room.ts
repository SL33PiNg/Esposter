import { InviteCodeEntity, inviteCodeSchema } from "@/models/azure/message/inviteCode";
import { AzureTable } from "@/models/azure/table";
import { prisma } from "@/prisma";
import { router } from "@/server/trpc";
import { authedProcedure, getRoomUserProcedure } from "@/server/trpc/procedure";
import { userSchema } from "@/server/trpc/routers/user";
import { AZURE_MAX_PAGE_SIZE, createEntity, getTableClient, getTopNEntities } from "@/services/azure/table";
import { inviteCodePartitionKey } from "@/services/room/table";
import { getNextCursor, READ_LIMIT } from "@/utils/pagination";
import { generateCode } from "@/utils/random";
import { ROOM_NAME_MAX_LENGTH } from "@/utils/validation";
import { odata } from "@azure/data-tables";
import { Room, User } from "@prisma/client";
import type { toZod } from "tozod";
import { z } from "zod";

export const roomSchema: toZod<Room> = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(ROOM_NAME_MAX_LENGTH),
  image: z.string().nullable(),
  creatorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

const readRoomInputSchema = roomSchema.shape.id.optional();
export type ReadRoomInput = z.infer<typeof readRoomInputSchema>;

const readRoomsInputSchema = z.object({ cursor: z.string().nullable() });
export type ReadRoomsInput = z.infer<typeof readRoomsInputSchema>;

const createRoomInputSchema = roomSchema.pick({ name: true });
export type CreateRoomInput = z.infer<typeof createRoomInputSchema>;

const updateRoomInputSchema = roomSchema.pick({ id: true }).merge(roomSchema.partial().pick({ name: true }));
export type UpdateRoomInput = z.infer<typeof updateRoomInputSchema>;

const deleteRoomInputSchema = roomSchema.shape.id;
export type DeleteRoomInput = z.infer<typeof deleteRoomInputSchema>;

const joinRoomInputSchema = z.object({ inviteCode: inviteCodeSchema.shape.rowKey });
export type JoinRoomInput = z.infer<typeof joinRoomInputSchema>;

const leaveRoomInputSchema = z.object({ roomId: roomSchema.shape.id });
export type LeaveRoomInput = z.infer<typeof leaveRoomInputSchema>;

const readMembersInputSchema = z.object({
  roomId: roomSchema.shape.id,
  filter: userSchema.pick({ name: true }).optional(),
});
export type ReadMembersInput = z.infer<typeof readMembersInputSchema>;

const createMembersInputSchema = z.object({
  roomId: roomSchema.shape.id,
  userIds: z.array(userSchema.shape.id).min(1),
});
export type CreateMembersInput = z.infer<typeof createMembersInputSchema>;

const generateInviteCodeInputSchema = z.object({
  roomId: roomSchema.shape.id,
});
export type GenerateInviteCodeInput = z.infer<typeof generateInviteCodeInputSchema>;

// For room-related queries/mutations we don't need to grab the room user procedure
// as the SQL WHERE clause inherently contains logic to check if the user is a member/creator of the room
export const roomRouter = router({
  readRoom: authedProcedure.input(readRoomInputSchema).query(({ input, ctx }) =>
    input
      ? prisma.room.findFirst({ where: { id: input, users: { some: { userId: ctx.session.user.id } } } })
      : prisma.room.findFirst({
          where: { users: { some: { userId: ctx.session.user.id } } },
          orderBy: { updatedAt: "desc" },
        })
  ),
  readRooms: authedProcedure.input(readRoomsInputSchema).query(async ({ input: { cursor }, ctx }) => {
    const rooms = await prisma.room.findMany({
      take: READ_LIMIT + 1,
      where: { users: { some: { userId: ctx.session.user.id } } },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { updatedAt: "desc" },
    });
    return { rooms, nextCursor: getNextCursor(rooms, "id", READ_LIMIT) };
  }),
  createRoom: authedProcedure.input(createRoomInputSchema).mutation(({ input, ctx }) =>
    prisma.room.create({
      data: { ...input, creatorId: ctx.session.user.id, users: { create: { userId: ctx.session.user.id } } },
    })
  ),
  updateRoom: authedProcedure.input(updateRoomInputSchema).mutation(async ({ input: { id, ...rest }, ctx }) => {
    // @NOTE: We should be able to return records we updated on updateMany in the future
    // https://github.com/prisma/prisma/issues/5019
    const { count } = await prisma.room.updateMany({ data: rest, where: { id, creatorId: ctx.session.user.id } });
    return count === 1 ? prisma.room.findUnique({ where: { id } }) : null;
  }),
  deleteRoom: authedProcedure.input(deleteRoomInputSchema).mutation(async ({ input, ctx }) => {
    try {
      const count = await prisma.$transaction(async (prisma) => {
        await prisma.roomsOnUsers.deleteMany({ where: { roomId: input } });
        const { count } = await prisma.room.deleteMany({
          where: { id: input, creatorId: ctx.session.user.id },
        });
        return count;
      });
      return count === 1;
    } catch {
      return false;
    }
  }),
  joinRoom: authedProcedure.input(joinRoomInputSchema).mutation(async ({ input: { inviteCode }, ctx }) => {
    const tableClient = await getTableClient(AzureTable.Invites);
    const now = new Date();
    const invites = await getTopNEntities(tableClient, 1, InviteCodeEntity, {
      filter: odata`PartitionKey eq ${inviteCodePartitionKey} and RowKey eq ${inviteCode} and expiredAt lt ${now.toISOString()}`,
    });
    if (invites.length === 0) return false;

    await prisma.roomsOnUsers.create({ data: { roomId: invites[0].roomId, userId: ctx.session.user.id } });
    return true;
  }),
  leaveRoom: authedProcedure.input(leaveRoomInputSchema).mutation(async ({ input: { roomId }, ctx }) => {
    await prisma.roomsOnUsers.delete({ where: { userId_roomId: { roomId, userId: ctx.session.user.id } } });
    return true;
  }),
  readMembers: getRoomUserProcedure(readMembersInputSchema, "roomId")
    .input(readMembersInputSchema)
    .query<User[]>(async ({ input: { roomId, filter } }) => {
      const name = filter?.name ?? undefined;
      const members = await prisma.user.findMany({
        where: { name: { contains: name, mode: "insensitive" }, rooms: { some: { roomId } } },
      });
      return members;
    }),
  createMembers: getRoomUserProcedure(createMembersInputSchema, "roomId")
    .input(createMembersInputSchema)
    .mutation(async ({ input: { roomId, userIds } }) => {
      const payload = await prisma.roomsOnUsers.createMany({ data: userIds.map((userId) => ({ roomId, userId })) });
      return payload.count;
    }),
  generateInviteCode: getRoomUserProcedure(generateInviteCodeInputSchema, "roomId")
    .input(generateInviteCodeInputSchema)
    .mutation(async ({ input: { roomId }, ctx }) => {
      const tableClient = await getTableClient(AzureTable.Invites);

      // Delete expired invite codes
      const now = new Date();
      const expiredResults = await getTopNEntities(tableClient, AZURE_MAX_PAGE_SIZE, InviteCodeEntity, {
        filter: odata`PartitionKey eq ${inviteCodePartitionKey} and expiredAt lt ${now.toISOString()}`,
      });
      for (const { partitionKey, rowKey } of expiredResults) await tableClient.deleteEntity(partitionKey, rowKey);

      let inviteCode = generateCode(6);
      // Check if the invite code already exists in the table
      let results = await getTopNEntities(tableClient, 1, InviteCodeEntity, {
        filter: odata`PartitionKey eq ${inviteCodePartitionKey} and RowKey eq ${inviteCode}`,
      });

      while (results.length > 0) {
        // If the code already exists, generate a new code and check again
        inviteCode = generateCode(6);
        results = await getTopNEntities(tableClient, 1, InviteCodeEntity, {
          filter: odata`PartitionKey eq ${inviteCodePartitionKey} and RowKey eq ${inviteCode}`,
        });
      }

      await createEntity<InviteCodeEntity>(tableClient, {
        partitionKey: inviteCodePartitionKey,
        rowKey: inviteCode,
        creatorId: ctx.session.user.id,
        roomId,
        createdAt: now,
        // Expire 1 day from now
        expiredAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      });

      return inviteCode;
    }),
});
