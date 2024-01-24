import { useMemo } from "react";
import { useMap } from "react-map-gl";
import useSupercluster from "use-supercluster";
import { useMapContext } from "../_components/Map";
import { useDebounce } from "usehooks-ts";
import { useShowVehicles } from "./useShowVehicles";
import { type VehicleTypeNumber } from "~/lib/vehicles";

export const useVehicleClusters = () => {
  const { viewState, vehicles } = useMapContext();
  const { current: mapRef } = useMap();
  const viewStateDebounce = useDebounce(viewState, 1000);
  const { showVehicles } = useShowVehicles();

  const filteredVehicles = useMemo(() => {
    if (!vehicles || !mapRef) return [];

    return vehicles.filter((vehicle) => {
      // Filter vehicles by type
      if (showVehicles[vehicle.vehicleType as VehicleTypeNumber] === false) {
        return false;
      }

      // Filter vehicles without position
      if (!vehicle.position.latitude || !vehicle.position.longitude) {
        return false;
      }

      // Filter if vehicle is in the map bounds
      const bounds = mapRef.getBounds();
      return bounds.contains([
        vehicle.position.longitude,
        vehicle.position.latitude,
      ]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, mapRef, viewStateDebounce, showVehicles]);

  const { clusters: vehicleClusters } = useSupercluster({
    points: filteredVehicles.map((vehicle) => ({
      type: "Feature",
      properties: { cluster: false, ...vehicle },
      geometry: {
        type: "Point",
        coordinates: [
          vehicle.position.longitude ?? 0,
          vehicle.position.latitude ?? 0,
        ],
      },
    })),
    bounds: [-180, -85, 180, 85],
    zoom: viewState.zoom,
    options: { radius: 60, maxZoom: 16 },
  });

  return {
    vehicleClusters,
  };
};
