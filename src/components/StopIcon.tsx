import type { FC } from "react";
import { type IconProps } from "./icons/types";
import { HelpIcon } from "./icons/Help";
import { stopsTypes } from "~/lib/stops";
import { BusStopIcon } from "./icons/BusStop";
import { StationIcon } from "./icons/Station";

type StopIconProps = {
  location_type?: number;
} & IconProps;
export const StopIcon: FC<StopIconProps> = ({ location_type, ...props }) => {
  switch (location_type) {
    case stopsTypes.stop:
      return <BusStopIcon {...props} />;
    case stopsTypes.station:
      return <StationIcon {...props} />;
    default:
      return <HelpIcon {...props} />;
  }
};
