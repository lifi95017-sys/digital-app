import React, { useState, useEffect } from 'react';
import { X, Key, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('userGeminiApiKey');
      if (storedKey) setApiKey(storedKey);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('userGeminiApiKey', apiKey.trim());
    } else {
      localStorage.removeItem('userGeminiApiKey');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-emerald-600 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                ការកំណត់ (Settings)
              </h3>
              <button onClick={onClose} className="text-white hover:text-emerald-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Gemini API Key ផ្ទាល់ខ្លួន</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="វាយបញ្ចូល API Key របស់អ្នកនៅទីនេះ..."
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  (ជាជម្រើស) បញ្ចូល API Key ផ្ទាល់ខ្លួនរបស់អ្នកដើម្បីជៀសវាងការអស់កូតាពីប្រព័ន្ធរួម។ ទិន្នន័យនេះរក្សាទុកតែនៅលើកុំព្យូទ័ររបស់អ្នកប៉ុណ្ណោះ។
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> រក្សាទុក
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
