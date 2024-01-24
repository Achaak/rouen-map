import { api } from "~/trpc/react";
import { useMapContext } from "../_components/Map";

export const useVehicleSelected = () => {
  const { vehicles, selectedVehicleId } = useMapContext();
  const { data, isLoading } = api.realtime.getVehicleInfo.useQuery(
    {
      vehicleId: selectedVehicleId ?? "",
    },
    {
      enabled: !!selectedVehicleId,
    },
  );

  const selectedVehicle = vehicles?.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  return {
    selectedVehicle,
    selectedVehicleInfo: data,
    isLoading,
  };
};
