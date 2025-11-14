import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a Tailwind CSS text color class based on a score and hardcoded percentile thresholds.
 * @param score The score to evaluate.
 * @returns A string with the corresponding Tailwind class.
 */
export function getScoreColorClass(score: number): string {
    // These thresholds are based on a 1-5 scale and represent common percentile boundaries.
    const p25 = 2.8; 
    const p75 = 3.8;

    if (score < p25) return "text-destructive";
    if (score < p75) return "text-yellow-500";
    return "text-green-500";
}
