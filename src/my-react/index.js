import { createElement } from './createElement';
import { render } from './render';
import { workLoop } from './workLoop';

requestIdleCallback(workLoop);

const MyReact = {
  createElement,
  render,
};

export default MyReact;