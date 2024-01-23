import { useLocalStorage } from "usehooks-ts";

export const useShowBuses = () => {
  const [showBuses, setShowBuses] = useLocalStorage("show-buses", true);

  return { showBuses, setShowBuses };
};
