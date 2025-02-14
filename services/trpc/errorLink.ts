import { RoutePath } from "@/models/router";
import type { AppRouter } from "@/server/trpc/routers";
import { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";

export const errorLink: TRPCLink<AppRouter> =
  () =>
  ({ next, op }) =>
    observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next: observer.next,
        error: (err) => {
          observer.error(err);
          if (err.data && (err.data.code === "UNAUTHORIZED" || err.data.code === "FORBIDDEN"))
            navigateTo(RoutePath.Login);
        },
        complete: observer.complete,
      });
      return unsubscribe;
    });
