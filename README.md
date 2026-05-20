# C&R Predators

React + Vite + Supabase-version av fiskeloggen. Alla besökare kan läsa fångster, statistik och galleri utan inloggning. Endast Cathlin och Robin ska kunna logga in och skapa, ändra och ta bort catches.

## Stack

- React
- Vite
- Supabase Auth
- Supabase Database
- Supabase Storage

## Projektstruktur

```text
.
├─ public/
├─ src/
│  ├─ components/
│  ├─ context/
│  ├─ hooks/
│  ├─ lib/
│  └─ styles/
├─ supabase/
│  └─ schema.sql
├─ .env.example
├─ index.html
├─ package.json
└─ vite.config.js
```

## Setup

1. Installera beroenden:

```bash
npm install
```

2. Kopiera env-filen:

```bash
cp .env.example .env
```

3. Fyll i:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAILS` i ordningen `Cathlin,Robin`
- `VITE_TEAM_NAME`

Exempel:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
VITE_ADMIN_EMAILS=cathlin@example.com,robin@example.com
VITE_TEAM_NAME=C&R
```

4. Skapa ett Supabase-projekt.

5. Kör SQL i Supabase SQL Editor från `supabase/schema.sql`.

Viktigt:

- Byt ut placeholder-mejlen `cathlin@example.com` och `robin@example.com` i SQL-policierna till de riktiga admin-adresserna innan du kör i produktion.
- Frontend använder bara publishable/anon key.
- Ingen service role key ska läggas i `.env`.

6. Starta lokalt:

```bash
npm run dev
```

## Auth-flöde

- Inloggning sker via Supabase password auth.
- UI:t visar fortfarande `Användarnamn` + `Lösenord`.
- `Cathyyy` mappas till den första e-postadressen i `VITE_ADMIN_EMAILS` (Cathlin).
- `Robin` mappas till den andra e-postadressen i `VITE_ADMIN_EMAILS` (Robin).
- UI visar admin-kontroller bara för sessioner vars e-post finns i `VITE_ADMIN_EMAILS`.
- Den riktiga säkerheten ligger i RLS-policierna i databasen och Storage, inte i frontend.

## Storage

- Bucket: `catch-photos`
- Bilder laddas upp från admin-formuläret
- `photo_url` sparas i tabellen `catches`
- Public read är aktiverad på bucket-objekten via policy

## RLS-sammanfattning

### `public.catches`

- Public `SELECT`
- Endast allowlistade authenticated users får `INSERT`
- Endast allowlistade authenticated users får `UPDATE`
- Endast allowlistade authenticated users får `DELETE`

### `storage.objects` för `catch-photos`

- Public `SELECT`
- Endast allowlistade authenticated users får `INSERT`
- Endast allowlistade authenticated users får `UPDATE`
- Endast allowlistade authenticated users får `DELETE`

## Dev fallback

- Om Supabase inte är konfigurerat i utvecklingsläge visar appen demo-data i read-only-läge.
- Demo/fallback används inte som primär datakälla i produktion.
- Utan Supabase-konfiguration finns ingen admin-inloggning och inga write-actions.

## Public beteende

- läsa catches
- se statistik
- se galleri
- se publika bilder från Storage

## Admin beteende

- logga in med användarnamn + lösenord
- skapa catch
- ladda upp bild
- ändra catch
- ta bort catch

## Bygg

```bash
npm run build
```

## Nästa naturliga steg

- lägga till Supabase migrations i versionsstyrd form
- lägga till bättre felhantering kring Storage-delete vid edit/delete
- lägga till optimerad bildhantering och ev. transformering
