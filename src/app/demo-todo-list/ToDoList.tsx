import { SetStateAction, Dispatch, useEffect, useState } from 'react';

import { SubmitButton } from '@/app/components/formcomponents';

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

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevents the page from reloading

    const formData = new FormData(event.currentTarget);
    const newTodoText = formData.get('text') as string;

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
      setError(null);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Error adding todo');
      setIsLoading(false);
    }
  }

  async function addItemToListAction(data: FormData) {
    // no prevent default
    // access to form
    // access to the form state
    const newTodoText = data.get('text') as string;

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

  useEffect(() => {
    if (error && isLoading) {
      setError(null);
    }
  }, [error]);

  return (
    <>
      {/* <ToDoForm action={addItemToListAction} error={error} /> */}
      <ClassicTodoForm onSubmit={submitForm} error={error} />
      {todos.length < 1 || isLoading ? (
        <LoadingSpinner />
      ) : (
        <ul className="space-y-2">
          {todos.map((todo, index) => (
            <ListItem key={index} id={todo.id} text={todo.text} />
          ))}
        </ul>
      )}
    </>
  );
};

const ClassicTodoForm = ({ error, onSubmit }: { error: any; onSubmit: any }) => {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="flex gap-2 w-full flex-col">
        <div className="flex gap-2 w-full">
          <input
            type="text"
            name="text"
            placeholder="Add a new todo"
            className="flex-1 text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SubmitButton />
        </div>
        {error && <span className="text-red-500 text-sm">{JSON.stringify(error)}</span>}
      </div>
    </form>
  );
};

const ToDoForm = ({ error, action }: { error: any; action: any }) => {
  return (
    <form action={action} className="mb-6">
      <div className="flex gap-2 w-full flex-col">
        <div className="flex gap-2 w-full">
          <input
            type="text"
            name="text"
            placeholder="Add a new todo"
            className="flex-1 text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SubmitButton />
        </div>
        {error && <span className="text-red-500 text-sm">{JSON.stringify(error)}</span>}
      </div>
    </form>
  );
};

const ListItem = ({ id, text }: { id: any; text: string }) => (
  <li key={id} className={`flex items-center p-3 border rounded-md transition-all`}>
    <span className={`flex-1 transition-all  text-black`}>{text}</span>
  </li>
);

const LoadingSpinner = () => (
  <div className="flex justify-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
  </div>
);
