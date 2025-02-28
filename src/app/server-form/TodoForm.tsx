'use client';
import { useActionState } from 'react';

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type ToDoListProps = {
  action: any;
};

const initialState = {
  success: false,
  message: '',
  errors: [],
  inputs: {
    todo: '',
  },
};

export const ToDoForm = ({ action }: ToDoListProps) => {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <>
      <form action={formAction} className="mb-6">
        <div className="flex gap-2 w-full flex-col">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              name="todo"
              placeholder="Add a new todo"
              autoComplete="fullName"
              defaultValue={state?.inputs?.todo}
              className="flex-1 text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
          {state?.errors && !isPending && (
            <span className="text-red-500 text-sm">{state.errors}</span>
          )}
        </div>
      </form>
    </>
  );
};
