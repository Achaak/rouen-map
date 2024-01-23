import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getTripUpdate,
  getVehiclePosition,
  getStops,
  getTrips,
  getRoutes,
  getAgencies,
  getStopTimes,
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
  allRoutes: publicProcedure.query(() => {
    return getRoutes();
  }),
  allAgencies: publicProcedure.query(() => {
    return getAgencies();
  }),
  allStopTimes: publicProcedure.query(() => {
    return getStopTimes();
  }),
  lines: publicProcedure.query(async () => {
    const [stops, trips, routes, stopTimes] = await Promise.all([
      getStops(),
      getTrips(),
      getRoutes(),
      getStopTimes(),
    ]);

    const data = [];

    for (const route of routes) {
      const firstTrip = trips.find((trip) => trip.route_id === route.route_id)!;

      const stopTimesForTrip = stopTimes.filter(
        (stopTime) => stopTime.trip_id === firstTrip.trip_id,
      );

      const stopsForTrip = stopTimesForTrip
        .map((stopTime) => {
          return stops.find((stop) => stop.stop_id === stopTime.stop_id);
        })
        .sort((a, b) => {
          const aStopTime = stopTimesForTrip.find(
            (stopTime) => stopTime.stop_id === a?.stop_id,
          );
          const bStopTime = stopTimesForTrip.find(
            (stopTime) => stopTime.stop_id === b?.stop_id,
          );

          if (!aStopTime || !bStopTime) {
            return 0;
          }

          return aStopTime.stop_sequence - bStopTime.stop_sequence;
        });

      data.push({
        id: Math.random().toString(36).substr(2, 9),
        route,
        stops: stopsForTrip,
      });
    }

    return data;
  }),
});
