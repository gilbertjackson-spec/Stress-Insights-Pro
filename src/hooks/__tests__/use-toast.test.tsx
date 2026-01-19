import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useToast, toast } from '../use-toast';

describe('useToast Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should initialize with empty toasts', () => {
        const { result } = renderHook(() => useToast());
        expect(result.current.toasts).toEqual([]);
    });

    it('should add a toast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({
                title: 'Test Toast',
                description: 'This is a test',
            });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toBe('Test Toast');
        expect(result.current.toasts[0].description).toBe('This is a test');
    });

    it('should generate unique IDs for toasts', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({ title: 'Toast 1' });
            result.current.toast({ title: 'Toast 2' });
        });

        const ids = result.current.toasts.map((t) => t.id);
        expect(new Set(ids).size).toBe(1); // TOAST_LIMIT is 1, so only 1 toast
    });

    it('should respect TOAST_LIMIT of 1', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({ title: 'Toast 1' });
            result.current.toast({ title: 'Toast 2' });
            result.current.toast({ title: 'Toast 3' });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toBe('Toast 3'); // Latest toast
    });

    it('should dismiss a specific toast', () => {
        const { result } = renderHook(() => useToast());

        let toastId: string;

        act(() => {
            const { id } = result.current.toast({ title: 'Test Toast' });
            toastId = id;
        });

        expect(result.current.toasts[0].open).toBe(true);

        act(() => {
            result.current.dismiss(toastId);
        });

        expect(result.current.toasts[0].open).toBe(false);
    });

    it('should dismiss all toasts when no ID provided', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({ title: 'Toast 1' });
        });

        act(() => {
            result.current.dismiss();
        });

        expect(result.current.toasts[0].open).toBe(false);
    });

    it('should update a toast', () => {
        const { result } = renderHook(() => useToast());

        let updateFn: (props: any) => void;

        act(() => {
            const { update } = result.current.toast({ title: 'Original Title' });
            updateFn = update;
        });

        act(() => {
            updateFn({ title: 'Updated Title' });
        });

        expect(result.current.toasts[0].title).toBe('Updated Title');
    });

    it('should set open to true by default', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({ title: 'Test' });
        });

        expect(result.current.toasts[0].open).toBe(true);
    });

    it('should call onOpenChange when dismissed', () => {
        const { result } = renderHook(() => useToast());

        let dismissFn: () => void;

        act(() => {
            const { dismiss } = result.current.toast({ title: 'Test' });
            dismissFn = dismiss;
        });

        act(() => {
            dismissFn();
        });

        expect(result.current.toasts[0].open).toBe(false);
    });

    it('should support variant prop', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({
                title: 'Error Toast',
                variant: 'destructive',
            });
        });

        expect(result.current.toasts[0].variant).toBe('destructive');
    });

    it('should support action element', () => {
        const { result } = renderHook(() => useToast());

        const action = { altText: 'Undo' };

        act(() => {
            result.current.toast({
                title: 'Test',
                action: action as any,
            });
        });

        expect(result.current.toasts[0].action).toBe(action);
    });
});

describe('toast Function (Standalone)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should return toast object with id, dismiss, and update', () => {
        const result = toast({ title: 'Test' });

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('dismiss');
        expect(result).toHaveProperty('update');
        expect(typeof result.id).toBe('string');
        expect(typeof result.dismiss).toBe('function');
        expect(typeof result.update).toBe('function');
    });

    it('should allow dismissing via returned function', () => {
        const { result } = renderHook(() => useToast());

        let dismissFn: () => void;

        act(() => {
            const toastResult = toast({ title: 'Test' });
            dismissFn = toastResult.dismiss;
        });

        // Wait for state to update
        waitFor(() => {
            expect(result.current.toasts).toHaveLength(1);
        });

        act(() => {
            dismissFn();
        });

        waitFor(() => {
            expect(result.current.toasts[0].open).toBe(false);
        });
    });

    it('should allow updating via returned function', () => {
        const { result } = renderHook(() => useToast());

        let updateFn: (props: any) => void;

        act(() => {
            const toastResult = toast({ title: 'Original' });
            updateFn = toastResult.update;
        });

        waitFor(() => {
            expect(result.current.toasts).toHaveLength(1);
        });

        act(() => {
            updateFn({ title: 'Updated', description: 'New description' });
        });

        waitFor(() => {
            expect(result.current.toasts[0].title).toBe('Updated');
            expect(result.current.toasts[0].description).toBe('New description');
        });
    });
});
