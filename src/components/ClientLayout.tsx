'use client';

import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useServiceWorker();

  return <>{children}</>;
}
