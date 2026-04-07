import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserStage, Appointment, JournalEntry } from './types';

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  togglePreference: (key: keyof UserProfile['preferences']) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'reminded'>) => void;
  removeAppointment: (id: string) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  removeJournalEntry: (id: string) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  logout: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Mama',
  stage: UserStage.PREGNANT,
  stageValue: 12,
  appointments: [],
  journalEntries: [],
  preferences: {
    largeText: false,
    simpleUI: false,
    voiceGuidance: false,
    fruitTheme: 'standard',
    googleSyncEnabled: false,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('heraxis_profile');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    // Ensure arrays exist
    if (!parsed.appointments) parsed.appointments = [];
    if (!parsed.journalEntries) parsed.journalEntries = [];
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem('heraxis_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'reminded'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      reminded: false,
    };
    
    setProfile(prev => ({
      ...prev,
      appointments: [...(prev.appointments || []), newAppointment],
    }));

    if (newAppointment.syncToNative) {
      try {
        const response = await fetch('/api/calendar/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointment: newAppointment }),
        });
        if (response.ok) {
          const { eventId } = await response.json();
          updateAppointment(newAppointment.id, { googleEventId: eventId });
        }
      } catch (error) {
        console.error("Failed to sync new appointment:", error);
      }
    }
  };

  const removeAppointment = async (id: string) => {
    const appt = (profile.appointments || []).find(a => a.id === id);
    if (appt?.googleEventId) {
      try {
        await fetch(`/api/calendar/sync/${appt.googleEventId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error("Failed to delete from Google Calendar:", error);
      }
    }

    setProfile(prev => ({
      ...prev,
      appointments: (prev.appointments || []).filter(a => a.id !== id),
    }));
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    const currentAppt = (profile.appointments || []).find(a => a.id === id);
    const updatedAppt = currentAppt ? { ...currentAppt, ...updates } : null;

    setProfile(prev => ({
      ...prev,
      appointments: (prev.appointments || []).map(a => 
        a.id === id ? { ...a, ...updates } : a
      ),
    }));

    if (updatedAppt && (updatedAppt.syncToNative || currentAppt?.googleEventId)) {
      try {
        const response = await fetch('/api/calendar/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointment: updatedAppt }),
        });
        if (response.ok) {
          const { eventId } = await response.json();
          if (eventId !== updatedAppt.googleEventId) {
            setProfile(prev => ({
              ...prev,
              appointments: (prev.appointments || []).map(a => 
                a.id === id ? { ...a, googleEventId: eventId } : a
              ),
            }));
          }
        }
      } catch (error) {
        console.error("Failed to sync updated appointment:", error);
      }
    }
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

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setProfile(prev => ({
      ...prev,
      journalEntries: [newEntry, ...(prev.journalEntries || [])],
    }));
  };

  const removeJournalEntry = (id: string) => {
    setProfile(prev => ({
      ...prev,
      journalEntries: (prev.journalEntries || []).filter(e => e.id !== id),
    }));
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setProfile(prev => ({
      ...prev,
      journalEntries: (prev.journalEntries || []).map(e => 
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
  };

  const logout = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('heraxis_profile');
  };

  return (
    <UserContext.Provider value={{ 
      profile, 
      updateProfile, 
      togglePreference,
      addAppointment,
      removeAppointment,
      updateAppointment,
      addJournalEntry,
      removeJournalEntry,
      updateJournalEntry,
      logout
    }}>
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
