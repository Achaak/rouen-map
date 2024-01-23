"use client";

import type { FC } from "react";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { useShowBuses } from "../_hooks/useShowBuses";
import { useShowStops } from "../_hooks/useShowStops";
import { useShowLines } from "../_hooks/useShowLines";

export const ControlPanel: FC = () => {
  const { showBuses, setShowBuses } = useShowBuses();
  const { showStops, setShowStops } = useShowStops();
  const { showLines, setShowLines } = useShowLines();

  return (
    <Card className="absolute right-2.5 top-2.5 flex flex-col space-y-2 p-4">
      <div className="flex items-center justify-between space-x-4">
        <Label htmlFor="show-buses">Afficher les bus</Label>
        <Checkbox
          id="show-buses"
          checked={showBuses}
          onCheckedChange={(bool) => {
            setShowBuses(!!bool);
          }}
        />
      </div>
      <div className="flex items-center justify-between space-x-4">
        <Label htmlFor="show-stops">Afficher les arrêts</Label>
        <Checkbox
          id="show-stops"
          checked={showStops}
          onCheckedChange={(bool) => {
            setShowStops(!!bool);
          }}
        />
      </div>
      <div className="flex items-center justify-between space-x-4">
        <Label htmlFor="show-lines">Afficher les lignes</Label>
        <Checkbox
          id="show-lines"
          checked={showLines}
          onCheckedChange={(bool) => {
            setShowLines(!!bool);
          }}
        />
      </div>
    </Card>
  );
};
