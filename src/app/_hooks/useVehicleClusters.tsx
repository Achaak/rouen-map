import { useMemo } from 'react';
import useSupercluster from 'use-supercluster';
import { useMapContext } from '../_components/Map';
import { useShowVehicles } from './useShowVehicles';
import { type VehicleTypeNumber } from '~/lib/vehicles';
import type Supercluster from 'supercluster';
import { type RouterOutput } from '~/server/api/root';

export const useVehicleClusters = () => {
  const { viewState, vehicles, bounds } = useMapContext();
  const { showVehicles } = useShowVehicles();

  const vehiclesGeoJson = useMemo<
    Array<
      Supercluster.PointFeature<
        RouterOutput['static']['getVehicles'][number] & {
          cluster: boolean;
        }
      >
    >
  >(() => {
    return (
      vehicles
        ?.filter((vehicle) => {
          return (
            showVehicles[vehicle.vehicleType as VehicleTypeNumber] !== false &&
            vehicle.position.latitude &&
            vehicle.position.longitude
          );
        })
        .map((vehicle) => {
          return {
            type: 'Feature',
            properties: {
              cluster: false,
              ...vehicle,
            },
            geometry: {
              type: 'Point',
              coordinates: [
                vehicle.position.longitude ?? 0,
                vehicle.position.latitude ?? 0,
              ],
            },
          };
        }) ?? []
    );
  }, [showVehicles, vehicles]);

  const { clusters: vehicleClusters } = useSupercluster({
    points: vehiclesGeoJson,
    bounds: bounds
      ? [bounds.west, bounds.south, bounds.east, bounds.north]
      : undefined,
    zoom: viewState.zoom,
    options: { radius: 100, maxZoom: 16 },
  });

  return {
    vehicleClusters,
  };
};
