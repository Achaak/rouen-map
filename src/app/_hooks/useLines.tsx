import { useMemo } from "react";
import { useMap } from "react-map-gl";
import { useMapContext } from "../_components/Map";

export const useLines = () => {
  const { lines } = useMapContext();
  const { current: mapRef } = useMap();

  const linesFiltered = useMemo(() => {
    if (!lines || !mapRef) return [];

    // return lines.map((line) => {
    //   const bounds = mapRef.getBounds();
    //   const stops = line.stops.filter((stop) => {
    //     if (!stop!.stop_lat || !stop!.stop_lon) return false;

    //     return bounds.contains([stop!.stop_lon, stop!.stop_lat]);
    //   });

    //   return {
    //     ...line,
    //     stops,
    //   };
    // });

    return lines.filter((line) => {
      if (line.stops.length === 0) return false;

      return true;
    });
  }, [lines, mapRef]);

  const linesFormatted = useMemo(() => {
    if (!linesFiltered) return [];

    return linesFiltered.map((line) => ({
      type: "Feature" as const,
      properties: {
        lineId: line.id,
        routeColor: line.route.route_color,
        routeTextColor: line.route.route_text_color,
      },
      geometry: {
        type: "LineString" as const,
        coordinates: line.stops.map((stop) => [stop!.stop_lon, stop!.stop_lat]),
      },
    }));
  }, [linesFiltered]);

  return {
    linesFormatted,
  };
};
