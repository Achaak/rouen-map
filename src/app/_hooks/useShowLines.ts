import { useLocalStorage } from "usehooks-ts";

export const useShowLines = () => {
  const [showLines, setShowLines] = useLocalStorage("show-lines", true);

  return { showLines, setShowLines };
};
