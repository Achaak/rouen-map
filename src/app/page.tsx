"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { Map } from "./_components/Map";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface BigInt {
    toJSON: () => string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default function Home() {
  return (
    <main className="absolute inset-0">
      <Map />
    </main>
  );
}
