import MyReact from './my-react';

/** @jsxRuntime classic */
/** @jsx MyReact.createElement */
const container = document.getElementById("root"); 

const AddItemInput = (props) => {
  const [inputValue, setInputValue] = MyReact.useState("");
  const onInput = (e) => setInputValue((v) => e.target.value);
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setInputValue((v) => "");
      props.addNewItem(inputValue);
    };
  };
  return (
    <div id="add-item-input">
      <i className="fas fa-plus"/>
      <input
        type="text" 
        placeholder="Add item" 
        onInput={onInput}
        onKeyDown={onKeyDown}
        value={inputValue}
      />
    </div>
  );
};

const Item = (props) => {
  const {name, id, isCompleted, toggleItem, deleteItem} = props;
  let classes = isCompleted ? "item completed" : "item";
  return (
  <div 
    id={`item-${id}`}
    className={classes}
  >
    <div className="item-icon" onClick={()=>{toggleItem(id);}}>
      { isCompleted ?
        <i className="fas fa-check completed"/> :
        <i className="far fa-circle uncompleted"/>
      }
    </div>
    <div className="item-name">
      <h1>{name}</h1>
    </div>
    <div className="item-delete" onClick={()=>{deleteItem(id);}}>
      <i className="fas fa-times-circle"/>
    </div>
  </div>
  );
};

const Hints = () => (
  <div id="hints">
    <div id="hint-title">
      <h1>This todo-app was build using</h1>
      <h1><a href='https://github.com/justpetrovich/my-own-react'><i className='fa-brands fa-github'></i> my homegrown React implementation</a></h1>
    </div>
    <div className="hint">
      <i className="fas fa-arrow-right"/>
      <h1>Enter new todo and click Enter</h1>
    </div>
    <div className="hint">
      <i className="fas fa-arrow-right"/>
      <h1>Click the circe to make todo completed</h1>
    </div>
    <div className="hint">
      <i className="fas fa-arrow-right"/>
      <h1>Click the the trash item to delete item</h1>
    </div>

  </div>
);

const App = () => {
  const [items, setItems] = MyReact.useState([]);
  const addNewItem = (item) => setItems((items) => [...items, {
    id: items.length + 1,
    name: item,
    isCompleted: false,
  }]);
  const toggleItem = (id) => setItems((items) => items.map((item) => {
    return {
      ...item,
      isCompleted: item.id === id ? !item.isCompleted : item.isCompleted,
    };
  }));
  const deleteItem = (id) => setItems((items) => items.filter((item) => item.id !== id));

  const itemsCollection = items.map((item, index) => {
    return (
      <Item
        id={item.id}
        name={item.name}
        isCompleted={item.isCompleted}
        toggleItem={toggleItem}
        deleteItem={deleteItem}
      />
    );
  });
  return (
    <div id="app">
    <div id="items-outer-container">
      <div id="items-container" className="scroll-bar">
        <AddItemInput addNewItem={addNewItem}/>
        <div id="items">
          {itemsCollection}
        </div>
      </div>
    </div>
    <Hints/>
  </div>
  );
};

MyReact.render(<App />, container);