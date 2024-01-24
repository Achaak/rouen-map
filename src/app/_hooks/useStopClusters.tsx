import { useMemo } from "react";
import { useMap } from "react-map-gl";
import useSupercluster from "use-supercluster";
import { useMapContext } from "../_components/Map";
import { useDebounce } from "usehooks-ts";

// location_type: 0: Stop, 1: Station, 2: Station Entrance/Exit, 3: Generic Node, 4: Boarding Area

export const useStopClusters = () => {
  const { viewState, stops } = useMapContext();
  const { current: mapRef } = useMap();
  const viewStateDebounce = useDebounce(viewState, 1000);

  const filteredStops = useMemo(() => {
    if (!stops || !mapRef) return [];

    return stops.filter((stop) => {
      if (!stop.latitude || !stop.longitude) return false;

      // Filter location_type
      if (stop.locationType !== 0) return false;

      const bounds = mapRef.getBounds();
      return bounds.contains([stop.longitude, stop.latitude]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, mapRef, viewStateDebounce]);

  const { clusters: stopClusters } = useSupercluster({
    points: filteredStops.map((stop) => ({
      type: "Feature",
      properties: {
        cluster: false,
        ...stop,
      },
      geometry: {
        type: "Point",
        coordinates: [stop.longitude, stop.latitude],
      },
    })),
    bounds: [-180, -85, 180, 85],
    zoom: viewState.zoom,
    options: { radius: 100, maxZoom: 16 },
  });

  return {
    stopClusters,
  };
};
