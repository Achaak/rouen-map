"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { Map } from "./_components/Map";

export default function Home() {
  return (
    <main className="absolute inset-0">
      <Map />
    </main>
  );
}
