import { api } from "~/trpc/react";
import { useMapContext } from "../_components/Map";

export const useStopSelected = () => {
  const { stops, selectedStopId } = useMapContext();
  const { data, isLoading } = api.realtime.getStopInfo.useQuery(
    {
      stopId: selectedStopId ?? "",
    },
    {
      enabled: !!selectedStopId,
    },
  );

  const selectedStop = stops?.find((stop) => stop.id === selectedStopId);

  return {
    selectedStop,
    selectedStopInfo: data,
    isLoading,
  };
};
