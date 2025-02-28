import { ItemList } from '@/app/server-form/ItemList';
import { ToDoForm } from '@/app/server-form/TodoForm';
import { addToDo } from '@/app/server-form/actions';
import { Suspense } from 'react';
export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">React Form Using Server Actions</h1>

        <>
          <ToDoForm action={addToDo} />
          <Suspense fallback={<div className="text-black">Loading...</div>}>
            <ItemList />
          </Suspense>
        </>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            This demo showcases a basic to do list made with server actions & progressive
            enhancement
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>This form implements Zod on the server for form validation and error handling</li>
            <li>
              The form is a client component, whereas the todo list and formAction run on the server
            </li>
            <li>The suspense component is used to show the list in loading state</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
