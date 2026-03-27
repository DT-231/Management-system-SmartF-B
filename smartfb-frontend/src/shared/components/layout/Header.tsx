import { type FC } from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: FC<HeaderProps> = ({ title }) => {
  // Mock user name - will get from auth store later
  const userName = 'Orlando';

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Greeting */}
        <p className="text-sm font-medium text-slate-600">
          Xin chào, {userName}! 👋
        </p>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-150">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
};
