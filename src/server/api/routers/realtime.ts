import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getTripUpdate, getVehiclePosition } from "~/server/lib";

export const realtimeRouter = createTRPCRouter({
  tripUpdate: publicProcedure.query(() => {
    return getTripUpdate();
  }),
  vehiclePosition: publicProcedure.query(() => {
    return getVehiclePosition();
  }),
});
