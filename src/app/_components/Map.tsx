'use client';

import {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Map as MapGl,
  type MapRef,
  NavigationControl,
  ScaleControl,
  type ViewState,
} from 'react-map-gl';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { env } from '~/env';
import { api } from '~/trpc/react';
import type { RouterOutput } from '~/server/api/root';
import { VehicleMarkers } from './VehicleMarkers';
import { StopMarkers } from './StopMarkers';
import { LineLayers } from './LineLayers';
import { ControlPanel } from './ControlPanel';

type Bounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

const initialViewState: ViewState = {
  latitude: 49.433331,
  longitude: 1.08333,
  // latitude: 50.633333,
  // longitude: 3.066667,
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
  vehicles?: RouterOutput['static']['getVehicles'];
  selectedVehicleId?: string;
  setSelectedVehicleId: (vehiclesId?: string) => void;
  stops?: RouterOutput['static']['getStops'];
  selectedStopId?: string;
  setSelectedStopId: (stopId?: string) => void;
  lines?: RouterOutput['static']['lines'];
  trips?: RouterOutput['static']['allTrips'];
  isOnDrag: boolean;
  isOnMove: boolean;
  bounds?: Bounds;
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
  const [bounds, setBounds] = useState<Bounds>();
  const [layerId, setLayerId] = useState<string>();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>();
  const [selectedStopId, setSelectedStopId] = useState<string>();

  const { data: vehicles } = api.static.getVehicles.useQuery(undefined, {
    refetchInterval: 20000,
  });
  const { data: stops } = api.static.getStops.useQuery();
  const { data: lines } = api.static.lines.useQuery();

  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    setBounds({
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewState, mapRef.current]);

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
        bounds,
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
            (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
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
        ref={mapRef}
      >
        <Layer
          id="add-3d-buildings"
          source="composite"
          source-layer="building"
          filter={['==', 'extrude', 'true']}
          type="fill-extrusion"
          minzoom={15}
          paint={{
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
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
