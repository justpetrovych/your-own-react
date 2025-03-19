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