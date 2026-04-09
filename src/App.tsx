import React, { useState, useEffect } from 'react';
import { useUser, UserProvider } from './UserContext';
import { LoginScreen } from './components/LoginScreen';
import { BottomNav } from './components/BottomNav';
import { EmergencyButton } from './components/EmergencyButton';
import { HomeScreen } from './components/HomeScreen';
import { BabyTrackerScreen } from './components/BabyTrackerScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { SupportScreen } from './components/SupportScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SplashScreen } from './components/SplashScreen';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState<string[]>(['home']);
  const [showSplash, setShowSplash] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="max-w-md mx-auto relative min-h-screen pb-20">
      <EmergencyButton />
      
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={changeTab} />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
