import './globals';
import { render, createElement } from './render';
import { workLoop } from './workLoop';

requestIdleCallback(workLoop);

const MyReact = {
  createElement,
  render,
};

export default MyReact;