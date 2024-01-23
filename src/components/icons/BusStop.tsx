import type { FC } from "react";
import { CustomIcon } from "./customIcon/index";
import type { IconProps } from "./types";

export const BusStopIcon: FC<IconProps> = (props) => (
  <CustomIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M20 3H7V2H6a1.78 1.78 0 0 0-1.41 1H2v2h1.73C2 10.58 2 22 2 22h5V5h13m2 3.5a2.5 2.5 0 1 0-3 2.5v11h1V11a2.5 2.5 0 0 0 2-2.5m-7 3V16h-1v6h-1.5v-5h-1v5H10v-6H9v-4.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5m-3-5A1.5 1.5 0 1 0 13.5 8A1.5 1.5 0 0 0 12 6.5"
      />
    </svg>
  </CustomIcon>
);