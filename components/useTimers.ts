import { useContext } from "react";

import { TimersContext } from "./TimerContext";

export const useTimers = () => {
  const context = useContext(TimersContext);
  if (!context)
    throw new Error("useTimers must be used within a TimersProvider");
  return context;
};
