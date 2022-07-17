import { createNode } from './render';

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

const commitRoot = () => {
  commitWork(MyReact.workingRoot.child);
  MyReact.workingRoot = null;
};

const commitWork = (fiber) => {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

export const workLoop = (deadline) => {
  while (MyReact.nextUnitOfWork && deadline.timeRemaining() > 0) {
    MyReact.nextUnitOfWork = performUnitOfWork(MyReact.nextUnitOfWork);
  }

  if (!MyReact.nextUnitOfWork && MyReact.workingRoot) {
    requestAnimationFrame(commitRoot);
  }

  requestIdleCallback(workLoop);
};

const performUnitOfWork = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createNode(fiber);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
  
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      node: null,
    };
  
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
  
    prevSibling = newFiber;
    index++;
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