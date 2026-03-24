<<<<<<< HEAD
# Next.js 14 + Supabase Starter

Futtatható starter template Next.js 14 (App Router), Supabase Auth, és Tailwind CSS alapokon.

## Projekt struktúra

```
├── app/
│   ├── auth/
│   │   ├── login/page.js        → bejelentkezési oldal (kliens)
│   │   ├── register/page.js     → regisztrációs oldal (kliens)
│   │   └── signout/route.js     → kijelentkezési Route Handler
│   ├── globals.css
│   ├── layout.js                → root layout
│   └── page.js                  → főoldal (server, mutatja az auth state-et)
├── lib/
│   └── supabase/
│       ├── client.js            → böngésző oldali kliens (singleton)
│       └── server.js            → szerver oldali kliens (cookie-aware)
├── supabase/
│   └── migrations/
│       └── 001_profiles.sql     → profiles tábla + triggerek + RLS
├── middleware.js                → session token frissítése (kötelező!)
├── .env.local.example
└── package.json
```

## Telepítés

### 1. Függőségek

```bash
npm install
```

### 2. Környezeti változók

```bash
cp .env.local.example .env.local
```

Töltsd ki a `.env.local` fájlt a Supabase Dashboard → Project Settings → API oldalán talált értékekkel.

### 3. Adatbázis séma

Futtasd a `supabase/migrations/001_profiles.sql` tartalmát a Supabase SQL Editorban.

### 4. Fejlesztői szerver indítása

```bash
npm run dev
```

Az alkalmazás elérhető: [http://localhost:3000](http://localhost:3000)

## Hogyan használd a Supabase klienst?

**Kliens komponensben** (`"use client"`):
```js
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = getSupabaseBrowserClient();
const { data } = await supabase.from("profiles").select("*");
```

**Server Componentben / Server Actionben**:
```js
import { getSupabaseServerClient } from "@/lib/supabase/server";

const supabase = getSupabaseServerClient();
const { data: { user } } = await supabase.auth.getUser();
```

## Csomagok

| Csomag | Verzió | Miért? |
|--------|--------|--------|
| `next` | 14.x | App Router, Server Components |
| `@supabase/ssr` | ^0.4 | Cookie-alapú session kezelés SSR-hez |
| `@supabase/supabase-js` | ^2.44 | Supabase JS kliens |
| `tailwindcss` | ^3.4 | Utility-first CSS |
=======
# CodeRift
>>>>>>> 6a22294309555069ba457e77bb7d15adbcfc41f8

