"use client";

import { useVehicleClusters } from "../_hooks/useVehicleClusters";
import { Marker, Popup, useMap } from "react-map-gl";
import { useMapContext } from "./Map";
import { useEffect, type FC, useState } from "react";
import type { ClusterProperties } from "supercluster";
import { cn } from "~/lib/utils";
import { BusIcon } from "~/components/icons/Bus";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ArrowDownIcon } from "~/components/icons/ArrowDown";
import { VehicleIcon } from "~/components/VehicleIcon";
import { useVehicleSelected } from "../_hooks/useVehicleSelected";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";

const vehicleContainerClass = cn(
  "bg-card border-border rounded-full border p-2 shadow-md relative",
);

export const VehicleMarkers: FC = () => {
  const { current: mapRef } = useMap();
  const { viewState, setSelectedVehicleId, isOnDrag } = useMapContext();
  const { selectedVehicle, isLoading, selectedVehicleInfo } =
    useVehicleSelected();

  // const selectedBusRoute = routes?.find(
  //   (r) => r.route_id === Number(selectedBus?.vehicle?.trip?.routeId),
  // );
  // const selectedBusTrip = tripsUpdate?.find(
  //   (t) => t.tripUpdate?.trip?.tripId === selectedBus?.vehicle?.trip?.tripId,
  // );

  const { vehicleClusters } = useVehicleClusters();
  const [isFollow, setIsFollow] = useState(false);

  // const { data: stopTimes, isLoading: isLoadingStopTimes } =
  //   api.realtime.getStopTimes.useQuery(
  //     {
  //       stopIds:
  //         selectedBusTrip?.tripUpdate?.stopTimeUpdate?.map(
  //           (stu) => stu.stopId,
  //         ) ?? [],
  //       tripId: selectedBusTrip?.tripUpdate?.trip?.tripId ?? "",
  //     },
  //     {
  //       enabled:
  //         !!selectedBusTrip?.tripUpdate?.stopTimeUpdate?.length &&
  //         !!selectedBusTrip?.tripUpdate?.trip?.tripId,
  //     },
  //   );

  // const stopTimesFormatted = useMemo(() => {
  //   if (!stopTimes) return [];

  //   return stopTimes.map((st) => {
  //     const tripUpdate = selectedBusTrip?.tripUpdate?.stopTimeUpdate?.find(
  //       (stu) => stu.stopId === st.stop_id,
  //     );
  //   });
  // }, [stopTimes]);

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

  // const selectedBusStopTime: {
  //   stop_name: string;
  // }[] = [];
  // selectedBusTrip?.tripUpdate?.stopTimeUpdate?.forEach((stu) => {
  //   const stop = stops?.find((s) => s.stop_id === stu.stopId);

  //   if (!stop) return;

  //   const stopTime = stopTimes?.find((t) => t.stop_id === stop.stop_id);
  //   console.log(stopTime, stopTimes?.length);

  //   if (!stopTime) return;

  //   selectedBusStopTime.push({
  //     stop_name: stop.stop_name,
  //   });
  //   // str += `${stop?.stop_name} (${stu.stopSequence}) ${stu.arrival?.delay} ${stu.departure?.delay}\n`;
  // });

  // console.log(selectedBusStopTime);

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
                cursor: "pointer",
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
                cursor: "pointer",
                transition: "transform 500ms",
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
              maxWidth: "none",
              width: "auto",
              transition: "transform 500ms",
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
                <CardDescription>
                  Direction: {selectedVehicleInfo?.direction}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* {isLoadingStopTimes ? (
                <p>Chargement...</p>
              ) : (
                <ul>
                  {stopTimesFormatted?.map((st) => (
                    <li key={st.stop_id}>
                      {st.arrival_time} ({st.stop_sequence})
                    </li>
                  ))}
                </ul>
              )} */}
              <p>Latitude: {selectedVehicle.position.latitude}</p>
              <p>Longitude: {selectedVehicle.position.longitude}</p>
            </CardContent>
            <CardFooter>
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
                {!isFollow ? "Suivre" : "Ne pas suivre"}
              </Button>
            </CardFooter>
          </Popup>
        )}
    </>
  );
};
