import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';

// Mock do Firebase SDK
vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
    getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
    setDoc: vi.fn(() => Promise.resolve()),
    updateDoc: vi.fn(() => Promise.resolve()),
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
    deleteDoc: vi.fn(() => Promise.resolve()),
    onSnapshot: vi.fn(() => vi.fn()), // Returns unsubscribe
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(() => vi.fn()),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    signInAnonymously: vi.fn(),
}));

vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
    getApps: vi.fn(() => []),
    getApp: vi.fn(),
}));

// Mock do Genkit
vi.mock('@/ai/genkit', () => ({
    ai: {
        defineFlow: vi.fn((opts, fn) => fn),
        definePrompt: vi.fn(() => vi.fn(async () => Promise.resolve({ output: {} }))),
    }
}));


// Cleanup após cada teste
afterEach(() => {
    cleanup();
});

// Mock do Next.js router
vi.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
            back: vi.fn(),
            pathname: '/',
            query: {},
            asPath: '/',
        };
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    usePathname() {
        return '/';
    },
}));

// Mock do Firebase (será customizado por teste quando necessário)
vi.mock('@/firebase/config', () => ({
    auth: {},
    db: {},
    app: {},
}));

vi.mock('@/firebase', () => ({
    useFirestore: vi.fn(() => ({})),
    useAuth: vi.fn(() => ({})),
    useUser: vi.fn(() => ({ user: null, isUserLoading: false, userError: null })),
    useCollection: vi.fn(() => ({ data: [], isLoading: false, error: null })),
    useMemoFirebase: vi.fn((fn) => fn()),
    useFirebase: vi.fn(() => ({
        firestore: {},
        auth: {},
        user: null,
        isUserLoading: false,
    })),
}));

// Suprimir warnings específicos do console durante os testes
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Warning: ReactDOM.render') ||
                args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
        ) {
            return;
        }
        originalError.call(console, ...args);
    };

    console.warn = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('componentWillReceiveProps')
        ) {
            return;
        }
        originalWarn.call(console, ...args);
    };
});

// Mock do ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
};

// Mock do PointerEvent e Pointer Capture
if (!global.PointerEvent) {
    class PointerEvent extends MouseEvent {
        constructor(type: string, params: PointerEventInit = {}) {
            super(type, params);
        }
    }
    // @ts-ignore
    global.PointerEvent = PointerEvent;
}

// Radix UI components use these
HTMLElement.prototype.setPointerCapture = vi.fn();
HTMLElement.prototype.releasePointerCapture = vi.fn();
HTMLElement.prototype.hasPointerCapture = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
});
