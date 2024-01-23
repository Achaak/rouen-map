import { useMemo } from "react";
import { useMap } from "react-map-gl";
import useSupercluster from "use-supercluster";
import { useMapContext } from "../_components/Map";

export const useBusClusters = () => {
  const { viewState, buses } = useMapContext();
  const { current: mapRef } = useMap();

  const filteredBuses = useMemo(() => {
    if (!buses || !mapRef) return [];

    return buses.filter((bus) => {
      if (!bus.vehicle?.position?.latitude || !bus.vehicle?.position?.longitude)
        return false;
      const bounds = mapRef.getBounds();
      return bounds.contains([
        bus.vehicle.position.longitude,
        bus.vehicle.position.latitude,
      ]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buses, mapRef, viewState]);

  const { clusters: busClusters } = useSupercluster({
    points: filteredBuses.map((bus) => ({
      type: "Feature",
      properties: { cluster: false, busId: bus.id },
      geometry: {
        type: "Point",
        coordinates: [
          bus.vehicle!.position!.longitude,
          bus.vehicle!.position!.latitude,
        ],
      },
    })),
    bounds: [-180, -85, 180, 85],
    zoom: viewState.zoom,
    options: { radius: 60, maxZoom: 16 },
  });

  return {
    busClusters,
  };
};
