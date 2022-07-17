import MyReact from './my-react';

/** @jsxRuntime classic */
/** @jsx MyReact.createElement */
const element = (
  <div style="background: #03a9f4">
    <h1>Hello World</h1>
    <h2 style="text-align:right">from MyReact</h2>
  </div>
);

const container = document.getElementById("root");
MyReact.render(element, container);
