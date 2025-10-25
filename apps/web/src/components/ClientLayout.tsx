'use client';

import { useNavigation } from '@/contexts/NavigationContext';
import NavigationLoader from '@/components/NavigationLoader';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useNavigation();

  return (
    <>
      {children}
      <NavigationLoader isLoading={isLoading} />
    </>
  );
}
