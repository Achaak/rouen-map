import { useMapContext } from "../_components/Map";

export const useStopSelected = () => {
  const { stops, selectedStopId } = useMapContext();

  const selectedStop = stops?.find((stop) => stop.id === selectedStopId);

  return {
    selectedStop,
  };
};
