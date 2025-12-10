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
        // Use currentRoot if available, otherwise fall back to workingRoot
        // This handles the case when setState is called from an effect during first render
        const root = window.MyReact.currentRoot || window.MyReact.workingRoot;
        window.MyReact.workingRoot = {
            dom: root.dom,
            props: root.props,
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