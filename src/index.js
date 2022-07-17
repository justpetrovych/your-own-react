import MyReact from './my-react';

/** @jsxRuntime classic */
/** @jsx MyReact.createElement */
const container = document.getElementById("root"); 

const onInputHandler = (event) => {
  renderer(event.target.value);
};

const renderer = (value) => {
  const element = (
    <div style="background: #03a9f4">
      <h1>Hello {value}</h1>
      <h2 style="text-align:right">from MyReact</h2>
      <hr/>
      <input type="text" onInput={onInputHandler} value={value}/>
    </div>
  );
  MyReact.render(element, container);
};

renderer("Wolrd");
