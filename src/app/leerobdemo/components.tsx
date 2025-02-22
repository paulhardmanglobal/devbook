import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export const SubmitButton = () => {
  const { data, method, pending } = useFormStatus();

  // gives me access to my form values
  // console.log(data?.get('todo'));
  // console.log(method);

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
    >
      {'Add'}
    </button>
  );
};

export const ToggleButton = ({
  handleToggle,
  completed,
}: {
  handleToggle: any;
  completed: boolean;
}) => {
  const { pending } = useFormStatus();

  return (
    <button onClick={handleToggle} className="mr-3 flex-shrink-0">
      <div
        className={`w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center transition-colors ${
          completed ? 'bg-green-500 border-green-500' : 'bg-white'
        }`}
      >
        {completed && (
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
    </button>
  );
};

export const CheckBoxToggle = ({ completed }: { completed: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <input
      type="checkbox"
      name="completed"
      checked={completed}
      disabled={pending}
      onChange={(e) => {
        e.target.form?.requestSubmit();
      }}
      className="sr-only"
    />
  );
};
