import { useOptimistic, startTransition } from 'react';

import { SubmitButton, ToggleButton } from '@/app/leerobdemo/components';
export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  optimistic?: boolean;
};

type TodoAction = { type: 'add'; todo: Todo } | { type: 'toggle'; id: number };

export type ToDoListProps = {
  items: Todo[];
  addItem: any;
  toggleItem: any;
};

export const ToDoList = ({ addItem, items, toggleItem }: ToDoListProps) => {
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

  // For the Form action
  const handleToggleTodoForm = async (id: number) => {
    addOptimisticTodo({ type: 'toggle', id });
    await toggleItem(id);
  };

  // For the button action
  const handleToggleTodoButton = async (id: number) => {
    startTransition(async () => {
      addOptimisticTodo({ type: 'toggle', id });
      await toggleItem(id);
    });
  };

  // write a function to check if any of the optimistic todos are still in the optimistic state
  // if they
  // are, then we should disable the button
  // if they are not, then we should enable the button
  const isProcessing = optimisticTodos.some((todo) => todo.optimistic);

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
            {/* Disabled to stop race conditions */}
            {/* But using a form  */}

            {/* <CheckBoxForm
              completed={todo.completed}
              disabled={isProcessing}
              handleToggle={async () => handleToggleTodoForm(todo.id)}
              key={todo.id}
            /> */}

            {/* Disabled to stop race conditions */}
            <ToggleButton
              handleToggle={() => handleToggleTodoButton(todo.id)}
              completed={todo.completed}
              disabled={isProcessing}
            />
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
