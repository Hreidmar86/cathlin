# Vildmarken – Resan Hem

Ett barnvänligt survival-lite-spel i React och Canvas. Utforska en illustrerad skog, samla resurser, bygg ditt läger och hitta hem med hjälp av ett räddningsflygplan.

## Spela direkt – utan installation

1. Ladda ned ZIP-filen från grenen **vildmarken-resan-hem** på GitHub.
2. Packa upp ZIP-filen (i Windows: högerklicka → Extrahera alla).
3. Dubbelklicka på **SPELA-VILDMARKEN.html** i den uppackade mappen.

Spelet öppnas i Chrome, Edge eller Firefox. Ingen terminal, Node.js eller internetanslutning behövs för den filen. Öppna filen med en webbläsare om Windows frågar efter ett program. Den vanliga `index.html` är utvecklingsversionens startpunkt och ska köras via Vite.

## Utveckla spelet

Kräver Node.js 22.12+ (miljön använder Node 24).

```bash
npm ci --cache /tmp/cathlin-npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0
```

Spelet körs helt i webbläsaren. Inga API-nycklar, databaser eller externa tjänster behövs. Befintliga Supabase-filer kommer från det tidigare projektet och används inte av spelet.

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

Bygg om den fristående spelfilen efter kodändringar:

```bash
npm run build:standalone
```

## Kontroller

- Flytta med WASD, piltangenter eller genom att klicka/trycka i skogen.
- Gå nära pinnar, stenar eller bär och tryck E, mellanslag eller knappen **Samla / använd**.
- Bygg lägereld, tält, fackla, slangbella och signalmast med byggrecepten.
- Ät bär från ryggsäcken. Vid elden ger de mer energi och lite hälsa.
- Smyg med Shift under natten. Eld och facklor ger trygghet. Slangbellan skrämmer bort närliggande skogsbusar med E.
- Sov i tältet genom byggpanelen när du är nära lägret. Du vaknar med full hälsa och värme.
- Möt väktaren i nordost med slangbellan. Fem träffar lugnar honom. Med en byggd signalmast kan du sedan signalera från bergspasset med E.

En dag/natt-cykel tar tre minuter. Hunger och kyla påverkar hälsan försiktigt. Om hälsan tar slut återvänder du till lägret med alla saker kvar. Resurser återkommer efter 45 sekunder. Paneler pausar spelet; Escape stänger paneler eller pausar.

Framsteg sparas lokalt i webbläsaren. Starta om via Inställningar → Börja ett nytt äventyr. Sparningen tillhör den aktuella webbläsaren och adressen; den synkas inte mellan enheter.

## Struktur

- `src/App.jsx`: gränssnitt, kontroller och spelregler.
- `src/game.js`: deterministisk spelvärld och Canvas-rendering.
- `src/styles/global.css`: responsiv layout och illustrationens gränssnitt.

Detta är en spelbar prototyp för webbläsare, med förenklad väktarstrid och räddningssekvens. Konsolstöd, handkontroll och flerspelarläge ingår inte.
