"use client";

import { useBusClusters } from "../_hooks/useBusClusters";
import { Marker, Popup, useMap } from "react-map-gl";
import { FaBus } from "react-icons/fa";
import { useMapContext } from "./Map";
import type { FC } from "react";
import type { ClusterProperties } from "supercluster";

export const BusMarkers: FC = () => {
  const { current: mapRef } = useMap();
  const { viewState, setSelectedBusId, selectedBus } = useMapContext();
  const { busClusters } = useBusClusters();

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
                // transition: "transform 0.2s",
              }}
            >
              <FaBus className="h-6 w-6" />
              <div className="absolute -right-2 -top-2 rounded-full bg-blue-500 px-1 text-xs text-white">
                {properties.point_count}
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
                // transition: "transform 0.2s",
              }}
            >
              <FaBus className="h-6 w-6" />
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
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">Bus {selectedBus.id}</h1>
              <p>Latitude: {selectedBus.vehicle?.position?.latitude}</p>
              <p>Longitude: {selectedBus.vehicle?.position?.longitude}</p>
            </div>
          </Popup>
        )}
    </>
  );
};
