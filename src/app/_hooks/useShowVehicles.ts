import { useLocalStorage } from "usehooks-ts";
import { type VehicleTypeNumber } from "~/lib/vehicles";

export const useShowVehicles = () => {
  const [showVehicles, setShowVehicles] = useLocalStorage<
    Record<VehicleTypeNumber, boolean>
  >("show-vehicles", {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    11: true,
    12: true,
    715: true,
  });

  const handleShowVehicles = (
    vehicleType: VehicleTypeNumber,
    show: boolean,
  ) => {
    setShowVehicles((prev) => ({
      ...prev,
      [vehicleType]: show,
    }));
  };

  return { showVehicles, setShowVehicles, setShowVehicle: handleShowVehicles };
};
