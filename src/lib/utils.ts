import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a Tailwind CSS text color class based on a score and percentile thresholds.
 * @param score The score to evaluate.
 * @param p25 The 25th percentile threshold.
 * @param p75 The 75th percentile threshold.
 * @returns A string with the corresponding Tailwind class.
 */
export function getScoreColorClass(score: number, p25: number, p75: number): string {
    if (score < p25) return "text-destructive";
    if (score < p75) return "text-yellow-500";
    return "text-green-500";
}
