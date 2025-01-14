import { prisma } from "@/prisma";
import { publicProcedure } from "@/server/trpc";
import { isAuthed } from "@/server/trpc/middleware/auth";
import { isRateLimited } from "@/server/trpc/middleware/rateLimiter";
import { UUID_REGEX } from "@/utils/uuid";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const rateLimitedProcedure = publicProcedure.use(isRateLimited);
export const authedProcedure = rateLimitedProcedure.use(isAuthed);

export const getRoomUserProcedure = <T extends z.ZodObject<z.ZodRawShape>>(schema: T, key: keyof T["shape"] & string) =>
  authedProcedure.use(async ({ ctx, rawInput, next }) => {
    const result = schema.safeParse(rawInput);
    if (!result.success) throw new TRPCError({ code: "BAD_REQUEST" });

    const value = result.data[key];
    if (typeof value !== "string") throw new TRPCError({ code: "BAD_REQUEST" });

    const roomId = value.match(UUID_REGEX)?.[0];
    if (!roomId) throw new TRPCError({ code: "BAD_REQUEST" });

    const isMember = await prisma.roomsOnUsers.exists({ userId: ctx.session.user.id, roomId });
    if (!isMember) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next();
  });

export const getRoomOwnerProcedure = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  key: keyof T["shape"] & string
) =>
  authedProcedure.use(async ({ ctx, rawInput, next }) => {
    const result = schema.safeParse(rawInput);
    if (!result.success) throw new TRPCError({ code: "BAD_REQUEST" });

    const value = result.data[key];
    if (typeof value !== "string") throw new TRPCError({ code: "BAD_REQUEST" });

    const roomId = value.match(UUID_REGEX)?.[0];
    if (!roomId) throw new TRPCError({ code: "BAD_REQUEST" });

    const isOwner = await prisma.room.exists({ id: roomId, creatorId: ctx.session.user.id });
    if (!isOwner) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next();
  });
