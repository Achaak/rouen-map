"use client";

import { Marker, Popup, useMap } from "react-map-gl";
import { FaRegCircle } from "react-icons/fa";
import { useMapContext } from "./Map";
import { useStopClusters } from "../_hooks/useStopClusters";
import type { FC } from "react";
import type { ClusterProperties } from "supercluster";

export const StopMarkers: FC = () => {
  const { current: mapRef } = useMap();
  const { viewState, selectedStop, setSelectedStopId } = useMapContext();
  const { stopClusters } = useStopClusters();

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
              <FaRegCircle className="h-6 w-6" />
              <div className="absolute -right-2 -top-2 rounded-full bg-blue-500 px-1 text-xs text-white">
                {properties.point_count}
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
              key={properties.stopId}
              latitude={geometry.coordinates[1] ?? 0}
              longitude={geometry.coordinates[0] ?? 0}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedStopId(properties.stopId);
              }}
              style={{
                cursor: "pointer",
                // transition: "transform 0.2s",
              }}
            >
              <FaRegCircle className="h-6 w-6" />
            </Marker>
          );
        })}

      {selectedStop?.stop_lat && selectedStop?.stop_lon && (
        <Popup
          anchor="top"
          offset={25}
          latitude={selectedStop.stop_lat}
          longitude={selectedStop.stop_lon}
          onClose={() => setSelectedStopId(undefined)}
          closeButton={false}
        >
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Stop {selectedStop.stop_id}</h1>
            <p>Latitude: {selectedStop.stop_lat}</p>
            <p>Longitude: {selectedStop.stop_lon}</p>
          </div>
        </Popup>
      )}
    </>
  );
};
