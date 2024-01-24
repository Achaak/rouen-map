"use client";

import { Layer, Source } from "react-map-gl";
import type { FC } from "react";
import { useLines } from "../_hooks/useLines";
import { useShowLines } from "../_hooks/useShowLines";

export const LineLayers: FC = () => {
  const { linesFormatted } = useLines();
  const { showLines } = useShowLines();

  if (!showLines) return null;

  return (
    <>
      {linesFormatted.map((line) => {
        const properties = line.properties;

        return (
          <Source key={properties.lineId} type="geojson" data={line}>
            <Layer
              type="line"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": `#${properties.routeColor}`,
                "line-width": 2,
              }}
              // onClick={(e) => {
              //   e.stopPropagation();
              //   // e.originalEvent.stopPropagation();
              //   setSelectedLineId(properties.lineId);
              // }}
              // style={{
              //   cursor: "pointer",
              //   // transition: "transform 0.2s",
              // }}
            />
          </Source>
        );
      })}
    </>
  );
};
