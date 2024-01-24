import { z } from "zod";
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
  getVehicles: publicProcedure.query(async () => {
    const vehiclePositions = await getVehiclePosition();
    const routes = await getRoutes();

    return vehiclePositions.entity.map((vehiclePosition) => {
      // Get the route type from the route_id
      const route = routes?.find(
        (r) => r.route_id === Number(vehiclePosition.vehicle?.trip?.routeId),
      );

      return {
        id: vehiclePosition.vehicle?.vehicle?.id,
        position: {
          latitude: vehiclePosition.vehicle?.position?.latitude,
          longitude: vehiclePosition.vehicle?.position?.longitude,
          bearing: vehiclePosition.vehicle?.position?.bearing,
        },
        vehicleType: route?.route_type,
        color: route?.route_color,
      };
    });
  }),
  allStops: publicProcedure.query(() => {
    return getStops();
  }),
  getStops: publicProcedure.query(async () => {
    const stops = await getStops();

    return stops.map((stop) => {
      return {
        id: stop.stop_id,
        latitude: stop.stop_lat,
        longitude: stop.stop_lon,
        locationType: stop.location_type,
        wheelchairBoarding: stop.wheelchair_boarding,
      };
    });
  }),
  getStop: publicProcedure
    .input(
      z.object({
        stopId: z.string(),
      }),
    )
    .query(async ({ input: { stopId } }) => {
      const stops = await getStops();

      return stops.find((stop) => stop.stop_id === stopId);
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
  getStopTimes: publicProcedure
    .input(
      z.object({
        stopIds: z.string().array(),
        tripId: z.string(),
      }),
    )
    .query(async ({ input: { stopIds, tripId } }) => {
      const stopTimes = await getStopTimes();

      return stopTimes.filter(
        (stopTime) =>
          stopTime.trip_id === Number(tripId) &&
          stopIds.includes(stopTime.stop_id),
      );
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
