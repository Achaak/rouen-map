'use client';

import { useVehicleClusters } from '../_hooks/useVehicleClusters';
import { Marker, Popup, useMap } from 'react-map-gl';
import { useMapContext } from './Map';
import { useEffect, type FC, useState } from 'react';
import type { ClusterProperties } from 'supercluster';
import { cn } from '~/lib/utils';
import { BusIcon } from '~/components/icons/Bus';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { ArrowDownIcon } from '~/components/icons/ArrowDown';
import { VehicleIcon } from '~/components/VehicleIcon';
import { useVehicleSelected } from '../_hooks/useVehicleSelected';
import { Skeleton } from '~/components/ui/skeleton';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

const vehicleContainerClass = cn(
  'bg-card border-border rounded-full border p-2 shadow-md relative'
);

export const VehicleMarkers: FC = () => {
  const { current: mapRef } = useMap();
  const { viewState, setSelectedVehicleId, isOnDrag } = useMapContext();
  const { selectedVehicle, isLoading, selectedVehicleInfo } =
    useVehicleSelected();

  const { vehicleClusters } = useVehicleClusters();
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    if (!selectedVehicle || !isFollow) return;

    flyToFollow({
      zoom: viewState.zoom,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, selectedVehicle]);

  const flyToFollow = ({ zoom }: { zoom: number }) => {
    if (!selectedVehicle) return;

    mapRef?.flyTo({
      center: [
        selectedVehicle?.position?.longitude ?? 0,
        selectedVehicle?.position?.latitude ?? 0,
      ],
      zoom,
    });
  };

  useEffect(() => {
    if (selectedVehicle) return;
    setIsFollow(false);
  }, [selectedVehicle]);

  useEffect(() => {
    setIsFollow(false);
  }, [isOnDrag]);

  return (
    <>
      {vehicleClusters
        .filter((v) => v.properties.cluster)
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
              <div className={vehicleContainerClass}>
                <BusIcon className="h-6 w-6 text-foreground" />
                <div className="absolute -right-2 -top-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">
                  {properties.point_count}
                </div>
              </div>
            </Marker>
          );
        })}

      {vehicleClusters
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
                setSelectedVehicleId(properties.id);
              }}
              style={{
                cursor: 'pointer',
                // transition: 'transform 500ms',
                // transition: isOnMove ? undefined : "transform 500ms",
                // transitionDelay: "500ms",
              }}
            >
              <div className={vehicleContainerClass}>
                <VehicleIcon
                  route_type={properties?.vehicleType}
                  className="h-6 w-6 text-foreground"
                  style={{
                    color: properties?.color
                      ? `#${properties?.color}`
                      : undefined,
                  }}
                />
                {!!properties.position.bearing && (
                  <div
                    className="absolute bottom-0 left-0 right-0 top-0 transition-transform"
                    style={{
                      transform: `rotate(${properties.position.bearing + 135 - viewState.bearing}deg)`,
                    }}
                  >
                    <div className="absolute -bottom-1.5 -left-1.5 rounded-full bg-card px-0.5 py-0.5 text-foreground">
                      <ArrowDownIcon className="h-4 w-4 rotate-45" />
                    </div>
                  </div>
                )}
              </div>
            </Marker>
          );
        })}

      {selectedVehicle?.position?.latitude &&
        selectedVehicle?.position?.longitude && (
          <Popup
            anchor="top"
            offset={25}
            latitude={selectedVehicle.position.latitude}
            longitude={selectedVehicle.position.longitude}
            onClose={() => setSelectedVehicleId(undefined)}
            closeButton={false}
            style={{
              maxWidth: 'none',
              width: 'auto',
              // transition: 'transform 500ms',
              // transition: isOnMove ? undefined : "transform 500ms",
              // transitionDelay: "500ms",
            }}
          >
            <CardHeader>
              {isLoading ? (
                <Skeleton className="h-6 w-56" />
              ) : (
                <CardTitle className="text-lg font-bold">
                  {selectedVehicleInfo?.routeLongName} (
                  {selectedVehicleInfo?.routeShortName})
                </CardTitle>
              )}
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <div className="flex flex-row items-center justify-between space-x-2">
                  <CardDescription>
                    Direction: {selectedVehicleInfo?.direction}
                  </CardDescription>
                  <Button
                    size="xs"
                    onClick={() => {
                      if (isFollow) {
                        setIsFollow(false);
                        return;
                      }

                      setIsFollow(true);
                      flyToFollow({
                        zoom: 16,
                      });
                    }}
                  >
                    {!isFollow ? 'Suivre' : 'Ne pas suivre'}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>
                  {selectedVehicleInfo?.stopTime?.length && (
                    <Table className="text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead className="text-center">
                            Heure prévue
                          </TableHead>
                          <TableHead className="text-center">
                            Heure réelle
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedVehicleInfo.stopTime.map((st, index) => {
                          const arrivalTime = st.arrivalTime
                            ? new Date(Number(st.arrivalTime) * 1000)
                            : undefined;
                          const arrivalTimeReal = arrivalTime
                            ? new Date(arrivalTime)
                            : undefined;

                          if (st.arrival_delay && arrivalTimeReal) {
                            arrivalTimeReal.setSeconds(
                              arrivalTimeReal.getSeconds() + st.arrival_delay
                            );
                          }

                          return (
                            <TableRow key={index}>
                              <TableCell className="font-semibold">
                                {st.stopName}
                              </TableCell>
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
                  )}
                </>
              )}

              <Table className="w-auto text-sm">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Latitude</TableCell>
                    <TableCell>{selectedVehicle.position.latitude}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Longitude</TableCell>
                    <TableCell>{selectedVehicle.position.longitude}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Popup>
        )}
    </>
  );
};
