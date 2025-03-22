import './globals';
import { workLoop } from './workLoop';
import { createElement, render } from "./render";
import { useState, useEffect, useMemo, useCallback, useRef } from "./hooks";

requestIdleCallback(workLoop);

const MyReact = {
  createElement,
  render,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
};

export default MyReact;