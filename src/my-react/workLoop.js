const requestIdleCallbackFallback = (handler) => {
  const start = Date.now()

  return setTimeout(() => {
    handler({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    })
  }, 1)
}
// shim
window.requestIdleCallback = window.requestIdleCallback || requestIdleCallbackFallback;

export const workLoop = (deadline) => {
  while (MyReact.nextUnitOfWork && deadline.timeRemaining() > 0) {
    MyReact.nextUnitOfWork = performUnitOfWork(MyReact.nextUnitOfWork);
  }
  requestIdleCallback(workLoop);
}

const performUnitOfWork = (nextUnitOfWork) => {
 // TODO
}