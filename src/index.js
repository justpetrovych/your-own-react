import MyReact from './my-react';

/** @jsxRuntime classic */
/** @jsx MyReact.createElement */
const container = document.getElementById("root"); 

const onInputHandler = (event) => {
  renderer(event.target.value);
};

const AppTitle = (props) => (
  <header>
    <h1>Hello {props.name}</h1>
    <h2 style="text-align:right">from MyReact</h2>
  </header>
);

const Counter = () => {
  const [count, setCount] = MyReact.useState(0);
  return (
    <div>
      <h1>Counter</h1>
      <h2>{count}</h2>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
};

const renderer = (value) => {
  const element = (
    <div style="background: #03a9f4">
      <AppTitle name={value} />
      <hr/>
      <input type="text" onInput={onInputHandler} value={value}/>
      <hr/>
      <Counter />
    </div>
  );
  MyReact.render(element, container);
};

renderer("Wolrd");
