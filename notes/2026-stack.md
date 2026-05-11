# Vurdering av Web-stack 2026: Utover htmx

Når man vurderer alternativer til htmx i 2026, spesielt med tanke på kritikken fra 2024 om manglende TypeScript (TS) i kildekoden og prosjektets "no-build step"-filosofi, finnes det flere sterke kandidater. For prosjekter som benytter moderne monorepo-strukturer (Pnpm, Turborepo, tsup) og krever streng typesikkerhet, er htmx sin monolittiske JavaScript-fil uten typer ofte en flaskehals.

## Moderne Alternativer

### 1. Datastar – Den reaktive hypermedia-utfordreren

Datastar har vokst frem som det mest lovende alternativet for de som ønsker en "myk overgang" fra React.

- **Streaming:** Bruker Server-Sent Events (SSE) som standard, noe som muliggjør ekte sanntidsoppdateringer av DOM-en.
- **Signals:** Introduserer en reaktiv modell (lik Preact/Solid) i HTML-en, slik at klient-staten kan styres direkte fra serveren.
- **Typesikkerhet:** Skrevet i TypeScript og bygget for moderne utviklingsløp.

### 2. Hotwire (Turbo/Stimulus)

Et modent økosystem fra Basecamp som er modulært oppbygd.

- **Turbo Streams:** Gullstandarden for HTML-streaming over HTTP eller WebSockets.
- **TS-først:** Stimulus-kontrollere er designet for TypeScript, noe som gir en strukturert måte å håndtere klientside-logikk i et monorepo.

---

## Teknologivalg: AJAX vs. Modern Streaming

En kritikk mot htmx er bruken av det utdaterte AJAX-begrepet (XHR). I 2026 er `fetch` og `Web Streams` standarden. Mens htmx 4.0 har migrert til `fetch` internt, føles alternativer som Datastar mer "native" for moderne nettlesere fordi de utnytter SSE og streaming-fragmenter som en kjernefunksjon, ikke en utvidelse.

---

## Server-stack: Elysia vs. Hono

For et moderne serveroppsett i et monorepo, står valget ofte mellom Elysia og Hono. Begge fungerer utmerket med JSX/TSX som mal-motor.

| Funksjon          | **Elysia**                                                                    | **Hono**                                                 |
| :---------------- | :---------------------------------------------------------------------------- | :------------------------------------------------------- |
| **Kjøretid**      | Optimalisert for **Bun** (ekstremt rask).                                     | **Universal** (Node, Bun, Deno, Edge/Workers).           |
| **Typesikkerhet** | **Eden Connector**: Gir automatisk end-to-end typing mellom server og klient. | Standard TS, krever mer manuelt oppsett for delt typing. |
| **Validering**    | Innebygd med **TypeBox** (høy ytelse).                                        | Fleksibel, støtter **Zod** via middleware.               |
| **Filosofi**      | Maksimal utnyttelse av moderne API-er og fart.                                | Portabilitet og stabilitet på tvers av alle miljøer.     |

### Konklusjon for prosjektet

Siden arkitekturen baserer seg på **Turborepo** og **tsup**, gir kombinasjonen av **Elysia/Hono** og **Datastar** den mest sømløse utviklingsopplevelsen. Man beholder JSX-syntaksen fra React-verdenen, men flytter logikken til serveren med full typesikkerhet og moderne streaming-kapasitet.
