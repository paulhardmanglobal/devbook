// app/todos/page.tsx
'use client';

import { useEffect, useState, useActionState } from 'react';

// Types
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// API functions
async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('/api/claude');
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

async function addTodoApi(text: string): Promise<Todo> {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to add todo');
  }

  return response.json();
}

// Todo App Component
export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial todos
  useEffect(() => {
    fetchTodos()
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load todos');
        setLoading(false);
      });
  }, []);

  // Add todo with useActionState
  // Add todo with useActionState
  const [addState, addAction, pending] = useActionState(
    // Server action
    async (prevState: any, formData: FormData) => {
      try {
        const text = formData.get('text') as string;
        if (!text || text.trim() === '') {
          return { ...prevState, error: 'Todo text cannot be empty' };
        }

        const newTodo = await addTodoApi(text);
        setTodos((prev) => [...prev, newTodo]);
        return { id: newTodo.id, error: null };
      } catch (err) {
        return { ...prevState, error: 'Failed to add todo' };
      }
    },
    // Initial state
    { id: null, error: null },
    // Optimistic update function
    (prevState: any, formData: FormData) => {
      const text = formData.get('text') as string;
      if (!text || text.trim() === '') {
        return prevState;
      }

      // Generate temporary ID for optimistic UI
      const tempId = `temp-${Date.now()}`;

      // Optimistically add to local state
      const optimisticTodo = { id: tempId, text, completed: false };
      setTodos((prev) => [...prev, optimisticTodo]);

      return { id: tempId, error: null };
    }
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading todos...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {/* Add Todo Form */}
      <form action={addAction} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="text"
            placeholder="Add a new todo"
            className="flex-1 p-2 border rounded text-black"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            {pending ? 'Adding...' : 'Add'}
          </button>
        </div>
        {addState.error && <p className="text-red-500 text-sm mt-1">{addState.error}</p>}
      </form>

      {/* Todo List */}
      <ul className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="flex items-center p-3 border rounded">
              <span className="flex-1">{todo.text}</span>
              {todo.id.startsWith('temp-') && (
                <span className="text-xs text-gray-400">Saving...</span>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
