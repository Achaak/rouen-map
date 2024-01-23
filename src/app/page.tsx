"use client";

import {
  Popup,
  NavigationControl,
  GeolocateControl,
  Marker,
  type MapRef,
  FullscreenControl,
  ScaleControl,
  type ViewState,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaBus, FaRegCircle } from "react-icons/fa";
import { useCallback, useMemo, useRef, useState } from "react";
import { api } from "~/trpc/react";
import useSupercluster from "use-supercluster";
import { useBuses } from "./_hooks/useBuses";
import { Map } from "./_components/Map";

const initialViewState: ViewState = {
  latitude: 49.433331,
  longitude: 1.08333,
  zoom: 13,
  bearing: 0,
  pitch: 0,
  padding: {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  },
};

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [selectedBusId, setSelectedBusId] = useState<string>();
  const [selectedStopId, setSelectedStopId] = useState<string>();
  const mapRef = useRef<MapRef>(null);
  const { data: stops } = api.realtime.allStops.useQuery();
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const { busClusters, selectedBus } = useBuses({ selectedBusId, viewState });

  const selectedStop = stops?.find((stop) => stop.stop_id === selectedStopId);

  const checkIfPositionInViewport = useCallback(
    (lat: number, lng: number) => {
      if (!mapRef.current) return;

      const bounds = mapRef.current.getBounds();
      return bounds.contains([lng, lat]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapRef.current],
  );

  const filteredStops = useMemo(() => {
    if (!stops) return [];
    return stops.filter((stop) => {
      if (!stop.stop_lat || !stop.stop_lon) return false;
      return checkIfPositionInViewport(stop.stop_lat, stop.stop_lon);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, viewState, checkIfPositionInViewport]);

  const { clusters: stopClusters } = useSupercluster({
    points: filteredStops.map((stop) => ({
      type: "Feature",
      properties: { cluster: false, stopId: stop.stop_id },
      geometry: {
        type: "Point",
        coordinates: [stop.stop_lon, stop.stop_lat],
      },
    })),
    bounds: [-180, -85, 180, 85],
    zoom: viewState.zoom,
    options: { radius: 60, maxZoom: 16 },
  });

  return (
    <main className="absolute inset-0">
      <Map />
      {/* <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={initialViewState}
        maxZoom={20}
        minZoom={3}
        onMoveEnd={(e) => {
          setViewState(e.viewState);
        }}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />



        {stopClusters.map((point) => {
          const properties = point.properties;
          const geometry = point.geometry;

          if (properties.cluster)
            return (
              <Marker
                key={point.id}
                latitude={geometry.coordinates[1] ?? 0}
                longitude={geometry.coordinates[0] ?? 0}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  mapRef.current?.flyTo({
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
              <h1 className="text-2xl font-bold">
                Stop {selectedStop.stop_id}
              </h1>
              <p>Latitude: {selectedStop.stop_lat}</p>
              <p>Longitude: {selectedStop.stop_lon}</p>
            </div>
          </Popup>
        )}
      </Map> */}
    </main>
  );
}
