import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

describe('useIsMobile Hook', () => {
    let matchMediaMock: any;

    beforeEach(() => {
        // Mock window.matchMedia
        matchMediaMock = {
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        };

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                ...matchMediaMock,
                matches: query.includes('max-width'),
                media: query,
            })),
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return false for desktop width (>= 768px)', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);
    });

    it('should return true for mobile width (< 768px)', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(true);
    });

    it('should return true for tablet width (< 768px)', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 767,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(true);
    });

    it('should return false for exactly 768px', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 768,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);
    });

    it('should update when window is resized', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);

        // Simulate resize to mobile
        act(() => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375,
            });

            // Trigger the change event
            const changeHandler = matchMediaMock.addEventListener.mock.calls.find(
                (call: any) => call[0] === 'change'
            )?.[1];

            if (changeHandler) {
                changeHandler();
            }
        });

        expect(result.current).toBe(true);
    });

    it('should cleanup event listener on unmount', () => {
        const { unmount } = renderHook(() => useIsMobile());

        expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        );

        unmount();

        expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        );
    });
});
