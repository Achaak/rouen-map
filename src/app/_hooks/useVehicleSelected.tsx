import { useMapContext } from "../_components/Map";

export const useVehicleSelected = () => {
  const { vehicles, selectedVehicleId } = useMapContext();
  
  const selectedVehicle = vehicles?.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  return {
    selectedVehicle,
  };
};
