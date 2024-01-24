"use client";

import { Marker, Popup, useMap } from "react-map-gl";
import { useMapContext } from "./Map";
import { useStopClusters } from "../_hooks/useStopClusters";
import type { FC } from "react";
import type { ClusterProperties } from "supercluster";
import { cn } from "~/lib/utils";
import { BusStopIcon } from "~/components/icons/BusStop";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useShowStops } from "../_hooks/useShowStops";
import { WheelchairIcon } from "~/components/icons/Wheelchair";
import { Separator } from "~/components/ui/separator";
import { useStopSelected } from "../_hooks/useStopSelected";

const stopContainerClass = cn(
  "bg-card border-border rounded-full border p-1.5 shadow-md relative",
);

export const StopMarkers: FC = () => {
  const { current: mapRef } = useMap();
  const { viewState, setSelectedStopId } = useMapContext();
  const { selectedStop } = useStopSelected();
  const { stopClusters } = useStopClusters();
  const { showStops } = useShowStops();

  if (!showStops) return null;

  return (
    <>
      {stopClusters
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
                // transition: "transform 0.2s",
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
        .map((point) => {
          const properties = point.properties;
          const geometry = point.geometry;

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
                cursor: "pointer",
                // transition: "transform 0.2s",
              }}
            >
              <div className={stopContainerClass}>
                <BusStopIcon className="h-6 w-6 text-foreground" />
                {properties.wheelchairBoarding && (
                  <WheelchairIcon className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary p-0.5 text-white" />
                )}
              </div>
            </Marker>
          );
        })}

      {selectedStop?.latitude && selectedStop?.longitude && (
        <Popup
          anchor="top"
          offset={25}
          latitude={selectedStop.latitude}
          longitude={selectedStop.longitude}
          onClose={() => setSelectedStopId(undefined)}
          closeButton={false}
        >
          <CardHeader>
            <CardTitle>{selectedStop.name}</CardTitle>
            {/* <CardDescription>Code: {selectedStop.stop_code}</CardDescription> */}
          </CardHeader>
          <CardContent>
            {/* <p>
              Embarquement en fauteuil roulant :{" "}
              {selectedStop.wheelchair_boarding ? "Oui" : "Non"}
            </p> */}
            <Separator className="my-2" />

            <p>Latitude: {selectedStop.latitude}</p>
            <p>Longitude: {selectedStop.longitude}</p>
          </CardContent>
        </Popup>
      )}
    </>
  );
};
