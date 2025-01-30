import { Alert } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HistoryType, TimerType } from "@/types/timer";

type TimerContextType = {
  timers: TimerType[];
  setTimers: React.Dispatch<React.SetStateAction<TimerType[]>>;
  history: HistoryType[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryType[]>>;
  updateTimer: (timerId: string, updatedFields: Partial<TimerType>) => void;
  loadTimers: () => Promise<TimerType[]>;
  saveTimers: (timers: TimerType[]) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  deleteHistory: () => void;
};

export const STORAGE_KEY = "timers";
export const HISTORY_STORAGE_KEY = "history";

export const TimersContext = createContext<TimerContextType | undefined>(
  undefined
);

export const TimersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timers, setTimers] = useState<TimerType[]>([]);
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [intervals, setIntervals] = useState<{ [key: string]: NodeJS.Timeout }>(
    {}
  );

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTimers) {
          const parsedTimers: TimerType[] = JSON.parse(storedTimers);
          setTimers(parsedTimers);
          restartRunningTimers(parsedTimers);
        }
      } catch (error) {
        console.error("Failed to load timers:", error);
      }
    };
    loadTimers();

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  // Save timers to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timers));

    for (const timer of timers) {
      if (timer.status === "completed") {
        Alert.alert(
          "Timer Completed",
          `The timer "${timer.name}" has completed.`
        );
        createHistory(timer);

        const updatedTimers = timers.filter((t) => t.id !== timer.id);
        setTimers(updatedTimers);
      }
    }
  }, [JSON.stringify(timers)]);

  const saveTimers = async (timers: TimerType[]) => {
    try {
      await AsyncStorage.setItem("timers", JSON.stringify(timers));
    } catch (error) {
      console.error("Error saving timers:", error);
    }
  };

  const loadTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem("timers");
      return storedTimers ? JSON.parse(storedTimers) : [];
    } catch (error) {
      console.error("Error loading timers:", error);
      return [];
    }
  };

  const updateTimer = async (
    timerId: string,
    updatedFields: Partial<TimerType>
  ) => {
    const timers = (await loadTimers()) as TimerType[];
    const updatedTimers = timers.map((timer) =>
      timer.id === timerId ? { ...timer, ...updatedFields } : timer
    );
    await saveTimers(updatedTimers);
  };

  // Restart running timers on app load
  const restartRunningTimers = (loadedTimers: TimerType[]) => {
    loadedTimers.forEach((timer) => {
      if (timer.status === "running" && timer.remaining > 0) {
        startTimer(timer.id);
      }
    });
  };

  // Start Timer Function
  const startTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "running" } : t))
    );

    if (intervals[id]) return; // Prevent multiple intervals

    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((timer) => {
          if (timer.id === id && timer.remaining > 0) {
            return { ...timer, remaining: timer.remaining - 1 };
          }
          if (timer.id === id && timer.remaining === 0) {
            clearInterval(interval);
            return { ...timer, status: "completed" };
          }
          return timer;
        })
      );
    }, 1000);

    setIntervals((prev) => ({ ...prev, [id]: interval }));
  };

  // Function to pause a timer
  const pauseTimer = (id: string) => {
    clearInterval(intervals[id]);
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, status: "paused" } : timer
      )
    );
    setIntervals((prev) => {
      const updatedIntervals = { ...prev };
      delete updatedIntervals[id];
      return updatedIntervals;
    });
  };

  // Function to reset a timer
  const resetTimer = (id: string) => {
    clearInterval(intervals[id]);
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? { ...timer, remaining: timer.duration, status: "paused" }
          : timer
      )
    );
    setIntervals((prev) => {
      const updatedIntervals = { ...prev };
      delete updatedIntervals[id];
      return updatedIntervals;
    });
  };

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory: HistoryType[] = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  // Function to create a history entry
  const createHistory = async (timer: TimerType) => {
    const historyEntry = {
      id: timer.id,
      name: timer.name,
      duration: timer.duration,
      completedAt: new Date().toISOString(),
      createdAt: timer.createdAt,
      category: timer.category,
    };

    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      history.push(historyEntry);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      setHistory(history);
    } catch (error) {
      console.error("Error saving history entry:", error);
    }
  };

  const deleteHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error("Error deleting history entry:", error);
    }
  };

  return (
    <TimersContext.Provider
      value={{
        timers,
        setTimers,
        history,
        setHistory,
        updateTimer,
        loadTimers,
        saveTimers,
        pauseTimer,
        startTimer,
        resetTimer,
        deleteHistory,
      }}
    >
      {children}
    </TimersContext.Provider>
  );
};
