import React from 'react';
import { useUser } from '../UserContext';
import { UserStage } from '../types';
import { Settings, Bell, Shield, Accessibility, LogOut, ChevronRight, Volume2, Type, Layout, Sparkles } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { profile, updateProfile, togglePreference } = useUser();

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-8 px-4 text-center">
        <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center text-pink-600 text-3xl font-bold border-4 border-white shadow-lg">
          {profile.name[0]}
        </div>
        <h1 className="text-2xl font-bold text-stone-900">{profile.name}</h1>
        <p className="text-stone-500 text-sm">
          {profile.stage === UserStage.PREGNANT ? 'Pregnant' : 'New Mom'} • {profile.stageValue} {profile.stage === UserStage.PREGNANT ? 'Weeks' : 'Months'}
        </p>
      </header>

      {/* Quick Actions */}
      <section className="px-4 grid grid-cols-2 gap-3">
        <button 
          onClick={() => updateProfile({ stage: profile.stage === UserStage.PREGNANT ? UserStage.NEW_MOM : UserStage.PREGNANT, stageValue: 1 })}
          className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm text-left"
        >
          <p className="text-xs text-stone-400 mb-1">Switch Stage</p>
          <p className="font-bold text-pink-600 text-sm">Update Journey</p>
        </button>
        <button className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm text-left">
          <p className="text-xs text-stone-400 mb-1">Due Date</p>
          <p className="font-bold text-stone-800 text-sm">Set Date</p>
        </button>
      </section>

      {/* Accessibility Settings */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Accessibility size={20} className="text-pink-500" /> Accessibility
        </h3>
        <div className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-stone-50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Type size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Large Text Mode</p>
                  <p className="text-xs text-stone-400">Easier to read</p>
                </div>
              </div>
              <button
                onClick={() => togglePreference('largeText')}
                className={`w-12 h-6 rounded-full transition-colors relative ${profile.preferences.largeText ? 'bg-pink-600' : 'bg-stone-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.preferences.largeText ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Layout size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Simple UI Mode</p>
                  <p className="text-xs text-stone-400">Minimalist layout</p>
                </div>
              </div>
              <button
                onClick={() => togglePreference('simpleUI')}
                className={`w-12 h-6 rounded-full transition-colors relative ${profile.preferences.simpleUI ? 'bg-pink-600' : 'bg-stone-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.preferences.simpleUI ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Volume2 size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Voice Guidance</p>
                  <p className="text-xs text-stone-400">Audio playback (Mock)</p>
                </div>
              </div>
              <button
                onClick={() => togglePreference('voiceGuidance')}
                className={`w-12 h-6 rounded-full transition-colors relative ${profile.preferences.voiceGuidance ? 'bg-pink-600' : 'bg-stone-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.preferences.voiceGuidance ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Fruit Theme</p>
                  <p className="text-xs text-stone-400">Personalize size visual</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['standard', 'tropical', 'veggies'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateProfile({ 
                      preferences: { ...profile.preferences, fruitTheme: theme as any } 
                    })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                      profile.preferences.fruitTheme === theme 
                        ? 'bg-pink-600 text-white shadow-md' 
                        : 'bg-stone-50 text-stone-500 border border-stone-100'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General Settings */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3">Settings</h3>
        <div className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-stone-50">
            {[
              { label: 'Notifications', icon: Bell },
              { label: 'Privacy & Security', icon: Shield },
              { label: 'General Settings', icon: Settings },
            ].map((item, i) => (
              <button key={i} className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                    <item.icon size={18} />
                  </div>
                  <p className="font-bold text-sm text-stone-700">{item.label}</p>
                </div>
                <ChevronRight size={18} className="text-stone-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <button className="w-full flex items-center justify-center gap-2 text-rose-600 font-bold py-4 rounded-2xl bg-rose-50 hover:bg-rose-100 transition-colors">
          <LogOut size={20} /> Log Out
        </button>
      </section>
    </div>
  );
};
