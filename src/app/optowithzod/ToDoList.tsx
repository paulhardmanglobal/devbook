import { useOptimistic, startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, todoSchemaType } from '@/app/optowithzod/schema';
import { SubmitButton, ToggleButton } from '@/app/leerobdemo/components';
import { CheckBoxForm } from '@/app/optowithzod/components';
export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

// @todo don't call it optimistic, call it pending
type OptimisticTodos = Todo & { optimistic?: boolean };

type TodoAction = { type: 'add'; todo: Todo } | { type: 'toggle'; id: number };

export type ToDoListProps = {
  items: Todo[];
  addItem: any;
  toggleItem: any;
};

export const ToDoList = ({ addItem, items = [], toggleItem }: ToDoListProps) => {
  const {
    register,
    trigger,
    reset,
    formState: { errors },
  } = useForm<todoSchemaType>({
    resolver: zodResolver(todoSchema),
    defaultValues: { text: '' },
  });

  const [optimisticTodos, addOptimisticTodo] = useOptimistic<OptimisticTodos[], TodoAction>(
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
  async function formAction(prevState: any, data: any) {
    const res = await trigger(['text']);

    if (!res) return;

    const newTodo = {
      id: Math.random(),
      text: data.get('text') as string,
      completed: false,
      optimistic: true,
    };

    addOptimisticTodo({
      type: 'add',
      todo: {
        id: Math.random(),
        text: data.get('text') as string,
        completed: false,
      },
    });

    try {
      await addItem(data.get('text'));
      // If the API call succeeds, remove the optimistic flag
      addOptimisticTodo({
        type: 'add',
        todo: { ...newTodo },
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      // If the API call fails, remove the optimistic todo
      addOptimisticTodo({
        type: 'toggle',
        id: newTodo.id,
      });
    }
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

  const [x, moddedAction, pendingState] = useActionState(formAction, null);

  // write a function to check if any of the optimistic todos are still in the optimistic state
  // if they
  // are, then we should disable the button
  // if they are not, then we should enable the button
  const isProcessing = optimisticTodos?.some((todo) => todo?.optimistic);

  return (
    <>
      <form action={moddedAction} className="mb-6">
        <div className="flex gap-2 w-full flex-col">
          <div className="flex gap-2 w-full">
            <input
              {...register('text')}
              disabled={pendingState}
              type="text"
              placeholder="Add a new todo"
              className="flex-1 text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <SubmitButton />
          </div>
          {errors.text && <span className="text-red-500 text-sm">{errors.text?.message}</span>}
        </div>
      </form>
      {items.length < 1 ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <ul className="space-y-2">
          {optimisticTodos.map((todo, index) => (
            <li
              key={`${todo.id}-${index}`}
              className={`flex items-center p-3 border rounded-md transition-all ${
                todo.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              {/* Disabled to stop race conditions */}
              {/* But using a form  */}
              <CheckBoxForm
                disabled={isProcessing}
                completed={todo.completed}
                handleToggle={async () => handleToggleTodoForm(todo.id)}
                key={todo.id}
              />

              {/* Disabled to stop race conditions */}
              {/* <ToggleButton
                handleToggle={() => handleToggleTodoButton(todo.id)}
                completed={todo.completed}
                disabled={isProcessing}
              /> */}
              <span
                className={`flex-1 transition-all ${
                  todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>
              {todo.optimistic && (
                <span className="text-xs text-gray-400 ml-1">{'(Saving...)'}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
