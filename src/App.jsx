import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

const getDefaultLocalStorageValue = (key) => {
  const storedValue =localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }
  try {
    return JSON.parse(storedValue)
  }
  catch {
    return null;
  }
};
const useStickeyState = (localStorageKey, defaultValue) => {
  const [state, setState] = useState(getDefaultLocalStorageValue(localStorageKey) ?? defaultValue);
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state) );
  }, [ localStorageKey, state]);
  return [state, setState];
};

export default function App() {
  
  const [todos, setTodos] = useStickeyState("todos", [
    { id: 1, text: "Sleep" , checked:false},
    { id:2, text: "Eat", checked:false},
  ]);
  const [count, setCount] = useStickeyState("count-saved", 0);
  const [deleteCount, setDeleteCount] = useStickeyState("delete-count", 0);
  const onFormAction = async (formData) => {
      const todo = formData.get("todo");
      
      setTodos([...todos, { id: Date.now(), text: todo, checked:false }]);
  };
  const deleteTodo =(id) => {
    
    setTodos(todos.filter(todo => todo.id !== id));
    setDeleteCount(deleteCount + 1);

  };
  const updateTodoChecked = (id, newChecked) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            checked: newChecked
          };
        }
        return todo;
      })
    )
  };
  const completedCount = todos.filter(t => t.checked).length;
  return (
    
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {completedCount} of {todos.length} tasks completed · {count} added in the last sessions · {deleteCount} deleted
          </p>
        </div>
        
        <form action={onFormAction}
        className="flex gap-2 mb-6">
          <input 
          name="todo"
          placeholder="Add a new task..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400" />
          <button 
          type = "submit"
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          onClick={() => setCount(count + 1)}>Add</button>
        </form>
        <ul className="flex flex-col gap-4">
          {todos.map((todo) => (
            <li key={todo.id} className ="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                <input type="checkbox" checked={todo.checked} onChange={e => {
                  updateTodoChecked(todo.id, !todo.checked);
                }} />
                <span className={`flex-1 text-sm ${todo.checked ? "line-through text-gray-400" : "text-gray-800"}`}>{todo.text}</span>
                <button
                onClick={() => deleteTodo(todo.id)}
                className="text-xs text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 rounded px-2 py-1 transition-colors">delete</button>          
            </li>
            
          ))}
        </ul>
      </div>
  </div>
      
    
  );
}

