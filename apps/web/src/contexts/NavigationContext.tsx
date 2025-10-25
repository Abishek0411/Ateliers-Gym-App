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
  setPageLoaded: () => void; // New method to signal page has loaded
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Optimized safety mechanism: Smart timeout based on navigation type
  useEffect(() => {
    if (isLoading) {
      const safetyTimeout = setTimeout(() => {
        console.warn('Navigation loading state stuck, auto-resetting');
        setIsLoading(false);
        setTimeoutId(null);
      }, 2000); // Reduced to 2 seconds for faster recovery

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

  const setPageLoaded = () => {
    // Smart loading detection - immediately hide loading when page signals it's ready
    if (isLoading) {
      console.log('Page loaded signal received, hiding loading');
      resetLoading();
    }
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

    // Smart timeout based on page complexity
    const getTimeoutForPath = (path: string) => {
      if (path === '/' || path === '/login') return 600; // Home/login are fast
      if (path === '/community') return 800; // Community needs data fetch
      if (path === '/challenges') return 700; // Challenges need API call
      if (path === '/tracking') return 900; // Tracking needs stats
      return 800; // Default timeout
    };

    const timeoutDuration = getTimeoutForPath(path);

    // Set optimized timeout for each page type
    const newTimeoutId = setTimeout(() => {
      console.log('Navigation timeout reached, resetting loading state');
      setIsLoading(false);
      setTimeoutId(null);
    }, timeoutDuration);

    setTimeoutId(newTimeoutId);
  };

  return (
    <NavigationContext.Provider
      value={{
        isLoading,
        setLoading,
        navigateWithLoading,
        resetLoading,
        setPageLoaded,
      }}
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
