import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaPencilAlt, FaTrash, FaSearch, FaShoppingBag } from 'react-icons/fa';

function App() {
  // Add a ref for the input element
  const inputRef = useRef(null);
  // Add state to track input focus
  const [inputFocused, setInputFocused] = useState(false);
  
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('shoppingList');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [newItem, setNewItem] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    const item = {
      id: Date.now(),
      text: newItem,
      completed: false
    };
    
    setItems([item, ...items]);
    setNewItem('');
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setItems(items.map(item =>
      item.id === id ? { ...item, text: editText } : item
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const toggleComplete = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const deleteSelected = () => {
    setItems(items.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const toggleSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const filteredItems = items.filter(item =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add this function to check if the add button should be disabled
  const isAddButtonDisabled = () => {
    return !inputFocused || !newItem.trim();
  };

  return (
    <div className={`min-h-screen w-full overflow-hidden ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-xl mx-auto p-4 h-screen overflow-hidden relative flex flex-col">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-5 right-5 p-2 text-xl bg-transparent border-none rounded-full cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <h1 className="text-center text-2xl font-bold mb-6 mt-4 dark:text-white">Blanjan 🛒</h1>
        <form onSubmit={addItem} className="flex gap-2 mb-4 w-full max-w-lg mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Add new item..."
            className="flex-1 p-3 border border-gray-300 rounded-md text-center text-base dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            type="submit" 
            disabled={isAddButtonDisabled()}
            className={`p-3 border-none rounded-md cursor-pointer text-base transition-colors flex items-center justify-center w-12 h-12 ${
              isAddButtonDisabled() 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
            aria-label="Add item"
          >
            <FaPlus />
          </button>
        </form>

        <div className="w-full max-w-lg mx-auto mb-4">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-md text-base dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {items.length > 0 && (
          <div className="w-full max-w-lg mx-auto mb-4 flex justify-between">
            {items.length > 0 && (
              <div className="w-full max-w-lg mx-auto mb-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedItems.length === items.length}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 cursor-pointer"
                    id="select-all"
                  />
                  <label htmlFor="select-all" className="text-sm cursor-pointer dark:text-gray-300">
                    Select All
                  </label>
                </div>
                <button 
                  onClick={deleteSelected}
                  disabled={selectedItems.length === 0}
                  className={`px-4 py-2 text-white border-none rounded-md cursor-pointer text-sm transition-all ${selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-danger hover:bg-danger-hover'}`}
                >
                  Delete Selected ({selectedItems.length})
                </button>
              </div>
            )}
          </div>
        )}

        <ul className="list-none w-full max-w-lg mx-auto overflow-y-auto overflow-x-hidden px-2 py-3 rounded-lg border border-gray-200 dark:border-gray-700 h-[calc(11*3.5rem)] mb-4">
          {filteredItems.length === 0 ? (
            <li className="text-center p-4 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No items match your search' : 'Your shopping list is empty'}
            </li>
          ) : (
            filteredItems.map(item => (
              <li 
                key={item.id} 
                className={`flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md mb-2 w-full dark:bg-gray-800 dark:border-gray-600 ${item.completed ? 'dark:text-gray-500' : 'dark:text-white'}`}
              >
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
                {editingId === item.id ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <button 
                      onClick={() => saveEdit(item.id)} 
                      className="px-4 py-2 bg-primary text-white border-none rounded-md cursor-pointer text-sm hover:bg-primary-hover"
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelEdit} 
                      className="px-4 py-2 bg-gray-500 text-white border-none rounded-md cursor-pointer text-sm hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span 
                      className={`flex-1 text-base cursor-pointer px-2 ${item.completed ? 'line-through text-gray-500' : ''}`}
                      onClick={() => toggleComplete(item.id)}
                    >
                      {item.text}
                    </span>
                    <div className="flex gap-2">
                      {!item.completed && (
                        <>
                          <button 
                            onClick={() => startEditing(item)} 
                            className="flex items-center justify-center w-9 h-9 bg-info text-white border-none rounded-md cursor-pointer text-sm hover:bg-info-hover"
                            aria-label="Edit item"
                          >
                            <FaPencilAlt />
                          </button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="flex items-center justify-center w-9 h-9 bg-danger text-white border-none rounded-md cursor-pointer text-sm hover:bg-danger-hover"
                            aria-label="Delete item"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
        
        {/* Space for footer */}
        <div className="mt-auto py-4 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          © {new Date().getFullYear()} Blanjan by <a className='text-info' href='https://trazmedia.com' target='_blank'>Trazmedia</a>
        </div>
      </div>
    </div>
  );
}

export default App;
