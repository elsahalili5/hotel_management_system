export const SHIFTS = {
  MORNING: "MORNING",
  AFTERNOON: "AFTERNOON",
  NIGHT: "NIGHT",
} as const;

export type ShiftType = (typeof SHIFTS)[keyof typeof SHIFTS];
