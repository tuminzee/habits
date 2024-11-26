import { atomWithStorage } from "jotai/utils";

export const streakAtom = atomWithStorage("streak", 0);
export const lastStreakUpdateAtom = atomWithStorage<string | null>(
  "lastStreakUpdate",
  null
);
