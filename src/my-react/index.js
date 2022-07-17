import './globals';
import { workLoop } from './workLoop';
import { createElement, render } from "./render";
import { useState } from "./hooks";

requestIdleCallback(workLoop);

const MyReact = {
  createElement,
  render,
  useState,
};

export default MyReact;