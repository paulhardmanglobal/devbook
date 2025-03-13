import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, todoSchemaType } from '@/app/basic-todo-list/schema';
import { SubmitButton, ToggleButton } from '@/app/components/formcomponents';

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type ToDoListProps = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
};

export const ToDoList = ({ todos = [], setTodos }: ToDoListProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    trigger,
    reset,
    formState: { errors },
  } = useForm<todoSchemaType>({
    resolver: zodResolver(todoSchema),
    defaultValues: { text: '' },
  });

  async function addItemToListAction(data: FormData) {
    const res = await trigger(['text']);
    if (!res) return;

    const newTodoText = data.get('text') as string;

    reset();

    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Error adding todo');
      setIsLoading(false);
    }
  }

  async function handleClickToggle(id: number) {
    if (isNaN(id) || id === 0) {
      console.error('Invalid ID received for toggling:', id);
      return;
    }

    // Set the specific todo as loading

    setIsLoading(true);

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

      setTodos(response.todos);
      setIsLoading(false);
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Error toggling todo');
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (error && isLoading) {
      setError(null);
    }
  }, [error]);

  return (
    <>
      <form action={addItemToListAction} className="mb-6">
        <div className="flex gap-2 w-full flex-col">
          <div className="flex gap-2 w-full">
            <input
              {...register('text')}
              type="text"
              placeholder="Add a new todo"
              className="flex-1 text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <SubmitButton />
          </div>
          {errors.text && <span className="text-red-500 text-sm">{errors.text?.message}</span>}
        </div>
      </form>
      {todos.length < 1 || isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center p-3 border rounded-md transition-all ${
                todo.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <ToggleButton
                completed={todo.completed}
                disabled={false}
                handleToggle={() => handleClickToggle(todo.id)}
              />

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
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </>
  );
};
