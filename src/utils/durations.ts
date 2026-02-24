import { STORAGE_KEYS } from "../constants/storage";
import { DEFAULT_DURATIONS, type Mode } from "./helpers";

const MODES: Mode[] = ["foco", "pausa", "descanso"];

function isValidDurations(
  value: unknown
): value is { [key in Mode]: number } {
  if (!value || typeof value !== "object") return false;
  return MODES.every(
    (mode) =>
      mode in value &&
      typeof (value as Record<string, unknown>)[mode] === "number"
  );
}

export const saveDurationsInLocalStorage = (durations: {
  [key in Mode]: number;
}) => {
  localStorage.setItem(STORAGE_KEYS.DURATIONS, JSON.stringify(durations));
};

export const getDurationsFromLocalStorage = (): {
  [key in Mode]: number;
} => {
  const raw = localStorage.getItem(STORAGE_KEYS.DURATIONS);
  if (!raw) return DEFAULT_DURATIONS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isValidDurations(parsed) ? parsed : DEFAULT_DURATIONS;
  } catch {
    return DEFAULT_DURATIONS;
  }
};
