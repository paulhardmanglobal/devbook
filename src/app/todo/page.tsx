'use client';

import React, { useState, useTransition } from 'react';
import { useOptimistic } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function OptimisticUpdatesDemo() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React 19', completed: false },
    { id: 2, text: 'Master useOptimistic', completed: false },
    { id: 3, text: 'Build something cool', completed: false },
  ]);

  // For adding new todos
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos, (state, newTodo: Todo) => [
    ...state,
    newTodo,
  ]);

  // For toggling todos - separate optimistic state
  const [displayTodos, updateDisplayTodos] = useOptimistic(
    optimisticTodos,
    (state, todoId: number) =>
      state.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    // Create the new todo
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };

    setIsSubmitting(true);
    setText('');

    // Properly wrap the optimistic update in a startTransition
    startTransition(() => {
      addOptimisticTodo(newTodo);
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Actually update the state
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setIsSubmitting(false);
  }

  async function handleToggleTodo(id: number) {
    startTransition(() => {
      // Apply optimistic update
      updateDisplayTodos(id);
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the actual state
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">React 19 useOptimistic Demo</h1>

        <form onSubmit={handleAddTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new todo"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>

        <ul className="space-y-2">
          {displayTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center p-3 border rounded-md transition-all ${
                todo.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <button
                onClick={() => handleToggleTodo(todo.id)}
                className="mr-3 flex-shrink-0"
                disabled={isPending}
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
