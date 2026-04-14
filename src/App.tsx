import React, { useState, useEffect } from 'react';
import { useUser, UserProvider } from './UserContext';
import { LoginScreen } from './components/LoginScreen';
import { BottomNav } from './components/BottomNav';
import { EmergencyButton } from './components/EmergencyButton';
import { AccessibilityButton } from './components/AccessibilityButton';
import { HomeScreen } from './components/HomeScreen';
import { BabyTrackerScreen } from './components/BabyTrackerScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { SupportScreen } from './components/SupportScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SplashScreen } from './components/SplashScreen';
import { motion, AnimatePresence } from 'motion/react';

import { ThemeProvider, useTheme } from './ThemeContext';
import { LoadingSpinner } from './components/LoadingSpinner';

function AppContent() {
  const { user, loading, profile } = useUser();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState<string[]>(['home']);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (profile?.preferences?.largeText) {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.remove('text-lg');
    }
  }, [profile?.preferences?.largeText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const changeTab = (tab: string) => {
    if (tab === activeTab) return;
    setHistory(prev => [...prev, tab]);
    setActiveTab(tab);
  };

  const goBack = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // Remove current tab
    const previousTab = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    setActiveTab(previousTab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'tracker': return <BabyTrackerScreen onBack={goBack} />;
      case 'community': return <CommunityScreen onBack={goBack} />;
      case 'support': return <SupportScreen onBack={goBack} />;
      case 'profile': return <ProfileScreen onBack={goBack} />;
      default: return <HomeScreen />;
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 transition-colors">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors">
      <div className="max-w-md mx-auto relative min-h-screen pb-20 bg-white dark:bg-stone-900 shadow-2xl shadow-stone-200 dark:shadow-none sm:border-x sm:border-stone-100 dark:sm:border-stone-800">
        <div className="fixed top-4 w-full max-w-md left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 flex justify-between">
          <AccessibilityButton />
          <EmergencyButton />
        </div>
        
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={changeTab} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}
