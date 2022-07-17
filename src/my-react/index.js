import './globals';
import { workLoop } from './workLoop';
import { createElement, render } from "./render";


requestIdleCallback(workLoop);

const MyReact = {
  createElement,
  render,
};

export default MyReact;