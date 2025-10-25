'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  navigateWithLoading: (path: string, router: any) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const navigateWithLoading = (path: string, router: any) => {
    setIsLoading(true);
    router.push(path);

    // Set a longer timeout to ensure data loading completes
    // This provides a smooth experience while data loads
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <NavigationContext.Provider
      value={{ isLoading, setLoading, navigateWithLoading }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
