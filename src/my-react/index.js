import './globals';
import { workLoop } from './workLoop';
import { createElement, render } from "./render";
import { useState, useEffect } from "./hooks";

requestIdleCallback(workLoop);

const MyReact = {
  createElement,
  render,
  useState,
  useEffect,
};

export default MyReact;