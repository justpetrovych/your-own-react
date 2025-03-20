export const isEvent = key => key.startsWith("on");
export const isProperty = key => key !== "children" && !isEvent(key);
export const isNew = (prev, next) => key => prev[key] !== next[key];
export const isGone = (prev, next) => key => !(key in next);

export const isFunction = (fx) => fx instanceof Function;
export const isDepsEqual = (dependencies, newDependencies) => {
    if (dependencies.length !== newDependencies.length) return false;
  
    for (let i = 0; i < dependencies.length; i++) {
        if (dependencies[i] !== newDependencies[i]) return false;
    }
    return true;
}