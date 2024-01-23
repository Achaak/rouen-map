"use client";

import { Layer, Popup, Source } from "react-map-gl";
import { useMapContext } from "./Map";
import type { FC } from "react";
import { useLines } from "../_hooks/useLines";

export const LineLayers: FC = () => {
  const { setSelectedLineId, selectedLine } = useMapContext();
  const { linesFormatted } = useLines();

  return (
    <>
      {linesFormatted.map((line) => {
        const properties = line.properties as {
          lineId: string;
          routeColor: string;
          routeTextColor: string;
        };

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
                "line-width": 3,
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

      {selectedLine && (
        <Popup
          anchor="top"
          offset={25}
          latitude={selectedLine.stops[0]?.stop_lat ?? 0}
          longitude={selectedLine.stops[0]?.stop_lon ?? 0}
          onClose={() => setSelectedLineId(undefined)}
          closeButton={false}
        >
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">
              <span
                style={{
                  color: `#${selectedLine.route.route_text_color}`,
                  backgroundColor: `#${selectedLine.route.route_color}`,
                  padding: "0.25rem",
                  borderRadius: "0.25rem",
                }}
              >
                Line {selectedLine.route.route_id}
              </span>
            </h1>
          </div>
        </Popup>
      )}
    </>
  );
};
