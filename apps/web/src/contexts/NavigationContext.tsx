'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface NavigationContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  navigateWithLoading: (path: string, router: any) => void;
  resetLoading: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  // Safety mechanism: Auto-reset loading state if it gets stuck
  useEffect(() => {
    if (isLoading) {
      const safetyTimeout = setTimeout(() => {
        console.warn('Navigation loading state stuck, auto-resetting');
        setIsLoading(false);
      }, 5000); // 5 second safety timeout

      return () => clearTimeout(safetyTimeout);
    }
  }, [isLoading]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const resetLoading = () => {
    setIsLoading(false);
  };

  const navigateWithLoading = (path: string, router: any) => {
    // Ensure we're not already in a loading state
    if (isLoading) {
      console.warn(
        'Navigation already in progress, ignoring duplicate request'
      );
      return;
    }

    setIsLoading(true);
    router.push(path);

    // Set a longer timeout to ensure data loading completes
    // This provides a smooth experience while data loads
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Store timeout ID for potential cleanup
    return () => clearTimeout(timeoutId);
  };

  return (
    <NavigationContext.Provider
      value={{ isLoading, setLoading, navigateWithLoading, resetLoading }}
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
