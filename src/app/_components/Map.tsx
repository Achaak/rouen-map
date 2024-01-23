"use client";

import { useBuses } from "../_hooks/useBuses";
import {
  FullscreenControl,
  GeolocateControl,
  Map as MapGl,
  Marker,
  NavigationControl,
  ScaleControl,
  ViewState,
  useMap,
} from "react-map-gl";
import { FaBus } from "react-icons/fa";
import { createContext, useContext, useState } from "react";
import { env } from "~/env";

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
}>({
  viewState: initialViewState,
});
export const useMapContext = () => useContext(MapContext);

export const Map = () => {
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  return (
    <MapContext.Provider
      value={{
        viewState,
      }}
    >
      <MapGl
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
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
      </MapGl>
    </MapContext.Provider>
  );
};
