'use client';

import { ToDoList } from '@/app/use-optimistic-example/ToDoList';
import React, { useState, useEffect } from 'react';

export default function OptimisticUpdatesDemo() {
  const [todos, setTodos] = useState<any[]>([]);
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch('/api/todos');
        const { todos } = await res.json();
        setTodos(todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          React 19 useOptimistic, react hook form w/ zod validation
        </h1>

        <ToDoList todos={todos} setTodos={setTodos} />
        <div className="mt-6 text-sm text-gray-600">
          <p>This demo showcases React 19's useOptimistic hook with zod and react hook form:</p>
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
