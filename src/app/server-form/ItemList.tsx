'use server';

import { Todo } from '@/app/server-form/TodoForm';

export const ItemList = async () => {
  const response = await fetch('http://localhost:3000/api/todos');
  const { todos } = await response.json();

  return (
    <ul className="space-y-2">
      {todos.map((todo: Todo) => (
        <li
          key={todo.id}
          className={`flex items-center p-3 border rounded-md transition-all ${
            todo.completed ? 'bg-gray-50' : 'bg-white'
          }`}
        >
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
  );
};
