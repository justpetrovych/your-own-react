import MyReact from './my-react';

/** @jsxRuntime classic */
/** @jsx MyReact.createElement */
const container = document.getElementById("root"); 

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

const MapItems = () => (
  <section>
      <h1>Map items</h1>
      <ul className='list'>
          {['React', 'from', 'scratch'].map((item) => (
            <li>{item}</li>
          ))}
      </ul>
  </section>
);

const App = () => {
  const [name, setName] = MyReact.useState("World");
  return (
    <div style="background: #03a9f4">
      <AppTitle name={name} />
      <hr/>
      <input
        type="text"
        onInput={(e) => setName((name) => e.target.value)}
        value={name}
      />
      <hr/>
      <Counter />
      <hr/>
      <MapItems />
    </div>
  );
};

MyReact.render(<App />, container);