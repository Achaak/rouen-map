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

export const vehiclesTypes = {
  tramway: 0,
  subway: 1,
  train: 2, // Not used
  bus: 3,
  ferry: 4,
  cableCar: 5, // Not used
  gondola: 6, // Not used
  funicular: 7, // Not used
  trolleybus: 11, // Not used
  monorail: 12, // Not used
  onDemandBus: 715,
} as const;

export type VehicleType = keyof typeof vehiclesTypes;
export type VehicleTypeNumber = (typeof vehiclesTypes)[VehicleType];
