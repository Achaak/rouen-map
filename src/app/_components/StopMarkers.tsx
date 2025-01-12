'use client';

import { Marker, Popup, useMap } from 'react-map-gl';
import { useMapContext } from './Map';
import { useStopClusters } from '../_hooks/useStopClusters';
import type { FC } from 'react';
import type { ClusterProperties } from 'supercluster';
import { cn } from '~/lib/utils';
import { BusStopIcon } from '~/components/icons/BusStop';
import { useShowStops } from '../_hooks/useShowStops';
import { WheelchairIcon } from '~/components/icons/Wheelchair';
import { useStopSelected } from '../_hooks/useStopSelected';
import { Skeleton } from '~/components/ui/skeleton';
import { StopIcon } from '~/components/StopIcon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { useMediaScreenValid } from '~/hooks/useScreen';

const stopContainerClass = cn(
  'bg-card border-border rounded-full border p-1.5 shadow-md relative'
);

export const StopMarkers: FC = () => {
  const { current: mapRef } = useMap();
  const { viewState, setSelectedStopId, onUnselectAll } = useMapContext();
  const { selectedStop, selectedStopInfo, isLoading } = useStopSelected();
  const { stopClusters } = useStopClusters();
  const { showStops } = useShowStops();
  const isLg = useMediaScreenValid({
    media: 'lg',
    operator: '>=',
  });

  if (!showStops) return null;

  return (
    <>
      {stopClusters
        .filter((p) => p.properties.cluster)
        .map((p) => {
          const properties = p.properties as ClusterProperties;
          const geometry = p.geometry;

          return (
            <Marker
              key={p.id}
              latitude={geometry.coordinates[1] ?? 0}
              longitude={geometry.coordinates[0] ?? 0}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                mapRef?.flyTo({
                  center: [
                    geometry.coordinates[0] ?? 0,
                    geometry.coordinates[1] ?? 0,
                  ],
                  zoom: (viewState?.zoom ?? 0) * 1.2,
                });
              }}
              style={{
                cursor: 'pointer',
              }}
            >
              <div className={stopContainerClass}>
                <BusStopIcon className="h-6 w-6 text-foreground" />
                <div className="absolute -right-2 -top-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">
                  {properties.point_count}
                </div>
              </div>
            </Marker>
          );
        })}

      {stopClusters
        .filter((p) => !p.properties.cluster)
        .map((p) => {
          const properties = p.properties;
          const geometry = p.geometry;

          if (properties.cluster) return null; // should never happen

          return (
            <Marker
              key={properties.id}
              latitude={geometry.coordinates[1] ?? 0}
              longitude={geometry.coordinates[0] ?? 0}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedStopId(properties.id);
              }}
              style={{
                cursor: 'pointer',
              }}
            >
              {properties.id === selectedStop?.id && (
                <div className="absolute left-0 top-0 h-full w-full animate-ping rounded-full bg-primary duration-1000"></div>
              )}
              <div className={stopContainerClass}>
                <StopIcon
                  location_type={properties.locationType}
                  className="h-6 w-6 text-foreground"
                />
                {properties.wheelchairBoarding && (
                  <WheelchairIcon className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary p-0.5 text-white" />
                )}
              </div>
            </Marker>
          );
        })}

      {selectedStop?.latitude && selectedStop?.longitude && (
        <Sheet open={!!selectedStop} modal={false}>
          <SheetContent
            side={isLg ? 'right' : 'bottom'}
            onClose={() => onUnselectAll()}
          >
            <SheetHeader className="flex flex-row items-center space-x-2">
              {isLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <>
                  {selectedStop.wheelchairBoarding && (
                    <WheelchairIcon className="h-5 w-5 rounded-full bg-primary p-0.5 text-white" />
                  )}
                  <SheetTitle className="text-lg font-bold">
                    {selectedStopInfo?.name}
                  </SheetTitle>
                </>
              )}
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {isLoading && <Skeleton className="h-6 w-32" />}
              {selectedStopInfo?.routes.map((route, index) => (
                <div key={index}>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-xs text-white"
                    style={{
                      backgroundColor: `#${route.color}`,
                    }}
                  >
                    {route.shortName}
                  </span>

                  {route.tripUpdates.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto lg:max-h-none">
                      <Table key={index} className="w-auto text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-center">
                              Heure prévue
                            </TableHead>
                            <TableHead className="text-center">
                              Heure réelle
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {route.tripUpdates.map((tu, index) => {
                            const arrivalTime = tu.arrivalTime
                              ? new Date(Number(tu.arrivalTime) * 1000)
                              : undefined;
                            const arrivalTimeReal = arrivalTime
                              ? new Date(arrivalTime)
                              : undefined;

                            if (tu.arrivalDelay && arrivalTimeReal) {
                              arrivalTimeReal.setSeconds(
                                arrivalTimeReal.getSeconds() + tu.arrivalDelay
                              );
                            }

                            return (
                              <TableRow key={index}>
                                <TableCell className="text-center">
                                  {arrivalTime
                                    ? arrivalTime.toLocaleTimeString()
                                    : "Aucune heure d'arrivée disponible"}
                                </TableCell>
                                <TableCell className="text-center">
                                  {arrivalTimeReal
                                    ? arrivalTimeReal.toLocaleTimeString()
                                    : "Aucune heure d'arrivée disponible"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center">Aucune donnée</div>
                  )}
                </div>
              ))}
              <Table className="w-auto text-sm">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Latitude</TableCell>
                    <TableCell>{selectedStop.latitude}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Longitude</TableCell>
                    <TableCell>{selectedStop.longitude}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
