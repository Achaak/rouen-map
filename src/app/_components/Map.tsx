"use client";

import {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Map as MapGl,
  type MapRef,
  NavigationControl,
  ScaleControl,
  type ViewState,
} from "react-map-gl";
import { createContext, useContext, useRef, useState } from "react";
import { env } from "~/env";
import { api } from "~/trpc/react";
import type { RouterOutput } from "~/server/api/root";
import { VehicleMarkers } from "./VehicleMarkers";
import { StopMarkers } from "./StopMarkers";
import { LineLayers } from "./LineLayers";
import { ControlPanel } from "./ControlPanel";

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

const MapContext = createContext<{
  viewState: ViewState;
  vehicles?: RouterOutput["realtime"]["getVehicles"];
  selectedVehicleId?: string;
  setSelectedVehicleId: (vehiclesId?: string) => void;
  stops?: RouterOutput["realtime"]["getStops"];
  selectedStopId?: string;
  setSelectedStopId: (stopId?: string) => void;
  lines?: RouterOutput["realtime"]["lines"];
  trips?: RouterOutput["realtime"]["allTrips"];
  isOnDrag: boolean;
  isOnMove: boolean;
}>({
  viewState: initialViewState,
  setSelectedVehicleId: () => {
    // do nothing
  },
  setSelectedStopId: () => {
    // do nothing
  },
  isOnDrag: false,
  isOnMove: false,
});
export const useMapContext = () => useContext(MapContext);

export const Map = () => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const [isOnDrag, setIsOnDrag] = useState(false);
  const [isOnMove, setIsOnMove] = useState(false);
  const [layerId, setLayerId] = useState<string>();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>();
  const [selectedStopId, setSelectedStopId] = useState<string>();

  const { data: vehicles } = api.realtime.getVehicles.useQuery(undefined, {
    refetchInterval: 20000,
  });
  const { data: stops } = api.realtime.getStops.useQuery();
  const { data: lines } = api.realtime.lines.useQuery();

  return (
    <MapContext.Provider
      value={{
        viewState,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedStopId,
        setSelectedStopId,
        vehicles,
        stops,
        lines,
        isOnDrag,
        isOnMove,
      }}
    >
      <MapGl
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        initialViewState={initialViewState}
        maxZoom={20}
        minZoom={1}
        onLoad={() => {
          const layers = mapRef.current?.getStyle().layers;
          const labelLayerId = layers?.find(
            (layer) => layer.type === "symbol" && layer.layout?.["text-field"],
          )?.id;
          setLayerId(labelLayerId);
        }}
        onMove={(e) => {
          setViewState(e.viewState);
        }}
        onDragStart={() => {
          setIsOnDrag(true);
        }}
        onDragEnd={() => {
          setIsOnDrag(false);
        }}
        onMoveStart={() => {
          setIsOnMove(true);
        }}
        onMoveEnd={() => {
          setIsOnMove(false);
        }}
        onMouseDown={() => {
          setIsOnDrag(true);
        }}
        onMouseUp={() => {
          setIsOnDrag(false);
        }}
        ref={mapRef}
      >
        <Layer
          id="add-3d-buildings"
          source="composite"
          source-layer="building"
          filter={["==", "extrude", "true"]}
          type="fill-extrusion"
          minzoom={15}
          paint={{
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          }}
          beforeId={layerId}
        />
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />

        <VehicleMarkers />
        <StopMarkers />
        <LineLayers />

        <ScaleControl />
      </MapGl>
      <ControlPanel />
    </MapContext.Provider>
  );
};
