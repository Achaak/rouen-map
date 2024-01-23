"use client";

import {
  FullscreenControl,
  GeolocateControl,
  Map as MapGl,
  NavigationControl,
  ScaleControl,
  type ViewState,
} from "react-map-gl";
import { createContext, useContext, useState } from "react";
import { env } from "~/env";
import { api } from "~/trpc/react";
import type { RouterOutput } from "~/server/api/root";
import { BusMarkers } from "./BusMarkers";
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
  buses?: RouterOutput["realtime"]["vehiclePosition"]["entity"];
  selectedBus?: RouterOutput["realtime"]["vehiclePosition"]["entity"][number];
  selectedBusId?: string;
  setSelectedBusId: (busId?: string) => void;
  stops?: RouterOutput["realtime"]["allStops"];
  selectedStop?: RouterOutput["realtime"]["allStops"][number];
  selectedStopId?: string;
  setSelectedStopId: (stopId?: string) => void;
  lines?: RouterOutput["realtime"]["lines"];
  selectedLine?: RouterOutput["realtime"]["lines"][number];
  selectedLineId?: string;
  setSelectedLineId: (lineId?: string) => void;
}>({
  viewState: initialViewState,
  setSelectedBusId: () => {
    // do nothing
  },
  setSelectedStopId: () => {
    // do nothing
  },
  setSelectedLineId: () => {
    // do nothing
  },
});
export const useMapContext = () => useContext(MapContext);

export const Map = () => {
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  const [selectedBusId, setSelectedBusId] = useState<string>();
  const [selectedStopId, setSelectedStopId] = useState<string>();
  const [selectedLineId, setSelectedLineId] = useState<string>();

  const { data: busesData } = api.realtime.vehiclePosition.useQuery(undefined, {
    refetchInterval: 20000,
  });
  const buses = busesData?.entity;
  const { data: stops } = api.realtime.allStops.useQuery();
  const { data: lines } = api.realtime.lines.useQuery();

  const selectedBus = buses?.find((bus) => bus.id === selectedBusId);
  const selectedStop = stops?.find((stop) => stop.stop_id === selectedStopId);
  const selectedLine = lines?.find((line) => line.id === selectedLineId);

  return (
    <MapContext.Provider
      value={{
        viewState,
        selectedBus,
        selectedBusId,
        setSelectedBusId,
        selectedStopId,
        setSelectedStopId,
        buses,
        stops,
        selectedStop,
        selectedLine,
        selectedLineId,
        setSelectedLineId,
        lines,
      }}
    >
      <MapGl
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={initialViewState}
        maxZoom={20}
        minZoom={1}
        onMoveEnd={(e) => {
          setViewState(e.viewState);
        }}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />

        <BusMarkers />
        <StopMarkers />
        <LineLayers />

        <ScaleControl />
      </MapGl>
      <ControlPanel />
    </MapContext.Provider>
  );
};
