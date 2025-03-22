import { useMemo, useCallback, useRef } from '../hooks';

describe('useMemo', () => {
    let mockFiber;
    let mockAlternateFiber;
    let mockWorkingRoot;

    beforeEach(() => {
        // Reset global MyReact state
        window.MyReact = {
            workingFiber: {
                hooks: [],
                alternate: null
            },
            hookIndex: 0,
            workingRoot: null,
            nextUnitOfWork: null,
            deletions: []
        };
    });

    test('should memoize value and return same reference when dependencies unchanged', () => {
        const factory = jest.fn(() => ({ value: 'test' }));
        const dependencies = [1, 2, 3];

        // First call
        const result1 = useMemo(factory, dependencies);
        expect(factory).toHaveBeenCalledTimes(1);
        expect(result1).toEqual({ value: 'test' });

        // Second call with same dependencies
        const result2 = useMemo(factory, dependencies);
        expect(factory).toHaveBeenCalledTimes(1); // Should not call again
        expect(result2).toBe(result1); // Should return same reference
    });

    test('should recompute value when dependencies change', () => {
        const factory = jest.fn(() => ({ value: 'test' }));
        const dependencies1 = [1, 2, 3];
        const dependencies2 = [1, 2, 4];

        // First call
        const result1 = useMemo(factory, dependencies1);
        expect(factory).toHaveBeenCalledTimes(1);

        // Second call with different dependencies
        const result2 = useMemo(factory, dependencies2);
        expect(factory).toHaveBeenCalledTimes(2);
        expect(result2).not.toBe(result1);
    });
});

describe('useCallback', () => {
    beforeEach(() => {
        window.MyReact = {
            workingFiber: {
                hooks: [],
                alternate: null
            },
            hookIndex: 0,
            workingRoot: null,
            nextUnitOfWork: null,
            deletions: []
        };
    });

    test('should return same function reference when dependencies unchanged', () => {
        const callback = jest.fn();
        const dependencies = [1, 2, 3];

        // First call
        const result1 = useCallback(callback, dependencies);
        expect(result1).toBe(callback);

        // Second call with same dependencies
        const result2 = useCallback(callback, dependencies);
        expect(result2).toBe(result1); // Should return same reference
    });

    test('should return new function reference when dependencies change', () => {
        const callback = jest.fn();
        const dependencies1 = [1, 2, 3];
        const dependencies2 = [1, 2, 4];

        // First call
        const result1 = useCallback(callback, dependencies1);
        expect(result1).toBe(callback);

        // Second call with different dependencies
        const result2 = useCallback(callback, dependencies2);
        expect(result2).not.toBe(result1);
    });
});

describe('useRef', () => {
    beforeEach(() => {
        window.MyReact = {
            workingFiber: {
                hooks: [],
                alternate: null
            },
            hookIndex: 0,
            workingRoot: null,
            nextUnitOfWork: null,
            deletions: []
        };
    });

    test('should initialize with initial value', () => {
        const initialValue = { test: 'value' };
        const ref = useRef(initialValue);
        expect(ref.current).toBe(initialValue);
    });

    test('should maintain same reference between renders', () => {
        const initialValue = { test: 'value' };
        const ref1 = useRef(initialValue);
        
        // Simulate a re-render
        window.MyReact.workingFiber.alternate = {
            hooks: [{ current: initialValue }]
        };
        const ref2 = useRef(initialValue);
        
        expect(ref2).toBe(ref1);
        expect(ref2.current).toBe(initialValue);
    });

    test('should allow updating current value', () => {
        const ref = useRef(0);
        expect(ref.current).toBe(0);
        
        ref.current = 1;
        expect(ref.current).toBe(1);
    });
}); 