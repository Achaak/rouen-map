import { useMemo } from 'react';
import useSupercluster from 'use-supercluster';
import { useMapContext } from '../_components/Map';
import type Supercluster from 'supercluster';
import { type RouterOutput } from '~/server/api/root';

// location_type: 0: Stop, 1: Station, 2: Station Entrance/Exit, 3: Generic Node, 4: Boarding Area

export const useStopClusters = () => {
  const { viewState, stops, bounds } = useMapContext();

  const stopGeoJson = useMemo<
    Array<
      Supercluster.PointFeature<
        RouterOutput['static']['getStops'][number] & {
          cluster: boolean;
        }
      >
    >
  >(() => {
    return (
      stops
        // .filter((stop) => {
        //   return stop.locationType !== 0;
        // })
        ?.map((stop) => {
          return {
            type: 'Feature',
            properties: {
              cluster: false,
              ...stop,
            },
            geometry: {
              type: 'Point',
              coordinates: [stop.longitude, stop.latitude],
            },
          };
        }) ?? []
    );
  }, [stops]);

  const { clusters: stopClusters } = useSupercluster({
    points: stopGeoJson,
    bounds: bounds
      ? [
          bounds.west ?? 0,
          bounds.south ?? 0,
          bounds.east ?? 0,
          bounds.north ?? 0,
        ]
      : undefined,
    zoom: viewState.zoom,
    options: { radius: 125, maxZoom: 16 },
  });

  return {
    stopClusters,
  };
};
