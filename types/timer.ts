export type CategoryType =
  | "Work"
  | "Break"
  | "Study"
  | "Exercise"
  | "Meditate"
  | "Social"
  | "Relax";

export type StatusType = "running" | "paused" | "completed";

export type TimerType = {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  status: StatusType;
  createdAt: number;
  category: CategoryType;
};

export type HistoryType = {
  id: string;
  name: string;
  duration: number;
  completedAt: string;
  createdAt: number;
  category: CategoryType;
};
