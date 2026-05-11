# Olsen-Mono Workflow Guide

Dette dokumentet beskriver arkitekturen og arbeidsflyten for `olsen-mono`, et monorepo bygget med **pnpm workspaces**, **Turborepo**, **tsup** og **Changesets**.

## 🏗 Arkitektur

- **`/packages`**: Gjenbrukbare biblioteker.
- **`/apps`**: Sluttbrukerapplikasjoner (f.eks. Hono + HTMX).
- **`/packages/tooling`**: Sentralisert konfigurasjon for ESLint, Vitest, tsup, Prettier og Stylelint.
- **Node.js 26**: Benytter native `Temporal` API.

---

## 🚀 1. Førstegangs publisering av en pakke

_Eksempel: `@olsen-mono/core-utils`_

Når en pakke skal gjøres offentlig for første gang:

1.  **Konfigurer `package.json`**:

- Sett `"private": false`.
- Legg til `"publishConfig": { "access": "public" }`.
- Sørg for at `repository`-feltet har korrekt `directory: "packages/core-utils"`.

2.  **Manuell publisering**:
    ```bash
    pnpm login
    cd packages/core-utils
    pnpm publish --access public --provenance
    ```
3.  **Aktiver Trusted Publishing**:

- Gå til pakken på [npmjs.com](https://npmjs.com) -> **Settings** -> **Trusted Publishers**.
- Legg til GitHub Actions: `Owner: olsen-mono`, `Repo: olsen-mono`, `Workflow: release.yml`.

---

## 🔄 2. Oppdatering av offentlig pakke

Automatisert flyt via Changesets og GitHub Actions:

1.  **Utvikle**: Gjør endringer i koden.
2.  **Registrer endring**:
    ```bash
    pnpm changeset
    ```

- Velg pakke og spesifiser endringstype (patch/minor/major).

3.  **Push**: Send endringene og `.changeset/*.md`-filen til GitHub.
4.  **Version PR**: GitHub Actions lager en automatisk PR ("Version Packages").
5.  **Release**: Når PR-en merges til `main`, publiserer GitHub automatisk til npm uten behov for tokens.

---

## 🔐 3. Håndtering av private pakker (intern bruk)

Pakkene dine (f.eks. `try-catch`) kan versjoneres internt uten å eksponeres på npm.

1.  **Konfigurer**: Sørg for at `"private": true` står i `package.json`.
2.  **Versjonering**: Bruk `pnpm changeset` som vanlig.
3.  **Effekt**: Changesets vil oppdatere versjonsnumre og lage changelogs i monorepoet, men GitHub Actions vil hoppe over selve publiseringen til npm. Dette holder interne avhengigheter synkronisert.

---

## 📱 4. Utvikling av applikasjoner (`./apps`)

Apper drar nytte av de lokale pakkene via workspace-referanser.

1.  **Lokal utvikling**:
    ```bash
    pnpm dev
    ```

- Starter Turbo i watch-modus for alle berørte pakker og apper.

2.  **Testing**:
    ```bash
    pnpm turbo test --filter=my-app...
    ```

- Kjører kun tester for appen og dens nødvendige underpakker.

3.  **Bygg for deploy**:
    ```bash
    pnpm turbo build --filter=my-app...
    ```

- Lager en produksjonsklar build av appen inkludert alle interne avhengigheter.

---

## 🛠 Nyttige kommandoer

- `pnpm ci`: Kjører full sjekk (lint, test, build) for hele monorepoet.
- `pnpm fix`: Kjører automatiske reparasjoner for stil og linting i alle mapper.
- `pnpm test-watch`: Starter Vitest i watch-modus med globale aliaser.
