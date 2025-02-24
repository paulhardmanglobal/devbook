'use client';

import { ToDoList } from '@/app/optowithzod/ToDoList';
import React, { useEffect, useState } from 'react';

import { addTodoCall, getTodosCall, toggleTodoCall } from '@/app/optowithzod/calls';
import { PaboToDoList } from '@/app/optowithzod/PaboTodoList';
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function OptimisticUpdatesDemo() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { todos } = await getTodosCall();
      setTodos(todos);
    };
    fetchTodos();
  }, []);

  const addItem = async (text: string) => {
    const { todos } = await addTodoCall(text);

    setTodos(todos);
  };

  const toggleItem = async (id: number) => {
    const { todos } = await toggleTodoCall(id);
    setTodos(todos);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          React 19 useOptimistic, react hook form w/ zod validation
        </h1>
        {/* <PaboToDoList items={todos} addItem={addItem} toggleItem={toggleItem} /> */}
        <ToDoList items={todos} addItem={addItem} toggleItem={toggleItem} />

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
