import { useFormStatus } from 'react-dom';

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:bg-blue-300 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
          Adding...
        </>
      ) : (
        'Add'
      )}
    </button>
  );
};

export const ToggleButton = ({
  handleToggle,
  completed,
  disabled,
}: {
  handleToggle: any;
  completed: boolean;
  disabled: boolean;
}) => {
  const { pending } = useFormStatus();

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || pending}
      className=" mr-3  disabled:cursor-not-allowed"
    >
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

export const CheckBoxToggle = ({ disabled, value }: { value: number; disabled: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <>
      <input type="hidden" name="todoId" value={value} />
      <input
        type="checkbox"
        name="completed"
        disabled={pending || disabled}
        onChange={(e) => {
          e.target.form?.requestSubmit();
        }}
        className="sr-only"
      />
    </>
  );
};

export const CheckBoxForm = ({
  formAction,
  completed,
  disabled,
  value,
}: {
  value: number;
  formAction: any;
  completed: boolean;
  disabled: boolean;
}) => {
  return (
    <form action={formAction} className="mr-3 flex-shrink-0">
      <label className="relative cursor-pointer">
        <CheckBoxToggle value={value} disabled={disabled} />
        <div
          className={`w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center transition-colors ${
            completed ? 'bg-green-500 border-green-500' : 'bg-white'
          }   ${disabled ? 'cursor-not-allowed' : ''}`}
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
      </label>
    </form>
  );
};
