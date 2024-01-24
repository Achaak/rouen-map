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

// 0 : tramway ou métro léger. Tout système de métro léger ou circulant sur la chaussée dans une zone métropolitaine.
// 1 : métro. Tout système ferroviaire souterrain circulant au sein d'une zone métropolitaine.
// 2 : train. Utilisé pour les trajets interurbains ou longue distance.
// 3 : bus. Utilisé pour les lignes de bus courte et longue distance.
// 4 : ferry. Utilisé pour le service de bateaux courte et longue distance.
// 5 : tramway à traction par câble. Utilisé pour les systèmes de tramways au niveau de la chaussée dans lesquels le câble passe sous le véhicule, comme c'est le cas à San Francisco.
// 6 : téléphérique. Service de transport par câble où les cabines, voitures, télécabines ou sièges sont suspendus à l'aide d'un ou de plusieurs câbles.
// 7 : funiculaire. Tout système ferroviaire conçu pour les pentes raides.
// 11 : trolleybus. Autobus électrique alimenté par des lignes aériennes de contact.
// 12 : monorail. Service de chemin de fer roulant sur une voie constituée d'un rail ou d'une poutre unique.

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
