import type { FC } from "react";
import { CustomIcon } from "./customIcon/index";
import type { IconProps } from "./types";

export const GondolaIcon: FC<IconProps> = (props) => (
  <CustomIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M18 10h-5V7.59l9.12-1.52l-.24-1.48l-5.47.91c.05-.15.09-.32.09-.5A1.5 1.5 0 0 0 15 3.5A1.5 1.5 0 0 0 13.5 5c0 .35.13.68.34.93l-.84.14V5h-2v1.41l-.59.09c.05-.15.09-.32.09-.5A1.5 1.5 0 0 0 9 4.5A1.5 1.5 0 0 0 7.5 6c0 .36.13.68.33.93l-5.95 1l.24 1.48L11 7.93V10H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2M6 12h2.25v4H6zm3.75 4v-4h4.5v4zM18 16h-2.25v-4H18z"
      />
    </svg>
  </CustomIcon>
);