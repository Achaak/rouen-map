import type { FC } from "react";
import { CustomIcon } from "./customIcon/index";
import type { IconProps } from "./types";

export const WheelchairIcon: FC<IconProps> = (props) => (
  <CustomIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m14 16l1.32 1.76C14.32 19.68 12.31 21 10 21c-3.31 0-6-2.69-6-6c0-2.43 1.46-4.5 3.55-5.45l.21 2.17C6.71 12.44 6 13.63 6 15c0 2.21 1.79 4 4 4c1.86 0 3.41-1.28 3.86-3zm5.55.11l-1.25.62L15.5 13h-4.59l-.2-2H14V9h-3.5l-.3-3c1.01-.12 1.8-.96 1.8-2a2 2 0 1 0-4 0v.1L9.1 15h5.4l3.2 4.27l2.75-1.37z"
      />
    </svg>
  </CustomIcon>
);