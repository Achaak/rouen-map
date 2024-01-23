import { useMemo } from "react";
import { useMap } from "react-map-gl";
import useSupercluster from "use-supercluster";
import { useMapContext } from "../_components/Map";

export const useStopClusters = () => {
  const { viewState, stops } = useMapContext();
  const { current: mapRef } = useMap();

  const filteredStops = useMemo(() => {
    if (!stops || !mapRef) return [];

    return stops.filter((stop) => {
      if (!stop.stop_lat || !stop.stop_lon) return false;
      const bounds = mapRef.getBounds();
      return bounds.contains([stop.stop_lon, stop.stop_lat]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, mapRef, viewState]);

  const { clusters: stopClusters } = useSupercluster({
    points: filteredStops.map((stop) => ({
      type: "Feature",
      properties: { cluster: false, stopId: stop.stop_id },
      geometry: {
        type: "Point",
        coordinates: [stop.stop_lon, stop.stop_lat],
      },
    })),
    bounds: [-180, -85, 180, 85],
    zoom: viewState.zoom,
    options: { radius: 60, maxZoom: 16 },
  });

  return {
    stopClusters,
  };
};