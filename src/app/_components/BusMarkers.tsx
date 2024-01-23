"use client";

import { useBuses } from "../_hooks/useBuses";
import { Marker, useMap } from "react-map-gl";
import { FaBus } from "react-icons/fa";

export const BusMarkers = () => {
  const { current: mapRef } = useMap();
  const { busClusters } = useBuses({ selectedBusId });

  return busClusters.map((point) => {
    const properties = point.properties || {};
    const geometry = point.geometry;

    if (properties.cluster)
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
  });
};
