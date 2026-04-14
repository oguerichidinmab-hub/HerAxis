import React from 'react';
import { Home, Heart, Baby, Users, LifeBuoy, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tracker', label: 'Tracker', icon: Baby },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-2 py-2 z-40 transition-colors sm:border-x sm:border-stone-100 dark:sm:border-stone-800">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? 'text-pink-600 dark:text-pink-400' : 'text-stone-400 dark:text-stone-500'
              }`}
            >
              <Icon size={24} className={isActive ? 'scale-110 transition-transform' : ''} />
              <span className="text-[10px] mt-1 font-bold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
