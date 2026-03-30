import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserStage } from './types';

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  togglePreference: (key: keyof UserProfile['preferences']) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Mama',
  stage: UserStage.PREGNANT,
  stageValue: 12,
  preferences: {
    largeText: false,
    simpleUI: false,
    voiceGuidance: false,
    fruitTheme: 'standard',
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('heraxis_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('heraxis_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const togglePreference = (key: keyof UserProfile['preferences']) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key],
      },
    }));
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, togglePreference }}>
      <div className={`
        ${profile.preferences.largeText ? 'text-lg' : 'text-base'}
        ${profile.preferences.simpleUI ? 'simple-ui' : ''}
        min-h-screen bg-stone-50 text-stone-800 font-sans
      `}>
        {children}
      </div>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
