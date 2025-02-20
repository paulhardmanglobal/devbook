import React from 'react';
import { Mail, Calendar, Trash } from 'lucide-react';

export type User = {
  name: string;
  age: number;
  email: string;
  id: number;
  handleDelete: () => void;
};

export const UserCard = ({ age, email, name, handleDelete }: User) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow relative">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500 transition"
      >
        <Trash size={18} />
      </button>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">{name}</h3>
      <div className="text-sm text-gray-600 space-y-2">
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-400 mr-2" />
          <p>Age: {age}</p>
        </div>
        <div className="flex items-center">
          <Mail size={16} className="text-gray-400 mr-2" />
          <p className="truncate">{email}</p>
        </div>
      </div>
    </div>
  );
};
