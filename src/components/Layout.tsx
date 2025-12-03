import { Outlet, Link } from 'react-router-dom';
import { Video } from 'lucide-react';

export function Layout() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Video className="w-6 h-6" />
          <span>ChatCall POC</span>
        </Link>
        <div className="text-sm text-gray-500">
          Logged in as <span className="font-medium text-gray-900">Jay Senna</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
