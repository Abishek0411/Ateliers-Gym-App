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
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Safety mechanism: Auto-reset loading state if it gets stuck
  useEffect(() => {
    if (isLoading) {
      const safetyTimeout = setTimeout(() => {
        console.warn('Navigation loading state stuck, auto-resetting');
        setIsLoading(false);
        setTimeoutId(null);
      }, 3000); // Reduced to 3 seconds for faster recovery

      setTimeoutId(safetyTimeout);

      return () => {
        clearTimeout(safetyTimeout);
        setTimeoutId(null);
      };
    }
  }, [isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const setLoading = (loading: boolean) => {
    // Clear any existing timeout when manually setting loading state
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsLoading(loading);
  };

  const resetLoading = () => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsLoading(false);
  };

  const navigateWithLoading = (path: string, router: any) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    // Ensure we're not already in a loading state
    if (isLoading) {
      console.warn(
        'Navigation already in progress, ignoring duplicate request'
      );
      return;
    }

    console.log('Starting navigation to:', path);
    setIsLoading(true);

    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
      return;
    }

    // Set a timeout to ensure loading state is reset
    const newTimeoutId = setTimeout(() => {
      console.log('Navigation timeout reached, resetting loading state');
      setIsLoading(false);
      setTimeoutId(null);
    }, 1500); // Increased timeout for better UX

    setTimeoutId(newTimeoutId);
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
