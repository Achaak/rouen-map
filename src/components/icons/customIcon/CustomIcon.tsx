import { cn } from "~/lib/utils";
import type { IconProps } from "../types";
import type { FC } from "react";

export const CustomIcon: FC<IconProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    {...props}
    className={cn(
      `icon-container flex items-center justify-center [&>svg]:h-full [&>svg]:w-full`,
      className,
    )}
  >
    {children}
  </div>
);
