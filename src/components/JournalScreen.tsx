import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { JournalEntry } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ArrowLeft, 
  Calendar, 
  Trash2, 
  Edit3, 
  X, 
  BookOpen
} from 'lucide-react';

interface JournalScreenProps {
  onBack: () => void;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({ onBack }) => {
  const { profile, addJournalEntry, removeJournalEntry, updateJournalEntry } = useUser();
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const moods = ['😊', '🥰', '😴', '🤢', '😢', '😤', '🤔'];
  const commonSymptoms = ['Nausea', 'Fatigue', 'Back Pain', 'Cravings', 'Mood Swings', 'Swelling'];

  const handleSave = () => {
    if (!title || !content) return;

    const entryData = {
      date: new Date().toISOString(),
      title,
      content,
      mood,
      symptoms: selectedSymptoms,
      week: profile.stage === 'PREGNANT' ? profile.stageValue : undefined,
      month: profile.stage === 'NEW_MOM' ? profile.stageValue : undefined,
    };

    if (editingEntry) {
      updateJournalEntry(editingEntry.id, entryData);
    } else {
      addJournalEntry(entryData);
    }

    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setMood('😊');
    setSelectedSymptoms([]);
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || '😊');
    setSelectedSymptoms(entry.symptoms || []);
    setIsAdding(true);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-stone-600" />
          </button>
          <h1 className="text-xl font-semibold text-stone-800">Pregnancy Journal</h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-pink-600 text-white p-2 rounded-full shadow-lg shadow-pink-100"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="p-4 space-y-4">
        {(!profile.journalEntries || profile.journalEntries.length === 0) && !isAdding && (
          <div className="text-center py-20 space-y-4">
            <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-pink-500">
              <BookOpen size={40} />
            </div>
            <h2 className="text-xl font-bold text-stone-800">Start your journey</h2>
            <p className="text-stone-500 max-w-[240px] mx-auto text-sm">
              Capture your thoughts, feelings, and baby's milestones in your private journal.
            </p>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-pink-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-pink-100"
            >
              Write first entry
            </button>
          </div>
        )}

        <div className="space-y-4">
          {profile.journalEntries?.map((entry) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={entry.id}
              className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{entry.mood}</span>
                  <div>
                    <h3 className="font-bold text-stone-800">{entry.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      <Calendar size={10} />
                      {new Date(entry.date).toLocaleDateString(undefined, { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      {entry.week && <span>• Week {entry.week}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(entry)}
                    className="p-2 text-stone-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => removeJournalEntry(entry.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
              {entry.symptoms && entry.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {entry.symptoms.map(s => (
                    <span key={s} className="px-3 py-1 bg-stone-50 text-stone-500 text-[10px] font-bold rounded-full border border-stone-100">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl h-[90vh] sm:h-auto overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-stone-800">
                  {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                </h2>
                <button 
                  onClick={resetForm}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-stone-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block px-1">How are you feeling?</label>
                  <div className="flex justify-between bg-stone-50 p-2 rounded-2xl border border-stone-100 overflow-x-auto scrollbar-hide">
                    {moods.map(m => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`text-2xl p-2 rounded-xl transition-all shrink-0 ${mood === m ? 'bg-white shadow-sm scale-110' : 'opacity-50 hover:opacity-100'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block px-1">Title</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., First kick today!"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-300 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block px-1">Thoughts & Feelings</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your heart out..."
                    rows={6}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-300 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block px-1">Symptoms</label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedSymptoms.includes(s)
                            ? 'bg-pink-600 text-white shadow-md'
                            : 'bg-stone-50 text-stone-500 border border-stone-100 hover:bg-stone-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!title || !content}
                    className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:shadow-none"
                  >
                    {editingEntry ? 'Update Entry' : 'Save Entry'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
