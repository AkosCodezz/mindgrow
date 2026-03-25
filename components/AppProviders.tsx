'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/ThemeProvider';

const EXCLUDED_PREFIXES = ['/', '/auth'];

function shouldExclude(pathname: string) {
  // Exclude landing (/) and all /auth routes from global theming.
  if (pathname === '/') return true;
  return EXCLUDED_PREFIXES.some((p) => p !== '/' && pathname.startsWith(p));
}

function applyDefaultTheme() {
  const root = document.documentElement;
  root.setAttribute('data-theme', 'default');
  root.style.setProperty('--cr-primary', '107 142 35');
  root.style.setProperty('--cr-secondary', '0 119 190');
  root.style.setProperty('--cr-accent', '255 107 107');
  root.style.setProperty('--cr-bg', '245 243 240');
  root.style.setProperty('--cr-fg', '17 24 39');
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const excluded = useMemo(() => shouldExclude(pathname), [pathname]);

  useEffect(() => {
    if (excluded) applyDefaultTheme();
  }, [excluded]);

  if (excluded) return <>{children}</>;
  return <ThemeProvider>{children}</ThemeProvider>;
}

