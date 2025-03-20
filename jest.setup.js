import '@testing-library/jest-dom';

// Mock requestIdleCallback with a proper deadline object
global.requestIdleCallback = (cb) => {
  const deadline = {
    timeRemaining: () => 1, // Always return 1ms remaining to prevent yielding
    didTimeout: false
  };
  return setTimeout(() => cb(deadline), 0);
};

global.cancelIdleCallback = (id) => clearTimeout(id); 