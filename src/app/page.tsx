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
import { useMemo, useRef, useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [selectedBusId, setSelectedBusId] = useState<string>();
  const mapRef = useRef<MapRef>(null);
  const { data: buses } = api.realtime.vehiclePosition.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const { data: stops } = api.realtime.allStops.useQuery();
  const [viewState, setViewState] = useState<ViewState>();

  const selectedBus = buses?.entity.find((bus) => bus.id === selectedBusId);

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
  }, [buses, viewState]);

  const mergedBuses = useMemo(() => {
    if (!buses) return [];
  }, [buses, stops]);

  const filteredStops = useMemo(() => {
    if (!stops) return [];
    return stops.filter((stop) => {
      if (!stop.stop_lat || !stop.stop_lon) return false;
      return checkIfPositionInViewport(
        Number(stop.stop_lat),
        Number(stop.stop_lon),
      );
    });
  }, [stops, viewState]);

  const checkIfPositionInViewport = (lat: number, lng: number) => {
    if (!mapRef.current) return false;

    const bounds = mapRef.current.getBounds();
    return bounds.contains([lng, lat]);
  };

  return (
    <main className="absolute inset-0">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{}}
        initialViewState={{
          latitude: 49.433331,
          longitude: 1.08333,
          zoom: 13,
        }}
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

        {filteredBuses.map((bus) => (
          <Marker
            key={bus.id}
            latitude={bus.vehicle!.position!.latitude}
            longitude={bus.vehicle!.position!.longitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedBusId(bus.id);
            }}
            style={{
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
          >
            <FaBus className="h-6 w-6" />
          </Marker>
        ))}

        {filteredStops.map((stop) => (
          <Marker
            key={stop.stop_id}
            latitude={Number(stop.stop_lat)}
            longitude={Number(stop.stop_lon)}
            style={{
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
          >
            <FaRegCircle className="h-4 w-4" />
          </Marker>
        ))}

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
      </Map>
    </main>
  );
}
