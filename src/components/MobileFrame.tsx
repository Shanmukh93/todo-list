import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFrame: () => void;
  onOpenCode: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isFramed,
  onToggleFrame,
  onOpenCode,
}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 select-none font-sans">
      {/* Top Utility Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 px-3 mb-3 bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-200">React Native Preview</span>
          <span className="hidden sm:inline text-slate-400">| Powered by React Native Components</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="view-rn-code-btn"
            type="button"
            onClick={onOpenCode}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <span>Expo / RN Code</span>
          </button>

          <button
            id="toggle-device-frame-btn"
            type="button"
            onClick={onToggleFrame}
            className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isFramed ? 'Switch to Full Width View' : 'Switch to Mobile Phone Bezel'}
          >
            {isFramed ? <Monitor size={15} /> : <Smartphone size={15} />}
            <span className="hidden sm:inline">{isFramed ? 'Full View' : 'Phone Frame'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex justify-center items-start pb-6">
        {isFramed ? (
          <div className="relative w-full max-w-[400px] h-[820px] max-h-[92vh] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 shadow-blue-950/40 flex flex-col">
            {/* Outer Bezel Border Highlight */}
            <div className="absolute inset-0 rounded-[48px] pointer-events-none ring-1 ring-white/10" />

            {/* Hardware Buttons Simulated */}
            <div className="absolute -left-[5px] top-28 w-[3px] h-10 bg-slate-700 rounded-l-sm" />
            <div className="absolute -left-[5px] top-42 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
            <div className="absolute -left-[5px] top-58 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
            <div className="absolute -right-[5px] top-36 w-[3px] h-16 bg-slate-700 rounded-r-sm" />

            {/* Inner Phone Screen */}
            <div className="relative w-full h-full bg-slate-50 text-slate-900 rounded-[38px] overflow-hidden flex flex-col shadow-inner">
              {/* Dynamic Island / Status Bar */}
              <div className="h-11 bg-slate-50 px-6 flex items-center justify-between shrink-0 select-none z-30">
                <span className="text-xs font-semibold text-slate-800 tracking-tight">
                  {currentTime || '09:41'}
                </span>

                {/* Island notch */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-950/90 border border-slate-700/50" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                </div>

                <div className="flex items-center gap-1.5 text-slate-700">
                  <Wifi size={13} strokeWidth={2.5} />
                  <BatteryMedium size={15} strokeWidth={2.5} />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto flex flex-col relative bg-slate-50">
                {children}
              </div>

              {/* Home Indicator Bar */}
              <div className="h-6 bg-slate-50 flex items-center justify-center shrink-0">
                <div className="w-32 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl bg-slate-50 text-slate-900 rounded-2xl shadow-xl overflow-hidden min-h-[750px] flex flex-col border border-slate-200">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
