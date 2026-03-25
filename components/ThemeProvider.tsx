'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeId =
  | 'default'
  | 'neon'
  | 'sunset'
  | 'ocean'
  | 'matrix'
  | 'dracula'
  | 'nord'
  | 'solarized'
  | 'monokai'
  | 'rosepine';

type ThemeDefinition = {
  id: ThemeId;
  name: string;
  price: number; // coins
  vars: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    fg: string;
  };
};

const THEMES: ThemeDefinition[] = [
  {
    id: 'default',
    name: 'CodeRift Classic',
    price: 0,
    vars: {
      primary: '#6B8E23',
      secondary: '#0077BE',
      accent: '#FF6B6B',
      bg: '#F5F3F0',
      fg: '#111827',
    },
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    price: 500,
    vars: {
      primary: '#8B5CF6',
      secondary: '#22D3EE',
      accent: '#F472B6',
      bg: '#070A12',
      fg: '#E5E7EB',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Fire',
    price: 600,
    vars: {
      primary: '#F97316',
      secondary: '#FB7185',
      accent: '#FBBF24',
      bg: '#0B0A0A',
      fg: '#F5F5F5',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Wave',
    price: 400,
    vars: {
      primary: '#38BDF8',
      secondary: '#0EA5E9',
      accent: '#34D399',
      bg: '#051018',
      fg: '#E2E8F0',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    price: 750,
    vars: {
      primary: '#22C55E',
      secondary: '#16A34A',
      accent: '#A3E635',
      bg: '#020A05',
      fg: '#DCFCE7',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula Night',
    price: 650,
    vars: {
      primary: '#BD93F9',
      secondary: '#8BE9FD',
      accent: '#FF79C6',
      bg: '#0B0B12',
      fg: '#F8F8F2',
    },
  },
  {
    id: 'nord',
    name: 'Nord Frost',
    price: 550,
    vars: {
      primary: '#88C0D0',
      secondary: '#81A1C1',
      accent: '#A3BE8C',
      bg: '#0B111A',
      fg: '#E5E9F0',
    },
  },
  {
    id: 'solarized',
    name: 'Solarized Dusk',
    price: 600,
    vars: {
      primary: '#268BD2',
      secondary: '#2AA198',
      accent: '#CB4B16',
      bg: '#002B36',
      fg: '#EEE8D5',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai Pro',
    price: 700,
    vars: {
      primary: '#A6E22E',
      secondary: '#66D9EF',
      accent: '#F92672',
      bg: '#0B0C10',
      fg: '#F8F8F2',
    },
  },
  {
    id: 'rosepine',
    name: 'Rosé Pine',
    price: 700,
    vars: {
      primary: '#EBBCBA',
      secondary: '#9CCFD8',
      accent: '#C4A7E7',
      bg: '#0F0D14',
      fg: '#E0DEF4',
    },
  },
];

const STORAGE_THEME = 'cr_theme';
const STORAGE_OWNED = 'cr_theme_owned';
const STORAGE_COINS = 'cr_coins';

type ThemeState = {
  themeId: ThemeId;
  themes: ThemeDefinition[];
  owned: Set<ThemeId>;
  coins: number;
  setTheme: (id: ThemeId) => void;
  buyTheme: (id: ThemeId) => { ok: true } | { ok: false; reason: string };
  addCoins: (amount: number) => void;
};

const ThemeContext = createContext<ThemeState | null>(null);

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function hexToRgbTriplet(hex: string): string | null {
  const raw = hex.trim().replace('#', '');
  if (raw.length !== 6) return null;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return `${r} ${g} ${b}`;
}

function applyThemeToDom(def: ThemeDefinition) {
  const root = document.documentElement;
  root.setAttribute('data-theme', def.id);
  const primary = hexToRgbTriplet(def.vars.primary) ?? '107 142 35';
  const secondary = hexToRgbTriplet(def.vars.secondary) ?? '0 119 190';
  const accent = hexToRgbTriplet(def.vars.accent) ?? '255 107 107';
  const bg = hexToRgbTriplet(def.vars.bg) ?? '245 243 240';
  const fg = hexToRgbTriplet(def.vars.fg) ?? '17 24 39';

  root.style.setProperty('--cr-primary', primary);
  root.style.setProperty('--cr-secondary', secondary);
  root.style.setProperty('--cr-accent', accent);
  root.style.setProperty('--cr-bg', bg);
  root.style.setProperty('--cr-fg', fg);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('default');
  // Dev-friendly default so themes are easily testable.
  const [coins, setCoins] = useState<number>(99999);
  const [owned, setOwned] = useState<Set<ThemeId>>(() => new Set<ThemeId>(['default']));

  // Load persisted state
  useEffect(() => {
    const persistedTheme = (localStorage.getItem(STORAGE_THEME) as ThemeId | null) ?? null;
    const persistedCoins = Number(localStorage.getItem(STORAGE_COINS));
    const persistedOwned = safeParseJSON<ThemeId[]>(localStorage.getItem(STORAGE_OWNED));

    const nextCoins = Number.isFinite(persistedCoins) && persistedCoins >= 0 ? persistedCoins : 99999;
    const nextOwned = new Set<ThemeId>(['default', ...(persistedOwned ?? [])]);
    const nextTheme: ThemeId = persistedTheme && nextOwned.has(persistedTheme) ? persistedTheme : 'default';

    setCoins(nextCoins);
    setOwned(nextOwned);
    setThemeId(nextTheme);
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    const def = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
    applyThemeToDom(def);
    localStorage.setItem(STORAGE_THEME, def.id);
  }, [themeId]);

  // Persist coins/owned
  useEffect(() => {
    localStorage.setItem(STORAGE_COINS, String(coins));
  }, [coins]);
  useEffect(() => {
    localStorage.setItem(STORAGE_OWNED, JSON.stringify(Array.from(owned)));
  }, [owned]);

  const setTheme = useCallback(
    (id: ThemeId) => {
      if (!owned.has(id)) return;
      setThemeId(id);
    },
    [owned]
  );

  const buyTheme = useCallback(
    (id: ThemeId) => {
      const def = THEMES.find((t) => t.id === id);
      if (!def) return { ok: false as const, reason: 'Unknown theme' };
      if (owned.has(id)) return { ok: false as const, reason: 'Already owned' };
      if (def.price <= 0) {
        setOwned((prev) => new Set(prev).add(id));
        return { ok: true as const };
      }
      if (coins < def.price) return { ok: false as const, reason: 'Not enough coins' };

      setCoins((c) => c - def.price);
      setOwned((prev) => new Set(prev).add(id));
      return { ok: true as const };
    },
    [coins, owned]
  );

  const addCoins = useCallback((amount: number) => {
    const delta = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
    if (delta <= 0) return;
    setCoins((c) => c + delta);
  }, []);

  const value = useMemo<ThemeState>(
    () => ({
      themeId,
      themes: THEMES,
      owned,
      coins,
      setTheme,
      buyTheme,
      addCoins,
    }),
    [themeId, owned, coins, setTheme, buyTheme, addCoins]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

