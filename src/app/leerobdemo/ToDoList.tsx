import { useOptimistic, startTransition, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { CheckBoxToggle, SubmitButton, ToggleButton } from '@/app/leerobdemo/components';
export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  optimistic?: boolean;
};

type TodoAction =
  | { type: 'add'; todo: Todo }
  | { type: 'toggle'; id: number }
  | { type: 'update'; todos: Todo[] };

export type ToDoListProps = {
  items: Todo[];
  addItem: any;
  toggleItem: any;
};

export const ToDoList = ({ addItem, items, toggleItem }: ToDoListProps) => {
  const [isPending, setIsPending] = useState(false); // 🔹 Global loading state
  const [optimisticTodos, addOptimisticTodo] = useOptimistic<Todo[], TodoAction>(
    items,
    (currentTodos, action) => {
      switch (action.type) {
        case 'add':
          return [...currentTodos, { ...action.todo, optimistic: true }];
        case 'toggle':
          return currentTodos.map((todo) =>
            todo.id === action.id ? { ...todo, completed: !todo.completed, optimistic: true } : todo
          );
        case 'update':
          return currentTodos.map((todo) => ({
            ...todo,
            optimistic: false, // Ensure real data replaces optimistic state
          }));
      }
    }
  );
  async function formAction(formData: FormData) {
    const newTodo: Todo = {
      id: Math.random(),
      text: formData.get('todo') as string,
      completed: false,
      optimistic: true,
    };

    addOptimisticTodo({ type: 'add', todo: newTodo });
    await addItem(newTodo.text);
  }
  const handleToggleTodo = async (id: number) => {
    startTransition(async () => {
      addOptimisticTodo({ type: 'toggle', id });
      await toggleItem(id);
      console.log(isPending);
    });
  };

  return (
    <>
      <form action={formAction} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="todo"
            placeholder="Add a new todo"
            className="flex-1 text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SubmitButton />
        </div>
      </form>
      <ul className="space-y-2">
        {optimisticTodos.map((todo, index) => (
          <li
            key={`${todo.id}-${index}`}
            className={`flex items-center p-3 border rounded-md transition-all ${
              todo.completed ? 'bg-gray-50' : 'bg-white'
            } ${todo.optimistic ? 'opacity-50' : ''}`}
          >
            <form action={async () => handleToggleTodo(todo.id)} className="mr-3 flex-shrink-0">
              <label className="relative cursor-pointer">
                <CheckBoxToggle completed={todo.completed} />
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
              </label>
            </form>

            {/* Disabled to stop race conditions */}

            {/* <button onClick={() => handleToggleTodo(todo.id)} className="mr-3 flex-shrink-0">
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
              </button> */}
            <span
              className={`flex-1 transition-all ${
                todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
              }`}
            >
              {todo.text}
              {todo.optimistic && (
                <span className="text-xs text-gray-400 ml-1">{'(Saving...)'}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
