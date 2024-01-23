"use client";

import { useBusClusters } from "../_hooks/useBusClusters";
import { Marker, Popup, useMap } from "react-map-gl";
import { useMapContext } from "./Map";
import type { FC } from "react";
import type { ClusterProperties } from "supercluster";
import { cn } from "~/lib/utils";
import { BusIcon } from "~/components/icons/Bus";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useShowBuses } from "../_hooks/useShowBuses";

const busContainerClass = cn(
  "bg-card border-border rounded-full border p-2 shadow-md relative",
);

export const BusMarkers: FC = () => {
  const { current: mapRef } = useMap();
  const { viewState, setSelectedBusId, selectedBus } = useMapContext();
  const { busClusters } = useBusClusters();
  const { showBuses } = useShowBuses();

  if (!showBuses) return null;

  return (
    <>
      {busClusters
        .filter((p) => p.properties.cluster)
        .map((point) => {
          const properties = point.properties as ClusterProperties;
          const geometry = point.geometry;

          return (
            <Marker
              key={point.id}
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
              <div className={busContainerClass}>
                <BusIcon className="text-foreground h-6 w-6" />
                <div className="bg-primary absolute -right-2 -top-2 rounded-full px-1.5 py-0.5 text-xs text-white">
                  {properties.point_count}
                </div>
              </div>
            </Marker>
          );
        })}

      {busClusters
        .filter((p) => !p.properties.cluster)
        .map((point) => {
          const properties = point.properties;
          const geometry = point.geometry;

          if (properties.cluster) return null; // should never happen

          return (
            <Marker
              key={properties.busId}
              latitude={geometry.coordinates[1] ?? 0}
              longitude={geometry.coordinates[0] ?? 0}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedBusId(properties.busId);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <div className={busContainerClass}>
                <BusIcon className="text-foreground h-6 w-6" />
              </div>
            </Marker>
          );
        })}

      {selectedBus?.vehicle?.position?.latitude &&
        selectedBus?.vehicle?.position?.longitude && (
          <Popup
            anchor="top"
            offset={25}
            latitude={selectedBus.vehicle?.position?.latitude}
            longitude={selectedBus.vehicle?.position?.longitude}
            onClose={() => setSelectedBusId(undefined)}
            closeButton={false}
          >
            <CardHeader>
              <CardTitle>Bus</CardTitle>
              <CardDescription>{selectedBus.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Latitude: {selectedBus.vehicle?.position?.latitude}</p>
              <p>Longitude: {selectedBus.vehicle?.position?.longitude}</p>
            </CardContent>
          </Popup>
        )}
    </>
  );
};
