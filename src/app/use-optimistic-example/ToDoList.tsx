import {
  useOptimistic,
  useActionState,
  SetStateAction,
  Dispatch,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, todoSchemaType } from '@/app/use-optimistic-example/schema';
import { SubmitButton } from '@/app/components/formcomponents';
import { CheckBoxForm } from '@/app/components/formcomponents';

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type OptimisticTodos = Todo & { optimistic?: boolean };
type TodoAction = { type: 'add'; todo: Todo } | { type: 'toggle'; id: number };

type ToDoListProps = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
};

export const ToDoList = ({ todos = [], setTodos }: ToDoListProps) => {
  const [error, setError] = useState<string | null>(null);

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
    todos,
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

  async function addItemToListAction(prevState: any, data: FormData) {
    const res = await trigger(['text']);
    if (!res) return;

    const newTodoText = data.get('text') as string;
    const optimisticId = Math.random();

    // Add optimistic update
    addOptimisticTodo({
      type: 'add',
      todo: {
        id: optimisticId,
        text: newTodoText,
        completed: false,
      },
    });

    // Reset form after adding optimistic update
    reset();

    try {
      const items = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ todo: { text: newTodoText } }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await items.json();

      // Check if the response contains an error
      if (response.error) {
        throw new Error(response.error);
      }

      setTodos(response.todos);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Error adding todo');

      // Remove the optimistic todo that failed
      setTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo.id !== optimisticId);
      });
    }
  }

  async function toggleItemTodoInListAction(prevState: any, data: FormData) {
    const idRaw = data.get('todoId') as string; // @rename from todoI to

    // Check what is actually received
    const id = Number(idRaw);

    if (isNaN(id) || id === 0) {
      console.error('Invalid ID received for toggling:', idRaw);
      return;
    }

    addOptimisticTodo({
      type: 'toggle',
      id,
    });
    try {
      const items = await fetch('/api/todos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const response = await items.json();

      if (response.error) {
        throw new Error(response.error);
      }

      setTodos(response.todos); // Ensure you replace todos with the latest data
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Error toggling todo');
      const originalTodos = [...optimisticTodos];
      console.log('originalTodos are ');
      console.log(originalTodos);
      setTodos(originalTodos);
      // addOptimisticTodo({
      //   type: 'toggle',
      //   id, // Toggle it back to its original state
      // });
    }
  }

  const [, moddedAction, pendingState] = useActionState(addItemToListAction, null);
  const [, moddedToggle, pendingToggle] = useActionState(toggleItemTodoInListAction, null);

  const isProcessing = optimisticTodos?.some((todo) => todo?.optimistic);

  const isLoading = todos.length < 1 && !optimisticTodos.some((todo) => todo.optimistic);

  useEffect(() => {
    if (error && (pendingState || pendingToggle)) {
      setError(null);
    }
  }, [pendingState, pendingToggle, error]);

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
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <ul className="space-y-2">
          {optimisticTodos.map((todo, index) => (
            <li
              key={todo.id}
              className={`flex items-center p-3 border rounded-md transition-all ${
                todo.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <CheckBoxForm
                disabled={isProcessing}
                completed={todo.completed}
                formAction={moddedToggle}
                key={todo.id}
                value={todo.id}
              />

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
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </>
  );
};
