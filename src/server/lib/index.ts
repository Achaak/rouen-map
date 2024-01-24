import { got } from "got";
import { FeedMessage } from "./gen/ts/gtfs-realtime";
import { z } from "zod";
import fs from "node:fs";
import { parse } from "csv-parse";
import { finished } from "stream/promises";

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

  return feedMessage;
};

const stopSchema = z.object({
  stop_id: z.string(),
  stop_code: z.string(),
  stop_name: z.string(),
  stop_lat: z.coerce.number(),
  stop_lon: z.coerce.number(),
  location_type: z.coerce.number(),
  parent_station: z.string(),
  wheelchair_boarding: z.coerce.boolean(),
});

export type Stop = z.infer<typeof stopSchema>;

const processFile = async <T extends z.ZodTypeAny>(
  schema: T,
  path: string,
): Promise<z.infer<T>[]> => {
  const records: z.infer<T>[] = [];
  const headers: string[] = [];
  const parser = fs.createReadStream(path).pipe(
    parse({
      // CSV options if any
    }),
  );
  parser.on("readable", function () {
    let record: string[] | null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    while ((record = parser.read()) !== null) {
      // Work with each record
      if (headers.length === 0) {
        headers.push(...record);
        continue;
      }
      const row: Record<string, string> = {};
      for (const [i, header] of headers.entries()) {
        // Trim the header to remove any non-visible characters
        const cleanedHeader = header.trim();
        row[cleanedHeader] = String(record[i]);
      }
      const res = schema.safeParse(row);
      if (res.success) {
        records.push(res.data as z.infer<T>);
      } else {
        console.dir(
          {
            error: res.error,
            row,
          },
          { depth: 10 },
        );
      }
    }
  });
  await finished(parser);
  return records;
};

export const getStops = async () => {
  const results = await processFile(stopSchema, "./data/ASTUCE/stops.csv");
  return results;
};

const tripSchema = z.object({
  route_id: z.coerce.number(),
  service_id: z.string(),
  trip_id: z.coerce.number(),
  trip_headsign: z.string(),
  direction_id: z.coerce.number(),
  block_id: z.coerce.number(),
  wheelchair_accessible: z.coerce.boolean(),
  bikes_allowed: z.coerce.boolean(),
});

export type Trip = z.infer<typeof tripSchema>;

export const getTrips = async () => {
  const results = await processFile(tripSchema, "./data/ASTUCE/trips.csv");
  return results;
};

const routeSchema = z.object({
  route_id: z.coerce.number(),
  agency_id: z.coerce.number(),
  route_short_name: z.string(),
  route_long_name: z.string(),
  route_type: z.coerce.number(),
  route_color: z.string(),
  route_text_color: z.string(),
  route_url: z.string(),
  route_sort_order: z.coerce.number(),
});

export type Route = z.infer<typeof routeSchema>;

export const getRoutes = async () => {
  const results = await processFile(routeSchema, "./data/ASTUCE/routes.csv");
  return results;
};

const agencySchema = z.object({
  agency_id: z.coerce.number(),
  agency_name: z.string(),
  agency_url: z.string(),
  agency_timezone: z.string(),
  agency_lang: z.string(),
  agency_phone: z.string(),
  agency_fare_url: z.string(),
  agency_email: z.string(),
});

export type Agency = z.infer<typeof agencySchema>;

export const getAgencies = async () => {
  const results = await processFile(agencySchema, "./data/ASTUCE/agency.csv");
  return results;
};

const stopTimeSchema = z.object({
  trip_id: z.coerce.number(),
  arrival_time: z.string(),
  departure_time: z.string(),
  stop_id: z.string(),
  stop_sequence: z.coerce.number(),
  pickup_type: z.coerce.number(),
  drop_off_type: z.coerce.number(),
});

export type StopTime = z.infer<typeof stopTimeSchema>;

export const getStopTimes = async () => {
  const results = await processFile(
    stopTimeSchema,
    "./data/ASTUCE/stop_times.csv",
  );
  return results;
};

// const main = async () => {
//   try {
//     const stops = await getStopTimes();
//     console.log(stops.slice(0, 3));
//   } catch (e) {
//     console.error(e);
//   }
// };

// void main();
