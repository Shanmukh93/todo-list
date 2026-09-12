import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { REACT_NATIVE_CODE } from '../data/reactNativeCode';

interface ReactNativeCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReactNativeCodeModal: React.FC<ReactNativeCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'app' | 'setup'>('app');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(REACT_NATIVE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              RN
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">React Native Implementation</h2>
              <p className="text-xs text-slate-400">Pure React Native + AsyncStorage code for iOS & Android</p>
            </div>
          </div>
          <button
            id="close-rn-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
          <button
            id="tab-app-code-btn"
            type="button"
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'app'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            App.tsx (Source Code)
          </button>
          <button
            id="tab-setup-guide-btn"
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'setup'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Run on Phone (Expo Guide)
          </button>

          <div className="ml-auto">
            {activeTab === 'app' && (
              <button
                id="copy-rn-code-btn"
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied Code!' : 'Copy React Native Code'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs">
          {activeTab === 'app' ? (
            <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <code>{REACT_NATIVE_CODE}</code>
            </pre>
          ) : (
            <div className="space-y-4 font-sans text-sm text-slate-300 p-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                  <Terminal size={16} className="text-blue-400" />
                  Quickstart with Expo in 2 minutes
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  You can immediately run this to-do app on your physical iPhone or Android device using the Expo Go mobile app.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">1. Create a new Expo project:</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-emerald-400">
                      npx create-expo-app TodoApp --template blank-typescript
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1">2. Install AsyncStorage:</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-emerald-400">
                      npx expo install @react-native-async-storage/async-storage
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1">3. Paste the code into App.tsx and run:</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-emerald-400">
                      npx expo start
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/50 text-xs text-blue-200">
                <div className="flex items-center gap-1.5 font-semibold text-blue-300 mb-1">
                  <ExternalLink size={14} />
                  Native Features Included
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 mt-2">
                  <li>Safe Area View and native Status Bar adaptation</li>
                  <li>KeyboardAvoidingView for smooth mobile keyboard presentation</li>
                  <li>Persistent local storage using React Native AsyncStorage</li>
                  <li>Native Alert confirmation on task deletion</li>
                  <li>Fast FlatList rendering for optimal 60fps scrolling performance</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            id="close-rn-modal-footer-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
