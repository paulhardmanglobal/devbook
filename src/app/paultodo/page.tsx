'use client';

import React, { useEffect, useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function OptimisticUpdatesDemo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const fetchTodos = async () => {
    const result = await fetch('/api/todos');
    const { todos } = await result.json();
    console.log(todos);
    setTodos(todos);
  };

  const addTodo = async (todo: Todo) => {
    const result = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ todo }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { todos: updatedTodos } = await result.json();

    setTodos(updatedTodos);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (formData: FormData) => {
    addTodo({
      text: formData.get('todo') as string,
      id: Math.floor(Math.random() * 1000),
      completed: false,
    });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">React 19 useOptimistic Demo</h1>

        <form action={handleSubmitForm} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              name="todo"
              placeholder="Add a new todo"
              className="flex-1 text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center p-3 border rounded-md transition-all ${
                todo.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <button
                // onClick={() => handleToggleTodo(todo.id)}
                className="mr-3 flex-shrink-0"
                // disabled={isPending}
              >
                <div
                  className={`w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center transition-colors ${
                    todo.completed ? 'bg-green-500 border-green-500' : 'bg-white'
                  }`}
                >
                  {todo.completed && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      width="16"
                      height="16"
                    >
                      <path d="M9.55 18l-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" />
                    </svg>
                  )}
                </div>
              </button>

              <span
                className={`flex-1 transition-all ${
                  todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-sm text-gray-600">
          <p>This demo showcases React 19's useOptimistic hook:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Add a new todo to see instant optimistic updates</li>
            <li>Click a todo to toggle completion state</li>
            <li>Both actions simulate a 1-second API delay</li>
            <li>All optimistic updates occur within transitions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
