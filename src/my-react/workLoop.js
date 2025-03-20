import { updateDom, createDom } from "./render";
import { isDepsEqual, isFunction } from "./helpers";

const requestIdleCallbackFallback = (handler) => {
  const start = Date.now();

  return setTimeout(() => {
    handler({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1);
};
// shim
window.requestIdleCallback = window.requestIdleCallback || requestIdleCallbackFallback;

const commitDeletion = (fiber, domParent) => {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
};

const commitWork = (fiber) => {
  if (!fiber) return;
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = element?.type === oldFiber?.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      window.MyReact.deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
};

const updateFunctionComponent = (fiber) => {
  window.MyReact.workingFiber = fiber;
  window.MyReact.hookIndex = 0;
  window.MyReact.workingFiber.stateHooks = [];
  window.MyReact.workingFiber.effectHooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
};

const updateHostComponent = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
};

const performUnitOfWork = (fiber) => {
  isFunction(fiber.type) ? updateFunctionComponent(fiber) : updateHostComponent(fiber);

  if (fiber.child) return fiber.child;
  
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
};

export const workLoop = (deadline) => {
  let shouldYield = false;
  while (window.MyReact.nextUnitOfWork && !shouldYield) {
    window.MyReact.nextUnitOfWork = performUnitOfWork(window.MyReact.nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!window.MyReact.nextUnitOfWork && window.MyReact.workingRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
};

const commitEffectHooks = () => {
  function runCleanup(fiber) {
    if (!fiber) {
      return;
    }
    fiber.alternate?.effectHooks?.forEach((effectHook, index) => {
      const deps = fiber.effectHooks[index]?.dependencies;
      if (!effectHook.dependencies || !isDepsEqual(effectHook.dependencies, deps)) {
        effectHook.cleanup?.();
      }
    })
    runCleanup(fiber.child);
    runCleanup(fiber.sibling);
  }
  function runEffect(fiber) {
    if (!fiber) return;

    fiber.effectHooks?.forEach((newEffectHook, index) => {
      if (!fiber.alternate) {
        newEffectHook.cleanup = newEffectHook.callback();
        return;
      };
      if (!newEffectHook.dependencies) {
        newEffectHook.cleanup = newEffectHook.callback();
      };
      if (newEffectHook.dependencies.length > 0) {
        const oldEffectHook = fiber.alternate?.effectHooks[index];
        if (!isDepsEqual(oldEffectHook.dependencies, newEffectHook.dependencies)) {
          newEffectHook.cleanup = newEffectHook.callback();
        };
      };
    });
    runEffect(fiber.child);
    runEffect(fiber.sibling);
  }
  runCleanup(window.MyReact.workingRoot);
  runEffect(window.MyReact.workingRoot);
};

const commitRoot = () => {
  window.MyReact.deletions.forEach(commitWork);
  commitWork(window.MyReact.workingRoot.child);
  commitEffectHooks();
  window.MyReact.currentRoot = window.MyReact.workingRoot;
  window.MyReact.workingRoot = null;
  window.MyReact.deletions = [];
};