'use client';

import React, { useState, useTransition, useOptimistic } from 'react';

function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  type Action =
    | { type: 'add'; todo: string }
    | { type: 'delete'; todo: string }
    | { type: 'update'; oldTodo: string; newTodo: string };

  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    todos,
    (currentTodos: string[], action: Action) => {
      switch (action.type) {
        case 'add':
          return [...currentTodos, action.todo];

        case 'delete':
          return currentTodos.filter((todo) => todo !== action.todo);

        case 'update':
          return currentTodos.map((todo) => (todo === action.oldTodo ? action.newTodo : todo));

        default:
          return currentTodos;
      }
    }
  );

  const handleAddTodo = async (newTodo: string) => {
    startTransition(() => {
      setOptimisticTodos({ type: 'add', todo: newTodo });
    });

    try {
      await fakeApiCallToAddTodo(newTodo);
      setTodos((prevTodos) => [...prevTodos, newTodo]); // Persist update
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleDeleteTodo = async (todoToRemove: string) => {
    startTransition(() => {
      setOptimisticTodos({ type: 'delete', todo: todoToRemove });
    });

    try {
      await fakeApiCallToDeleteTodo(todoToRemove);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo !== todoToRemove)); // Persist update
    } catch (error) {
      console.error('Failed to delete todo:', error);
      startTransition(() => {
        setOptimisticTodos({ type: 'add', todo: todoToRemove }); // Revert on failure
      });
    }
  };

  const handleUpdateTodo = async (oldTodo: string, newTodo: string) => {
    startTransition(() => {
      setOptimisticTodos({ type: 'update', oldTodo, newTodo });
    });

    try {
      await fakeApiCallToUpdateTodo(oldTodo, newTodo);
      setTodos((prevTodos) => prevTodos.map((todo) => (todo === oldTodo ? newTodo : todo))); // Persist update
    } catch (error) {
      console.error('Failed to update todo:', error);
      startTransition(() => {
        setOptimisticTodos({ type: 'update', oldTodo: newTodo, newTodo: oldTodo }); // Revert on failure
      });
    }
  };

  return (
    <div>
      <ul>
        {optimisticTodos.map((todo, index) => (
          <li key={index}>
            {todo}{' '}
            <button onClick={() => handleDeleteTodo(todo)} disabled={isPending}>
              Delete
            </button>
            <button onClick={() => handleUpdateTodo(todo, `Updated ${todo}`)} disabled={isPending}>
              Update
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleAddTodo(`New Todo ${Date.now()}`)} disabled={isPending}>
        Add Todo
      </button>
    </div>
  );
}

const fakeApiCallToAddTodo = (todo: string) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.3 ? resolve() : reject(new Error('API Error'));
    }, 1000);
  });

const fakeApiCallToDeleteTodo = (todo: string) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.3 ? resolve() : reject(new Error('API Error'));
    }, 1000);
  });

const fakeApiCallToUpdateTodo = (oldTodo: string, newTodo: string) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.3 ? resolve() : reject(new Error('API Error'));
    }, 1000);
  });

export default TodoList;
