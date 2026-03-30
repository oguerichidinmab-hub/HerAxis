import React, { useState } from 'react';
import { UserProvider } from './UserContext';
import { BottomNav } from './components/BottomNav';
import { EmergencyButton } from './components/EmergencyButton';
import { HomeScreen } from './components/HomeScreen';
import { PregnancyScreen } from './components/PregnancyScreen';
import { BabyScreen } from './components/BabyScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { SupportScreen } from './components/SupportScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'pregnancy': return <PregnancyScreen />;
      case 'baby': return <BabyScreen />;
      case 'community': return <CommunityScreen />;
      case 'support': return <SupportScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <UserProvider>
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

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </UserProvider>
  );
}
