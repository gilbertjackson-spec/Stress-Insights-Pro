import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a Tailwind CSS text color class based on a score and its percentile thresholds.
 * @param score The score to evaluate.
 * @param p25 The 25th percentile threshold.
 * @param p75 The 75th percentile threshold.
 * @returns A string with the corresponding Tailwind class.
 */
export function getScoreColorClass(score: number, p25?: number, p75?: number): string {
    // Use provided thresholds, or fall back to defaults if they are not available.
    const lowerThreshold = p25 ?? 2.8; 
    const upperThreshold = p75 ?? 3.8;

    if (score < lowerThreshold) return "text-destructive";
    if (score < upperThreshold) return "text-yellow-500";
    return "text-green-500";
}
