import { useMemo } from "react";
import { useMap } from "react-map-gl";
import { useMapContext } from "../_components/Map";

export const useLines = () => {
  const { viewState, lines } = useMapContext();
  const { current: mapRef } = useMap();

  const filteredLines = useMemo(() => {
    if (!lines || !mapRef) return [];

    // return lines.filter((line) => {
    //   if (!bus.vehicle?.position?.latitude || !bus.vehicle?.position?.longitude)
    //     return false;
    //   const bounds = mapRef.getBounds();
    //   return bounds.contains([
    //     bus.vehicle.position.longitude,
    //     bus.vehicle.position.latitude,
    //   ]);
    // });
    return lines;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, mapRef, viewState]);

  const linesFormatted = filteredLines.map((line) => ({
      type: "Feature" as const,
      properties: { lineId: line.id, routeColor: line.route.route_color, routeTextColor: line.route.route_text_color},
      geometry: {
        type: "LineString" as const,
        coordinates: line.stops.map((stop) => [
          stop!.stop_lon,
          stop!.stop_lat,
        ])
      },
    }));

  return {
    linesFormatted,
  };
};
