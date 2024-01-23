"use client";

import Map, {
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

const initialViewState: Partial<ViewState> = {
  latitude: 49.433331,
  longitude: 1.08333,
  zoom: 13,
};

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [selectedBusId, setSelectedBusId] = useState<string>();
  const [selectedStopId, setSelectedStopId] = useState<string>();
  const mapRef = useRef<MapRef>(null);
  const { data: buses } = api.realtime.vehiclePosition.useQuery(undefined, {
    refetchInterval: 10000,
  });
  const { data: stops } = api.realtime.allStops.useQuery();
  const [viewState, setViewState] =
    useState<Partial<ViewState>>(initialViewState);

  const selectedBus = buses?.entity.find((bus) => bus.id === selectedBusId);
  const selectedStop = stops?.find((stop) => stop.stop_id === selectedStopId);

  const checkIfPositionInViewport = useCallback(
    (lat: number, lng: number) => {
      if (!mapRef.current) return false;

      const bounds = mapRef.current.getBounds();
      return bounds.contains([lng, lat]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapRef.current],
  );

  const filteredBuses = useMemo(() => {
    console.log("viewState");
    if (!buses) return [];
    return buses.entity.filter((bus) => {
      if (!bus.vehicle?.position?.latitude || !bus.vehicle?.position?.longitude)
        return false;
      return checkIfPositionInViewport(
        bus.vehicle.position.latitude,
        bus.vehicle.position.longitude,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buses, viewState, checkIfPositionInViewport]);

  const { clusters: busClusters } = useSupercluster({
    points: filteredBuses.map((bus) => ({
      type: "Feature",
      properties: { cluster: false, busId: bus.id },
      geometry: {
        type: "Point",
        coordinates: [
          bus.vehicle!.position!.longitude,
          bus.vehicle!.position!.latitude,
        ],
      },
    })),
    bounds: [-180, -85, 180, 85],
    zoom: viewState?.zoom ?? 0,
    options: { radius: 60, maxZoom: 16 },
  });

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
    zoom: viewState?.zoom ?? 0,
    options: { radius: 60, maxZoom: 16 },
  });

  return (
    <main className="absolute inset-0">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{}}
        initialViewState={initialViewState}
        maxZoom={20}
        minZoom={3}
        onDragEnd={(e) => {
          setViewState(e.viewState);
        }}
        onZoomEnd={(e) => {
          setViewState(e.viewState);
        }}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {busClusters.map((point) => {
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
        })}

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
      </Map>
    </main>
  );
}
