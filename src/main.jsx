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
    <div id="hint-title" style={{ borderBottom: '1px solid #e6e6e6', marginBottom: '10px', paddingBottom: '5px' }}>
      <h1>This todo-app was build using my </h1>
      <h1><a href='https://github.com/justpetrovich/my-own-react'><i className='fa-brands fa-github'></i> homegrown React implementation</a></h1>
    </div>
    <div className="hint">
      <i className="fas fa-arrow-right" style={{ color: '#4eb3f1', fontSize: '12px' }}/>
      <h1>Enter new todo and click Enter</h1>
    </div>
    <div className="hint">
      <i className="fas fa-arrow-right" style={{ color: '#4eb3f1', fontSize: '12px' }}/>
      <h1>Click the circe to make todo completed</h1>
    </div>
    <div className="hint">
      <i className="fas fa-arrow-right" style={{ color: '#4eb3f1', fontSize: '12px' }}/>
      <h1>Click the the trash item to delete item</h1>
    </div>
  </div>
);

const App = () => {
  const [items, setItems] = MyReact.useState([]);
  
  // Loading items from localStorage on first render
  MyReact.useEffect(() => {
    const savedItems = localStorage.getItem('todo-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []); // Empty array means the effect will only run once on mount

  // Saving items to localStorage on every change
  MyReact.useEffect(() => {
    localStorage.setItem('todo-items', JSON.stringify(items));
  }, [items]); // Effect runs on every change of items

  // Update document title with count of uncompleted items
  MyReact.useEffect(() => {
    const uncompletedCount = items.filter(item => !item.isCompleted).length;
    if (uncompletedCount === 0) {
      document.title = 'MyReact Todo - All done!';
    } else {
      document.title = `MyReact Todo (${uncompletedCount})`;
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'MyReact Todo';
    };
  }, [items]); // Effect runs when items change

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