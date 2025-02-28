import Link from 'next/link';
import { Database, FormInput, Zap, CheckSquare } from 'lucide-react';

export default function Home() {
  const routes = [
    {
      name: 'Drizzle Database Example',
      path: '/drizzle-database-example',
      description: 'Example implementation using Drizzle ORM for database operations',
      color: 'from-purple-500 to-indigo-500',
      icon: <Database className="h-12 w-12 mb-4" />,
    },
    {
      name: 'Server Form',
      path: '/server-form',
      description: 'Server-side form handling with Next.js server actions',
      color: 'from-blue-500 to-cyan-500',
      icon: <FormInput className="h-12 w-12 mb-4" />,
    },
    {
      name: 'Optimistic UI Example',
      path: '/use-optimistic-example',
      description: 'Demonstration of useOptimistic hook for better user experience',
      color: 'from-emerald-500 to-green-500',
      icon: <Zap className="h-12 w-12 mb-4" />,
    },
    {
      name: 'Basic Todo List',
      path: '/basic-todo-list',
      description: 'Simple todo application with core functionality',
      color: 'from-orange-500 to-yellow-500',
      icon: <CheckSquare className="h-12 w-12 mb-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Form Demos</span>
            <span className="block text-indigo-600 mt-2">Interactive Demo Collection</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Explore various Next.js features and implementations through these interactive examples.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="group block w-full h-64 relative overflow-hidden rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${route.color} opacity-90 group-hover:opacity-100 transition-opacity`}
              ></div>
              <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-8">
                {route.icon}
                <h2 className="text-2xl font-bold mb-2">{route.name}</h2>
                <p className="text-white text-opacity-80">{route.description}</p>
                <div className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  Explore Example
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-gray-500">
            Built with Next.js, Tailwind CSS, and modern React patterns
          </p>
        </div>
      </main>
    </div>
  );
}
