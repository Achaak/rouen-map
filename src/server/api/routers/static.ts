import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  getVehiclePosition,
  getStops,
  getTrips,
  getRoutes,
  getAgencies,
  getStopTimes,
  getTripUpdate,
} from '~/server/lib';

export const staticRouter = createTRPCRouter({
  getVehicles: publicProcedure.query(async () => {
    const vehiclePositions = await getVehiclePosition();
    const routes = await getRoutes();

    return vehiclePositions.entity.map((vehiclePosition) => {
      // Get the route type from the route_id
      const route = routes?.find(
        (r) => r.route_id === vehiclePosition.vehicle?.trip?.routeId
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
  getVehicleInfo: publicProcedure
    .input(
      z.object({
        vehicleId: z.string(),
      })
    )
    .query(async ({ input: { vehicleId } }) => {
      const [stops, tripUpdates, routes, stopTimes, vehiclePositions] =
        await Promise.all([
          getStops(),
          getTripUpdate(),
          getRoutes(),
          getStopTimes(),
          getVehiclePosition(),
        ]);

      // Get the vehicle position from the vehicle id
      const vehiclePosition = vehiclePositions.entity.find(
        (vehiclePosition) => vehiclePosition.vehicle?.vehicle?.id === vehicleId
      );

      if (!vehiclePosition) {
        return null;
      }

      // Get the route type from the route id
      const route = routes?.find(
        (r) => r.route_id === vehiclePosition.vehicle?.trip?.routeId
      );

      // Get the trip update from the route id
      const tripUpdate = tripUpdates.entity.find(
        (tu) =>
          tu.tripUpdate?.trip?.tripId === vehiclePosition.vehicle?.trip?.tripId
      );

      // Get the stop times from the trip id
      const stopTime = stopTimes.filter(
        (st) => st.trip_id === tripUpdate?.tripUpdate?.trip?.tripId
      );

      const tripUpdateStopTime = tripUpdate?.tripUpdate?.stopTimeUpdate?.map(
        (stu) => {
          const st = stopTime.find((st) => st.stop_id === stu.stopId);
          const stop = stops.find((s) => s.stop_id === stu.stopId);

          return {
            stopName: stop?.stop_name,
            arrivalTime: stu?.arrival?.time,
            arrival_delay: stu?.arrival?.delay,
            stopSequence: st?.stop_sequence,
          };
        }
      );

      return {
        routeShortName: route?.route_short_name,
        routeLongName: route?.route_long_name,
        direction:
          route?.route_long_name.split(' <> ')[
            vehiclePosition.vehicle?.trip?.directionId === 0 ? 1 : 0
          ],
        stopTime: tripUpdateStopTime,
      };
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
        name: stop.stop_name,
      };
    });
  }),
  getStopInfo: publicProcedure
    .input(
      z.object({
        stopId: z.string(),
      })
    )
    .query(async ({ input: { stopId } }) => {
      const [allStops, allStopTimes, allTripUpdates, allRoutes, allTrips] =
        await Promise.all([
          await getStops(),
          await getStopTimes(),
          await getTripUpdate(),
          await getRoutes(),
          await getTrips(),
        ]);

      // Get stops
      const stops = allStops.find((s) => s.stop_id === stopId);

      if (!stops) {
        return null;
      }

      // Get stop times
      const stopTimes = allStopTimes.filter((st) => st.stop_id === stopId);

      // Get trips
      const trips = allTrips.filter((t) => {
        return stopTimes.find((st) => st.trip_id === t.trip_id);
      });

      // Get routes
      const routes = allRoutes.filter((r) => {
        return trips.find((t) => t.route_id === r.route_id);
      });

      // Get trip updates
      const tripUpdates = allTripUpdates.entity.filter((tu) => {
        return trips.find(
          (t) =>
            tu.tripUpdate?.trip?.tripId === t.trip_id &&
            tu.tripUpdate?.stopTimeUpdate?.some((stu) => stu.stopId === stopId)
        );
      });

      return {
        name: stops.stop_name,
        routes: routes.map((r) => {
          const tu = tripUpdates.filter(
            (tu) => tu.tripUpdate?.trip?.routeId === r.route_id
          );

          const tripUpdatesForRoute = [];
          for (const t of tu) {
            if (!t.tripUpdate?.stopTimeUpdate) {
              continue;
            }
            for (const stu of t.tripUpdate?.stopTimeUpdate) {
              if (stu.stopId === stopId) {
                tripUpdatesForRoute.push(stu);
              }
            }
          }

          return {
            shortName: r.route_short_name,
            longName: r.route_long_name,
            color: r.route_color,
            tripUpdates: tripUpdatesForRoute.map((tu) => {
              return {
                arrivalTime: tu.arrival?.time,
                arrivalDelay: tu.arrival?.delay,
              };
            }),
          };
        }),
      };
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
      })
    )
    .query(async ({ input: { stopIds, tripId } }) => {
      const stopTimes = await getStopTimes();

      return stopTimes.filter(
        (stopTime) =>
          stopTime.trip_id === tripId && stopIds.includes(stopTime.stop_id)
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
        (stopTime) => stopTime.trip_id === firstTrip.trip_id
      );

      const stopsForTrip = stopTimesForTrip
        .map((stopTime) => {
          return stops.find((stop) => stop.stop_id === stopTime.stop_id);
        })
        .sort((a, b) => {
          const aStopTime = stopTimesForTrip.find(
            (stopTime) => stopTime.stop_id === a?.stop_id
          );
          const bStopTime = stopTimesForTrip.find(
            (stopTime) => stopTime.stop_id === b?.stop_id
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
