export const isEvent = key => key.startsWith("on");
export const isStyle = key => key === "style";
export const isProperty = key => key !== "children" && !isEvent(key) && !isStyle(key);
export const isNew = (prev, next) => key => prev[key] !== next[key];
export const isGone = (prev, next) => key => !(key in next);