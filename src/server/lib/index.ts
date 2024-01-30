import { got } from 'got';
import { FeedMessage } from './gen/ts/gtfs-realtime';
import { z } from 'zod';
import fs from 'node:fs';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import pMemoize from 'p-memoize';
import ExpiryMap from 'expiry-map';
import { ms } from '~/lib/ms';
import { stat } from 'fs/promises';

export const VEHICLE_POSITION =
  'https://www.reseau-astuce.fr/ftp/gtfsrt/Astuce.VehiclePosition.pb';

export const TRIP_UPDATE =
  'https://www.reseau-astuce.fr/ftp/gtfsrt/Astuce.TripUpdate.pb';

// export const TRIP_UPDATE =
//   "https://proxy.transport.data.gouv.fr/resource/ilevia-lille-gtfs-rt";

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
  stop_code: z.string().optional(),
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
  path: string
): Promise<z.infer<T>[]> => {
  const records: z.infer<T>[] = [];
  const headers: string[] = [];
  const cleanPath = join(cwd(), path);
  const parser = fs.createReadStream(cleanPath).pipe(
    parse({
      // txt options if any
    })
  );
  parser.on('readable', function () {
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
          { depth: 10 }
        );
      }
    }
  });
  await finished(parser);
  return records;
};

export const getStopsRaw = async () => {
  const results = await processFile(stopSchema, '/app/data/ASTUCE/stops.txt');
  return results;
};

export const getStops = pMemoize(getStopsRaw, {
  cache: new ExpiryMap(ms.days(10)),
});

const tripSchema = z.object({
  route_id: z.string(),
  service_id: z.string(),
  trip_id: z.string(),
  trip_headsign: z.string(),
  direction_id: z.coerce.number(),
  block_id: z.coerce.number(),
  wheelchair_accessible: z.coerce.boolean(),
  bikes_allowed: z.coerce.boolean(),
});

export type Trip = z.infer<typeof tripSchema>;

export const getTripsRaw = async () => {
  const results = await processFile(tripSchema, '/app/data/ASTUCE/trips.txt');
  return results;
};

export const getTrips = pMemoize(getTripsRaw, {
  cache: new ExpiryMap(ms.days(10)),
});

const routeSchema = z.object({
  route_id: z.string(),
  agency_id: z.string(),
  route_short_name: z.string(),
  route_long_name: z.string(),
  route_type: z.coerce.number(),
  route_color: z.string(),
  route_text_color: z.string(),
  route_url: z.string(),
  route_sort_order: z.coerce.number().optional(),
});

export type Route = z.infer<typeof routeSchema>;

export const getRoutesRaw = async () => {
  const results = await processFile(routeSchema, '/app/data/ASTUCE/routes.txt');
  return results;
};

export const getRoutes = pMemoize(getRoutesRaw, {
  cache: new ExpiryMap(ms.days(10)),
});

const agencySchema = z.object({
  agency_id: z.string(),
  agency_name: z.string(),
  agency_url: z.string(),
  agency_timezone: z.string(),
  agency_lang: z.string(),
  agency_phone: z.string(),
  agency_fare_url: z.string(),
  agency_email: z.string(),
});

export type Agency = z.infer<typeof agencySchema>;

export const getAgenciesRaw = async () => {
  const results = await processFile(
    agencySchema,
    '/app/data/ASTUCE/agency.txt'
  );
  return results;
};

export const getAgencies = pMemoize(getAgenciesRaw, {
  cache: new ExpiryMap(ms.days(10)),
});

const stopTimeSchema = z.object({
  trip_id: z.string(),
  arrival_time: z.string(),
  departure_time: z.string(),
  stop_id: z.string(),
  stop_sequence: z.coerce.number(),
  pickup_type: z.coerce.number(),
  drop_off_type: z.coerce.number(),
});

export type StopTime = z.infer<typeof stopTimeSchema>;

export const getStopTimesRaw = async () => {
  const results = await processFile(
    stopTimeSchema,
    '/app/data/ASTUCE/stop_times.txt'
  );
  return results;
};

export const getStopTimes = pMemoize(getStopTimesRaw, {
  cache: new ExpiryMap(ms.days(10)),
});

// const main = async () => {
//   try {
//     const stops = await getStopTimes();
//     console.log(stops.slice(0, 3));
//   } catch (e) {
//     console.error(e);
//   }
// };

// void main();
