import { updateDom, createDom } from "./render";

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
  if (!fiber) {
    return;
  }
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom);
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    );
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

// Run effects for a fiber and its children
const runEffects = (fiber) => {
  if (!fiber) {
    return;
  }

  // Run effects for this fiber if it has hooks
  if (fiber.hooks) {
    fiber.hooks.forEach(hook => {
      // Check if this is an effect hook (has callback and hasChanged flag)
      if (hook.callback && hook.hasChanged !== undefined && hook.hasChanged) {
        // Run cleanup from previous effect if it exists
        if (hook.cleanup && typeof hook.cleanup === 'function') {
          hook.cleanup();
        }

        // Run the effect and store the cleanup function
        const cleanup = hook.callback();
        hook.cleanup = cleanup;
      }
    });
  }

  // Run effects for children
  runEffects(fiber.child);
  runEffects(fiber.sibling);
};

const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index];
    let newFiber = null;

    const sameType =
      oldFiber &&
      element &&
      element.type === oldFiber.type;

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
  window.MyReact.workingFiber.hooks = [];
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
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
};

export const workLoop = (deadline) => {
  let shouldYield = false;
  while (window.MyReact.nextUnitOfWork && !shouldYield) {
    window.MyReact.nextUnitOfWork = performUnitOfWork(
      window.MyReact.nextUnitOfWork
    );
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!window.MyReact.nextUnitOfWork && window.MyReact.workingRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
};

const commitRoot = () => {
  window.MyReact.deletions.forEach(commitWork);
  commitWork(window.MyReact.workingRoot.child);

  // Run effects after DOM updates are complete
  runEffects(window.MyReact.workingRoot.child);

  window.MyReact.currentRoot = window.MyReact.workingRoot;
  window.MyReact.workingRoot = null;
};