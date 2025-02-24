import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, todoSchemaType } from '@/app/optowithzod/schema';
import { SubmitButton } from '@/app/leerobdemo/components';
import { CheckBoxForm } from '@/app/optowithzod/components';

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type ToDoListProps = {
  items: Todo[];
  addItem: any;
  toggleItem: any;
};

export const PaboToDoList = ({ addItem, items, toggleItem }: ToDoListProps) => {
  const {
    register,
    trigger,
    reset,
    formState: { errors },
  } = useForm<todoSchemaType>({
    resolver: zodResolver(todoSchema),
    defaultValues: { text: '' },
  });

  // Add todo action with useActionState
  const [addState, addAction, formPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      console.log(prevState.todos);
      console.log(formData.get('text'));
      const res = await trigger(['text']);
      if (!res) return prevState;

      const text = formData.get('text') as string;
      await addItem(text);

      //   I guess we need to handle the success or failure here?
      reset();
      return {
        todos: [...prevState, { text: formData.get('text'), id: Math.random(), completed: false }],
      };
    },
    {
      todos: items,
    }
  );

  // Toggle todo action with useActionState
  const [toggleState, toggleAction] = useActionState(
    async (prevState: any, id: number) => {
      await toggleItem(id);
      return { ...prevState, toggledId: id };
    },
    { toggledId: null },
    // Optimistic update function
    (prevState: any, id: number) => {
      return { ...prevState, toggledId: id };
    }
  );

  // Create optimistic todos list
  const optimisticTodos = items.map((todo) => {
    const isBeingToggled = toggleState.toggledId === todo.id;
    if (isBeingToggled) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  const isProcessing = addState.pending || toggleState.pending;

  return (
    <>
      <form action={addAction} className="mb-6">
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
              <CheckBoxForm
                disabled={isProcessing}
                completed={todo.completed}
                handleToggle={() => toggleAction(todo.id)}
                key={todo.id}
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
    </>
  );
};
