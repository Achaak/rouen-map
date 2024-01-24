import type { FC } from "react";
import { type IconProps } from "./icons/types";
import { TramIcon } from "./icons/Tram";
import { FerryIcon } from "./icons/Ferry";
import { GondolaIcon } from "./icons/Gondola";
import { SubwayIcon } from "./icons/Subway";
import { TrainIcon } from "./icons/Train";
import { BusIcon } from "./icons/Bus";
import { HelpIcon } from "./icons/Help";
import { BusMarkerIcon } from "./icons/BusMarker";
import { vehiclesTypes } from "~/lib/vehicles";

type VehicleIconProps = {
  route_type?: number;
} & IconProps;
export const VehicleIcon: FC<VehicleIconProps> = ({ route_type, ...props }) => {
  switch (route_type) {
    case vehiclesTypes.tramway:
    case vehiclesTypes.cableCar:
      return <TramIcon {...props} />;
    case vehiclesTypes.subway:
      return <SubwayIcon {...props} />;
    case vehiclesTypes.train:
    case vehiclesTypes.funicular:
    case vehiclesTypes.monorail:
      return <TrainIcon {...props} />;
    case vehiclesTypes.bus:
    case vehiclesTypes.trolleybus:
      return <BusIcon {...props} />;
    case vehiclesTypes.ferry:
      return <FerryIcon {...props} />;
    case vehiclesTypes.gondola:
      return <GondolaIcon {...props} />;
    case vehiclesTypes.onDemandBus:
      return <BusMarkerIcon {...props} />;
    default:
      return <HelpIcon {...props} />;
  }
};
