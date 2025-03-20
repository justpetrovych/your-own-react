import { isFunction } from "./helpers"

export const useState = (initialState) => {
    const oldStateHook = window.MyReact.workingFiber.alternate?.stateHooks?.[window.MyReact.stateHookIndex];
    const stateHook = {
        state: oldStateHook ? oldStateHook.state : initialState,
        queue: oldStateHook ? oldStateHook.queue : [],
    };

    stateHook.queue.forEach(action => {
        stateHook.state = action(stateHook.state);
    });

    stateHook.queue = [];
    window.MyReact.stateHookIndex++;
    window.MyReact.workingFiber.stateHooks.push(stateHook);

    const setState = (action) => {
        stateHook.queue.push(isFunction(action) ? action : () => action);
        if (window.MyReact.currentRoot) {
            window.MyReact.workingRoot = {
                dom: window.MyReact.currentRoot.dom,
                props: window.MyReact.currentRoot.props,
                alternate: window.MyReact.currentRoot,
            };
        }
        window.MyReact.nextUnitOfWork = window.MyReact.workingRoot;
        // window.MyReact.deletions = [];
    };

    return [stateHook.state, setState];
};

export const useEffect = (callback, dependencies) => {
    const effectHook = {
        callback,
        dependencies,
        cleanup: undefined,
    };
    window.MyReact.workingFiber.effectHooks.push(effectHook);
};