import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserStage, Appointment, JournalEntry } from './types';
import { auth, db, logoutUser } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, orderBy, deleteDoc, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestoreErrorHandler';

interface UserContextType {
  user: User | null;
  loading: boolean;
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
    voiceGuidance: false,
    fruitTheme: 'standard',
    googleSyncEnabled: false,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(DEFAULT_PROFILE);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Profile & Data Sync
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // 1. Sync Profile
    const profileRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(prev => ({ ...prev, ...data }));
      } else {
        // Initialize profile if it doesn't exist
        const initialProfile = { ...DEFAULT_PROFILE, name: user.displayName || 'Mama' };
        setDoc(profileRef, initialProfile).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${user.uid}`));

    // 2. Sync Appointments
    const apptsRef = collection(db, 'users', user.uid, 'appointments');
    const qAppts = query(apptsRef, orderBy('date', 'desc'));
    const unsubAppts = onSnapshot(qAppts, (snap) => {
      const appts = snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
      setProfile(prev => ({ ...prev, appointments: appts }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/appointments`));

    // 3. Sync Journal Entries
    const journalRef = collection(db, 'users', user.uid, 'journal_entries');
    const qJournal = query(journalRef, orderBy('date', 'desc'));
    const unsubJournal = onSnapshot(qJournal, (snap) => {
      const entries = snap.docs.map(d => ({ id: d.id, ...d.data() } as JournalEntry));
      setProfile(prev => ({ ...prev, journalEntries: entries }));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/journal_entries`));

    return () => {
      unsubProfile();
      unsubAppts();
      unsubJournal();
    };
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      setProfile(prev => ({ ...prev, ...updates }));
      return;
    }
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'reminded'>) => {
    const id = Date.now().toString();
    const newAppointment: Appointment = {
      ...appointment,
      id,
      reminded: false,
    };
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'appointments', id), newAppointment);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/appointments/${id}`);
      }
    } else {
      setProfile(prev => ({
        ...prev,
        appointments: [...(prev.appointments || []), newAppointment],
      }));
    }

    if (newAppointment.syncToNative) {
      // Keep existing sync logic
      try {
        const response = await fetch('/api/calendar/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointment: newAppointment }),
        });
        if (response.ok) {
          const { eventId } = await response.json();
          updateAppointment(id, { googleEventId: eventId });
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

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'appointments', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/appointments/${id}`);
      }
    } else {
      setProfile(prev => ({
        ...prev,
        appointments: (prev.appointments || []).filter(a => a.id !== id),
      }));
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    const currentAppt = (profile.appointments || []).find(a => a.id === id);
    const updatedAppt = currentAppt ? { ...currentAppt, ...updates } : null;

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'appointments', id), updates);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/appointments/${id}`);
      }
    } else {
      setProfile(prev => ({
        ...prev,
        appointments: (prev.appointments || []).map(a => 
          a.id === id ? { ...a, ...updates } : a
        ),
      }));
    }

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
            updateAppointment(id, { googleEventId: eventId });
          }
        }
      } catch (error) {
        console.error("Failed to sync updated appointment:", error);
      }
    }
  };

  const togglePreference = (key: keyof UserProfile['preferences']) => {
    const newPrefs = {
      ...profile.preferences,
      [key]: !profile.preferences[key],
    };
    updateProfile({ preferences: newPrefs });
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    const id = Date.now().toString();
    const newEntry: JournalEntry = {
      ...entry,
      id,
    };
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'journal_entries', id), newEntry);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/journal_entries/${id}`);
      }
    } else {
      setProfile(prev => ({
        ...prev,
        journalEntries: [newEntry, ...(prev.journalEntries || [])],
      }));
    }
  };

  const removeJournalEntry = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'journal_entries', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/journal_entries/${id}`);
      }
    } else {
      setProfile(prev => ({
        ...prev,
        journalEntries: (prev.journalEntries || []).filter(e => e.id !== id),
      }));
    }
  };

  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'journal_entries', id), updates);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/journal_entries/${id}`);
      }
    } else {
      setProfile(prev => ({
        ...prev,
        journalEntries: (prev.journalEntries || []).map(e => 
          e.id === id ? { ...e, ...updates } : e
        ),
      }));
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setProfile(DEFAULT_PROFILE);
      localStorage.removeItem('heraxis_profile');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user,
      loading,
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
