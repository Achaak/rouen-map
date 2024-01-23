import { got } from "got";
import { FeedMessage } from "./gen/ts/gtfs-realtime";
import { zcsv, parseCSVContent } from "./zod-csv/index";
import { z } from "zod";
import { readFile } from "node:fs/promises";

export const VEHICLE_POSITION =
  "https://www.reseau-astuce.fr/ftp/gtfsrt/Astuce.VehiclePosition.pb";

export const TRIP_UPDATE =
  "https://www.reseau-astuce.fr/ftp/gtfsrt/Astuce.TripUpdate.pb";

export const getVehiclePosition = async () => {
  const data = await got.get(VEHICLE_POSITION).buffer();
  const feedMessage = FeedMessage.decode(data);
  return feedMessage;
};

export const getTripUpdate = async () => {
  const data = await got.get(TRIP_UPDATE).buffer();
  const feedMessage = FeedMessage.decode(data);
  console.dir(feedMessage.entity[0]?.tripUpdate, { depth: 10 });
  return feedMessage;
};

const stopSchema = z.object({
  stop_id: zcsv.string(),
  stop_code: zcsv.string(z.string().optional()),
  stop_name: zcsv.string(z.string().optional()),
  stop_lat: zcsv.number(),
  stop_lon: zcsv.number(),
  location_type: zcsv.string(z.string().optional()),
  parent_station: zcsv.string(z.string().optional()),
  wheelchair_boarding: zcsv.string(z.string().optional()),
});

export type Stop = z.infer<typeof stopSchema>;

export const getStops = async () => {
  const input = await readFile("./data/ASTUCE/stops.csv", "utf-8");
  const result = parseCSVContent(input, stopSchema);

  // if (!result.success) {
  //   throw result.errors;
  // }

  return result.validRows;
};

const tripSchema = z.object({
  route_id: zcsv.string(z.string().optional()),
  service_id: zcsv.string(z.string().optional()),
  trip_id: zcsv.string(z.string().optional()),
  trip_headsign: zcsv.string(z.string().optional()),
  direction_id: zcsv.string(z.string().optional()),
  block_id: zcsv.string(z.string().optional()),
  wheelchair_accessible: zcsv.string(z.string().optional()),
  bikes_allowed: zcsv.string(z.string().optional()),
});

export type Trip = z.infer<typeof tripSchema>;

export const getTrips = async () => {
  const input = await readFile("./data/ASTUCE/trips.csv", "utf-8");
  const result = parseCSVContent(input, tripSchema);

  // if (!result.success) {
  //   throw result.errors;
  // }

  return result.validRows;
};

// const main = async () => {
//   try {
//     const stops = await getStops();
//     console.log(stops);
//   } catch (e) {
//     console.error(e);
//   }
// };

// void main();
