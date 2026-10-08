import React, { createContext, useContext, useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

const OfflineContext = createContext({ isOffline: false });

export function OfflineProvider({ children }) {
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline }}>
      <div id="linkhub-app-root" className={isOffline ? "app-offline" : ""} {...(isOffline ? { inert: "" } : {})}>
        {children}
      </div>
      {isOffline && (
        <div className="offline-blocker fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-xs cursor-not-allowed select-none">
          <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-xl rounded-2xl p-5 max-w-xs text-center">
            <WifiOff className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">You're offline</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please check your internet connection.</p>
          </div>
        </div>
      )}
    </OfflineContext.Provider>
  );
}

export const useOffline = () => useContext(OfflineContext);
