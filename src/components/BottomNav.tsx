import React from 'react';
import { Home, Heart, Baby, Users, LifeBuoy, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pregnancy', label: 'Pregnancy', icon: Heart },
    { id: 'baby', label: 'Baby', icon: Baby },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 py-2 z-40">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? 'text-pink-600' : 'text-stone-400'
              }`}
            >
              <Icon size={24} className={isActive ? 'scale-110 transition-transform' : ''} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
