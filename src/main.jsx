import MyReact from './my-react';

/** @jsxRuntime classic */
/** @jsx MyReact.createElement */
const container = document.getElementById("root"); 

const AddItemInput = (props) => {
  const [inputValue, setInputValue] = MyReact.useState("");
  const inputRef = MyReact.useRef(null);
  
  const onInput = (e) => setInputValue((v) => e.target.value);
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setInputValue((v) => "");
      props.addNewItem(inputValue);
      // Focus input after adding item
      inputRef.current.focus();
    }
  };

  // Focus input on mount
  MyReact.useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div id="add-item-input">
      <i className="fas fa-plus"/>
      <input
        ref={inputRef}
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
      <h1>This todo-app was build using my </h1>
      <h1><a href='https://github.com/justpetrovich/my-own-react'><i className='fa-brands fa-github'></i> homegrown React implementation</a></h1>
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
  const [filter, setFilter] = MyReact.useState('all'); // 'all', 'active', 'completed'
  
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

  // Memoized filtered items
  const filteredItems = MyReact.useMemo(() => {
    console.log('Filtering items...'); // To demonstrate memoization
    switch (filter) {
      case 'active':
        return items.filter(item => !item.isCompleted);
      case 'completed':
        return items.filter(item => item.isCompleted);
      default:
        return items;
    }
  }, [items, filter]);

  // Memoized handlers using useCallback
  const addNewItem = MyReact.useCallback((item) => {
    setItems((items) => [...items, {
      id: items.length + 1,
      name: item,
      isCompleted: false,
    }]);
  }, []); // Empty deps since it only uses setItems which is stable

  const toggleItem = MyReact.useCallback((id) => {
    setItems((items) => items.map((item) => ({
      ...item,
      isCompleted: item.id === id ? !item.isCompleted : item.isCompleted,
    })));
  }, []); // Empty deps since it only uses setItems which is stable

  const deleteItem = MyReact.useCallback((id) => {
    setItems((items) => items.filter((item) => item.id !== id));
  }, []); // Empty deps since it only uses setItems which is stable

  // Memoized items collection
  const itemsCollection = MyReact.useMemo(() => {
    return filteredItems.map((item) => (
      <Item
        key={item.id}
        id={item.id}
        name={item.name}
        isCompleted={item.isCompleted}
        toggleItem={toggleItem}
        deleteItem={deleteItem}
      />
    ));
  }, [filteredItems, toggleItem, deleteItem]);

  return (
    <div id="app">
      <div id="items-outer-container">
        <div id="items-container" className="scroll-bar">
          <AddItemInput addNewItem={addNewItem}/>
          <div id="filter-buttons">
            <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
            <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
            <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
          </div>
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