# Arbeidsflyt: Fra Feature til Main

Dette dokumentet beskriver standardprosedyren for kodeendringer, versjonering og integrasjon i `olsen-mono`.

## 1. Utvikling på Feature-branch

Alt arbeid starter på en egen branch for å holde `main` stabil.

- **Opprett branch:** `git checkout -b feature/navn-på-endring`
- **Gjør endringer:** Skriv kode i `/packages` eller `/apps`.
- **Verifiser lokalt:**

* `pnpm lint` (Sjekker stil og regler)
* `pnpm test` (Kjører berørte tester via Turbo)
* `pnpm compile` (Sjekker at alt bygger korrekt)

## 2. Opprettelse av Changeset

Før du committer endringene, må du fortelle systemet hvordan dette påvirker versjoneringen.

- **Kjør kommando:** `pnpm changeset`
- **Velg pakke:** Bruk piltastene til å velge pakken(e) du har endret.
- **Velg type:** Bestem om dette er en `patch`, `minor` eller `major` endring.
- **Beskriv:** Skriv en kort oppsummering av endringen for changelogen.
- **Resultat:** En ny `.md`-fil opprettes i mappen `.changeset/`.

## 3. Pull Request (PR)

- **Commit & Push:** Inkluder både koden og den nye `.changeset/*.md`-filen i din commit.
- **Opprett PR:** Lag en Pull Request i GitHub mot `main`-branchen.
- **Automatisert CI:** GitHub Actions vil nå kjøre `pnpm ci` (Lint -> Test -> Compile).

* _Merk:_ Siden du har Turborepo, vil CI-en kun teste det som faktisk er endret.

## 4. Merging til Main

Når PR-en er godkjent og CI-en lyser grønt:

- **Merge PR:** Fullfør mergingen i GitHub-grensesnittet.
- **Sletting av branch:** Feature-branchen kan nå slettes.

## 5. Versjonering (Automatisert Version PR)

Etter merging til `main` vil GitHub Actions oppdage changeset-filen og starte "Version"-flyten:

1.  **Automatisk PR:** GitHub Actions oppretter en ny PR med tittelen **"Version Packages"**.
2.  **Innhold:** Denne PR-en inneholder oppdaterte `package.json`-filer og nye oppføringer i `CHANGELOG.md` for alle berørte pakker.
3.  **Gjennomgang:** Du trenger bare å se over at alt ser riktig ut.
4.  **Merge:** Når du merger denne Version-PR-en:

- Versjonsnumrene oppdateres i `main`.
- Git-tags opprettes automatisk (f.eks. `@olsen-mono/core-utils@0.0.1`).
- _Hvis_ en pakke er offentlig (`private: false`), vil den nå bli publisert til npm via Trusted Publishing.

---

## Tips for en smidig hverdag

- **Ikke kjør `pnpm version-packages` lokalt:** La GitHub Actions håndtere dette via Version-PR-er. Da holder du `main` og changelogs i perfekt synk.
- **Glemte du changeset?** Ingen fare. Du kan legge til en changeset i en eksisterende PR når som helst før merging.
- **Flere endringer i én PR?** Du kan ha flere changeset-filer i samme PR hvis du gjør endringer i flere uavhengige pakker.
