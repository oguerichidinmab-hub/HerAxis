import React, { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';
import { BottomNav } from './components/BottomNav';
import { EmergencyButton } from './components/EmergencyButton';
import { HomeScreen } from './components/HomeScreen';
import { BabyTrackerScreen } from './components/BabyTrackerScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { SupportScreen } from './components/SupportScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SplashScreen } from './components/SplashScreen';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
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

  return (
    <UserProvider>
      <div className="max-w-md mx-auto relative min-h-screen pb-20">
        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" />}
        </AnimatePresence>

        <EmergencyButton />
        
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            {!showSplash && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderScreen()}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {!showSplash && <BottomNav activeTab={activeTab} setActiveTab={changeTab} />}
      </div>
    </UserProvider>
  );
}
