import { useLocalStorage } from "usehooks-ts";

export const useShowStops = () => {
  const [showStops, setShowStops] = useLocalStorage("show-stops", true);

  return { showStops, setShowStops };
};
