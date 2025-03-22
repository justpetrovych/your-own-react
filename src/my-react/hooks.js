export const useState = (initialState) => {
    const oldHook = 
        window.MyReact.workingFiber.alternate &&
        window.MyReact.workingFiber.alternate.hooks &&
        window.MyReact.workingFiber.alternate.hooks[window.MyReact.hookIndex];
    const hook = {
        state: oldHook ? oldHook.state : initialState,
        queue: [],
    };

    const actions = oldHook ? oldHook.queue : [];
    actions.forEach(action => {
      hook.state = action(hook.state);
    });

    const setState = (newState) => {
        hook.queue.push(newState);
        window.MyReact.workingRoot = {
            dom: window.MyReact.currentRoot.dom,
            props: window.MyReact.currentRoot.props,
            alternate: window.MyReact.currentRoot,
        };
        window.MyReact.nextUnitOfWork = window.MyReact.workingRoot;
        window.MyReact.deletions = [];
    };

    window.MyReact.workingFiber.hooks.push(hook);
    window.MyReact.hookIndex++;
    return [hook.state, setState];
};

export const useEffect = (callback, dependencies) => {
    // TODO: Implement useEffect
};

export const useMemo = (factory, dependencies) => {
    const oldHook = window.MyReact.workingFiber.alternate?.hooks?.[window.MyReact.hookIndex];
    
    const hook = {
        value: oldHook ? oldHook.value : factory(),
        dependencies: dependencies || [],
    };

    // Check if dependencies have changed
    const hasChanged = !oldHook || 
        dependencies.some((dep, i) => dep !== oldHook.dependencies[i]);

    if (hasChanged) {
        hook.value = factory();
        hook.dependencies = dependencies || [];
    }

    window.MyReact.workingFiber.hooks.push(hook);
    window.MyReact.hookIndex++;
    return hook.value;
};

export const useCallback = (callback, dependencies) => {
    const oldHook = 
        window.MyReact.workingFiber.alternate &&
        window.MyReact.workingFiber.alternate.hooks &&
        window.MyReact.workingFiber.alternate.hooks[window.MyReact.hookIndex];
    
    const hook = {
        callback: oldHook ? oldHook.callback : callback,
        dependencies: dependencies || [],
    };

    // Check if dependencies have changed
    const hasChanged = !oldHook || 
        dependencies.some((dep, i) => dep !== oldHook.dependencies[i]);

    if (hasChanged) {
        hook.callback = callback;
        hook.dependencies = dependencies || [];
    }

    window.MyReact.workingFiber.hooks.push(hook);
    window.MyReact.hookIndex++;
    return hook.callback;
};

export const useRef = (initialValue) => {
    const oldHook = 
        window.MyReact.workingFiber.alternate &&
        window.MyReact.workingFiber.alternate.hooks &&
        window.MyReact.workingFiber.alternate.hooks[window.MyReact.hookIndex];
    
    const hook = {
        current: oldHook ? oldHook.current : initialValue
    };

    window.MyReact.workingFiber.hooks.push(hook);
    window.MyReact.hookIndex++;
    return hook;
};