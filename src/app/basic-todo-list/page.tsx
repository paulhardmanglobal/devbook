'use client';

import { ToDoList } from '@/app/basic-todo-list/ToDoList';
import React, { useState, useEffect } from 'react';

const fetchTodos = async () => {
  const res = await fetch('/api/todos');
  if (!res.ok) throw new Error('Failed to fetch todos');
  const { todos } = await res.json();
  return todos;
};
export default function OptimisticUpdatesDemo() {
  const [todos, setTodos] = useState<any[]>([]);
  useEffect(() => {
    const fetchtodos = async () => {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const { todos } = await res.json();
      setTodos(todos);
      return todos;
    };
    fetchtodos();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Standard React todo list</h1>

        <ToDoList todos={todos} setTodos={setTodos} />
        <div className="mt-6 text-sm text-gray-600">
          <p>This demo showcases a basic to do list that you would build using react</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              This form implements ZOD for validation, and react hook form to handle submission
            </li>
            <li>We will update this code in a code along to implement reacts useOptimistic hook</li>
            <li>Click a todo to toggle completion state</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
