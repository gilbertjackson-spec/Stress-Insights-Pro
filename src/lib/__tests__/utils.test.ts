import { describe, it, expect } from 'vitest';
import { cn, getScoreColorClass } from '../utils';

describe('Utils - cn Function', () => {
    it('should merge class names', () => {
        const result = cn('class1', 'class2');
        expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
        const result = cn('base', true && 'active', false && 'disabled');
        expect(result).toBe('base active');
    });

    it('should merge Tailwind classes correctly', () => {
        const result = cn('px-2 py-1', 'px-4');
        expect(result).toBe('py-1 px-4'); // px-4 overrides px-2
    });

    it('should handle arrays of classes', () => {
        const result = cn(['class1', 'class2'], 'class3');
        expect(result).toBe('class1 class2 class3');
    });

    it('should handle objects with boolean values', () => {
        const result = cn({
            'class1': true,
            'class2': false,
            'class3': true,
        });
        expect(result).toBe('class1 class3');
    });

    it('should handle undefined and null values', () => {
        const result = cn('class1', undefined, null, 'class2');
        expect(result).toBe('class1 class2');
    });

    it('should handle empty input', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('should handle complex Tailwind merging', () => {
        const result = cn(
            'bg-red-500 text-white',
            'bg-blue-500', // Should override bg-red-500
            'hover:bg-green-500'
        );
        expect(result).toContain('bg-blue-500');
        expect(result).toContain('text-white');
        expect(result).toContain('hover:bg-green-500');
        expect(result).not.toContain('bg-red-500');
    });
});

describe('Utils - getScoreColorClass Function', () => {
    describe('with default thresholds', () => {
        it('should return destructive for low scores', () => {
            expect(getScoreColorClass(2.0)).toBe('text-destructive');
            expect(getScoreColorClass(2.5)).toBe('text-destructive');
            expect(getScoreColorClass(2.7)).toBe('text-destructive');
        });

        it('should return yellow for medium scores', () => {
            expect(getScoreColorClass(2.8)).toBe('text-yellow-500');
            expect(getScoreColorClass(3.0)).toBe('text-yellow-500');
            expect(getScoreColorClass(3.5)).toBe('text-yellow-500');
            expect(getScoreColorClass(3.7)).toBe('text-yellow-500');
        });

        it('should return green for high scores', () => {
            expect(getScoreColorClass(3.8)).toBe('text-green-500');
            expect(getScoreColorClass(4.0)).toBe('text-green-500');
            expect(getScoreColorClass(5.0)).toBe('text-green-500');
        });

        it('should handle edge cases at thresholds', () => {
            expect(getScoreColorClass(2.79)).toBe('text-destructive');
            expect(getScoreColorClass(2.80)).toBe('text-yellow-500');
            expect(getScoreColorClass(3.79)).toBe('text-yellow-500');
            expect(getScoreColorClass(3.80)).toBe('text-green-500');
        });
    });

    describe('with custom thresholds', () => {
        it('should use custom p25 and p75', () => {
            expect(getScoreColorClass(2.0, 2.5, 4.0)).toBe('text-destructive');
            expect(getScoreColorClass(3.0, 2.5, 4.0)).toBe('text-yellow-500');
            expect(getScoreColorClass(4.5, 2.5, 4.0)).toBe('text-green-500');
        });

        it('should handle only p25 provided', () => {
            expect(getScoreColorClass(2.0, 2.5)).toBe('text-destructive');
            expect(getScoreColorClass(3.0, 2.5)).toBe('text-yellow-500');
            expect(getScoreColorClass(4.0, 2.5)).toBe('text-green-500');
        });

        it('should handle only p75 provided', () => {
            expect(getScoreColorClass(2.0, undefined, 4.0)).toBe('text-destructive');
            expect(getScoreColorClass(3.0, undefined, 4.0)).toBe('text-yellow-500');
            expect(getScoreColorClass(4.5, undefined, 4.0)).toBe('text-green-500');
        });

        it('should handle very low custom thresholds', () => {
            expect(getScoreColorClass(1.0, 1.5, 2.0)).toBe('text-destructive');
            expect(getScoreColorClass(1.7, 1.5, 2.0)).toBe('text-yellow-500');
            expect(getScoreColorClass(2.5, 1.5, 2.0)).toBe('text-green-500');
        });

        it('should handle very high custom thresholds', () => {
            expect(getScoreColorClass(3.0, 4.0, 4.5)).toBe('text-destructive');
            expect(getScoreColorClass(4.2, 4.0, 4.5)).toBe('text-yellow-500');
            expect(getScoreColorClass(5.0, 4.0, 4.5)).toBe('text-green-500');
        });
    });

    describe('edge cases', () => {
        it('should handle zero score', () => {
            expect(getScoreColorClass(0)).toBe('text-destructive');
        });

        it('should handle negative scores', () => {
            expect(getScoreColorClass(-1)).toBe('text-destructive');
        });

        it('should handle very high scores', () => {
            expect(getScoreColorClass(10)).toBe('text-green-500');
            expect(getScoreColorClass(100)).toBe('text-green-500');
        });

        it('should handle decimal precision', () => {
            expect(getScoreColorClass(2.799999)).toBe('text-destructive');
            expect(getScoreColorClass(2.800001)).toBe('text-yellow-500');
            expect(getScoreColorClass(3.799999)).toBe('text-yellow-500');
            expect(getScoreColorClass(3.800001)).toBe('text-green-500');
        });
    });
});
