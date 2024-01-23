import * as Iconify from "@iconify/react";
import { CustomIcon } from "../customIcon/index";
import type { IconProps } from "../types";
import type { FC } from "react";

export type IconByNameProps = IconProps & {
  name: string;
};

export const IconByName: FC<IconByNameProps> = ({ name, ...props }) => (
  <CustomIcon {...props}>
    <Iconify.Icon icon={name} />
  </CustomIcon>
);
