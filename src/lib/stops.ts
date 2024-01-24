// 0 ou vide : arrêt ou quai (lieu où les usagers montent dans un véhicule de transport en commun ou en descendent). Le terme "quai" est utilisé lorsque cette valeur est définie au sein d'un champ parent_station.
// 1 : station (zone ou structure physique comprenant un ou plusieurs quais)
// 2 : entrée ou sortie (lieu où les usagers peuvent entrer dans une station depuis la rue ou en sortir). Si une entrée/sortie appartient à plusieurs stations, tous les chemins correspondants sont indiqués, et le fournisseur de données doit désigner une station en tant que station principale (parente).
// 3 : intersection générique (un emplacement dans une station qui ne correspond à aucune autre valeur location_type). Les intersections génériques permettent de relier les chemins définis dans le fichier pathways.txt.
// 4 : Zone d'embarquement (un emplacement spécifique sur un quai où les usagers peuvent monter à bord d'un véhicule ou en descendre).

export const stopsTypes = {
  stop: 0,
  station: 1,
  entrance: 2,
  genericIntersection: 3,
  boardingArea: 4,
} as const;

export type StopsType = keyof typeof stopsTypes;
export type StopsTypeNumber = (typeof stopsTypes)[StopsType];
