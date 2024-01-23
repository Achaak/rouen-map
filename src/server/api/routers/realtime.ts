import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getTripUpdate,
  getVehiclePosition,
  getStops,
  getTrips,
} from "~/server/lib";

export const realtimeRouter = createTRPCRouter({
  tripUpdate: publicProcedure.query(() => {
    return getTripUpdate();
  }),
  vehiclePosition: publicProcedure.query(() => {
    return getVehiclePosition();
  }),
  allStops: publicProcedure.query(() => {
    return getStops();
  }),
  allTrips: publicProcedure.query(() => {
    return getTrips();
  }),
});
