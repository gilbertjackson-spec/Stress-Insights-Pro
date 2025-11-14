import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a Tailwind CSS text color class based on a score.
 * @param score The score to evaluate.
 * @returns A string with the corresponding Tailwind class.
 */
export function getScoreColorClass(score: number): string {
    if (score < 3) return "text-destructive";
    if (score < 4) return "text-yellow-500";
    return "text-green-500";
}
