"use client";

import { useState, type FC } from "react";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { useShowVehicles } from "../_hooks/useShowVehicles";
import { useShowStops } from "../_hooks/useShowStops";
import { useShowLines } from "../_hooks/useShowLines";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { vehiclesTypes } from "~/lib/vehicles";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const ControlPanel: FC = () => {
  const { setShowVehicle, showVehicles } = useShowVehicles();
  const { showStops, setShowStops } = useShowStops();
  const { showLines, setShowLines } = useShowLines();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute right-2.5 top-2.5 flex flex-col items-end space-y-2">
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        Filtres
      </Button>
      <Card
        className={cn("flex w-64 max-w-full flex-col space-y-2 p-4 pt-0", {
          hidden: !isOpen,
        })}
      >
        <Accordion type="multiple">
          <AccordionItem value="vehicles">
            <AccordionTrigger>Type de transport</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="show-tramway">Afficher les Teors</Label>
                <Checkbox
                  id="show-tramway"
                  checked={showVehicles[vehiclesTypes.tramway]}
                  onCheckedChange={(bool) => {
                    setShowVehicle(vehiclesTypes.tramway, !!bool);
                  }}
                />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="show-subway">Afficher les métros</Label>
                <Checkbox
                  id="show-subway"
                  checked={showVehicles[vehiclesTypes.subway]}
                  onCheckedChange={(bool) => {
                    setShowVehicle(vehiclesTypes.subway, !!bool);
                  }}
                />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="show-buses">Afficher les bus</Label>
                <Checkbox
                  id="show-buses"
                  checked={showVehicles[vehiclesTypes.bus]}
                  onCheckedChange={(bool) => {
                    setShowVehicle(vehiclesTypes.bus, !!bool);
                  }}
                />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="show-ferry">Afficher les ferry</Label>
                <Checkbox
                  id="show-ferry"
                  checked={showVehicles[vehiclesTypes.ferry]}
                  onCheckedChange={(bool) => {
                    setShowVehicle(vehiclesTypes.ferry, !!bool);
                  }}
                />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="show-onDemandBus">
                  Afficher les bus à la demande
                </Label>
                <Checkbox
                  id="show-onDemandBus"
                  checked={showVehicles[vehiclesTypes.onDemandBus]}
                  onCheckedChange={(bool) => {
                    setShowVehicle(vehiclesTypes.onDemandBus, !!bool);
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
    </div>
  );
};
