import { NavLink } from 'react-router-dom';
import { Home, Search, Bell, User } from 'lucide-react';
import { cn } from '@/src/lib/utils.ts';

export default function BottomNav() {
  const items = [
    { icon: Home, label: '首页', path: '/' },
    { icon: Search, label: '搜索', path: '/search' },
    { icon: Bell, label: '消息', path: '/notifications' },
    { icon: User, label: '我的', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-t border-surface-container-high pb-safe pt-2">
      <div className="flex justify-around items-center px-4 max-w-lg mx-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={(state) =>
              cn(
                "flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all duration-200",
                state.isActive
                  ? "bg-primary-container text-on-primary-container scale-105"
                  : "text-secondary hover:text-primary"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
