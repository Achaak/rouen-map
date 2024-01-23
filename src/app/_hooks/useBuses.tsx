import { useMemo } from "react";
import { type ViewState, useMap } from "react-map-gl";
import useSupercluster from "use-supercluster";
import { api } from "~/trpc/react";

export const useBuses = ({
  selectedBusId,
  viewState,
}: {
  selectedBusId?: string;
  viewState: ViewState;
}) => {
  const { current: mapRef } = useMap();
  const { data: buses } = api.realtime.vehiclePosition.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const selectedBus = buses?.entity.find((bus) => bus.id === selectedBusId);

  console.log(mapRef);
  const filteredBuses = useMemo(() => {
    if (!buses || !mapRef) return [];

    return buses.entity.filter((bus) => {
      if (!bus.vehicle?.position?.latitude || !bus.vehicle?.position?.longitude)
        return false;
      const bounds = mapRef.getBounds();
      return bounds.contains([
        bus.vehicle.position.latitude,
        bus.vehicle.position.longitude,
      ]);
    });
  }, [buses, mapRef]);

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
    selectedBus,
    buses,
    busClusters,
  };
};
