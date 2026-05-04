# Changesets

## Installasjon og Initialisering

Installer CLI-verktøyet i prosjektrota og initialiser konfigurasjonen:

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

Dette oppretter en .changeset-mappe med en config.json. Du bør sjekke at baseBranch i denne fila stemmer med din hovedgren (f.eks. main).

## Daglig arbeidsflyt

Når du har gjort en endring i en pakke (f.eks. try-catch), kjører du en interaktiv kommando for å beskrive endringen:

```bash
pnpm changeset
```

- Velg pakker: Bruk piltastene og mellomrom for å velge hvilke pakker som er endret.
- Velg bump-type: Velg mellom patch (feilretting), minor (ny funksjonalitet) eller major (breaking changes).
- Skriv melding: Beskrivelsen du skriver her vil havne i CHANGELOG.md

Dette genererer en midlertidig `.md-fil i .changeset/` som du committer sammen med koden din.

# Utløse en release

Når du er klar for å oppdatere versjonene i package.json og generere changelogs, kjører du:

```bash
pnpm changeset version
pnpm install # For å oppdatere pnpm-lock.yaml med de nye versjonene
```

For å publisere alle oppdaterte pakker til npm:

```bash
pnpm publish -r
```

### Tips for automatisering

Mange velger å bruke Changesets GitHub Action. Da skjer følgende automatisk:

- Når en PR med en changeset-fil merges til main, åpner Changesets en ny "Version Packages" PR.
- Denne PR-en inneholder alle versjonshopp og oppdaterte changelogs.
- Når du merger denne PR-en, kan du sette opp at pakkene automatisk publiseres til npm.

For å få fullt utbytte av Changesets i et monorepo, bør du ha en workflow som gjør to ting:

- **Version PR**: Når du merger en funksjon med en changeset-fil, åpner GitHub automatisk en ny PR som oppdaterer alle package.json-filer og changelogs.
- **Publish**: Når denne "Version PR"-en merges, publiseres pakkene automatisk til NPM (eller ditt interne register).

```yaml
name: Release

on:
  push:
    branches:
      - main # Eller 'master' avhengig av hva du bruker

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9 # Eller din spesifikke versjon

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Create Release Pull Request or Publish to NPM
        id: changesets
        uses: changesets/action@v1
        with:
          # Dette kjører 'changeset version' og lager en PR hvis det finnes changesets
          # Hvis ingen changesets finnes, men versjonene er oppdatert, kjører den 'publish'
          publish: pnpm compile && pnpm -r publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Viktige detaljer for at dette skal virke:

- **NPM_TOKEN**: Du må hente en "Automation Token" fra npmjs.com og legge den inn under
  _Settings -> Secrets and variables -> Actions_ i GitHub-repoet ditt med navnet `NPM_TOKEN`.
- **GITHUB_TOKEN**: Denne er innebygd i GitHub Actions og brukes til å lage Pull Requests. Du må kanskje gå til
  _Settings -> Actions -> General_ og sørge for at "Workflow permissions" er satt til "Read and write permissions".
- **Håndtering av versjoner**: Når denne kjører, vil du se en ny PR fra "github-actions" i repoet ditt. Så fort du
  merger den PR-en, vil GitHub Actions trigge på nytt, se at det ikke er flere changesets igjen, og kjøre publish.

## Tips til GitHub Actions (Release):

Siden du nå bruker `noExternal` for å bake inn `core-utils` i andre pakker, husk at dersom du gjør en endring i
`core-utils`, må du også generere en patch changeset for `try-catch`. Hvis ikke vil ikke `try-catch` bli bygget på nytt med
den nye koden fra core-utils og publisert.

## Før din første commit (Checklist)

Før du kjører `git push`, er det lurt å sjekke dette:

- **.gitignore**: Sørg for at den inneholder node_modules, lib, dist, og .turbo (hvis du legger til det senere).
- **Changeset init**: Har du kjørt pnpm changeset init? Du bør se en .changeset/config.json-fil.
- **LICENSE**: Du har MIT i package.json, så sørg for at du har en LICENSE-fil i rota
  (GitHub-lenken din viser at du allerede har en).

## Din første Changeset

Siden du skal gjøre en initiell commit, kan du faktisk legge ved en changeset med en gang:

- Kjør pnpm changeset.
- Velg alle pakkene dine (core-utils, try-catch).
- Velg minor eller patch.
- Skriv "Initial release" som melding.
- Commit .changeset/\*.md-filen sammen med koden.

Når du pusher dette til main, vil GitHub Action-workflowen vi satte opp i sted se changeset-filen og automatisk
opprette en "Version Packages" Pull Request.

## Viktige sjekkpunkter før push:

- **Secrets**: Gå til GitHub-repoet ditt -> _Settings -> Secrets and variables -> Actions_ og legg til `NPM_TOKEN`.
- **Permissions**: Gå til _Settings -> Actions -> General -> Workflow permissions_. Velg **"Read and write permissions"** og
- huk av for **"Allow GitHub Actions to create and approve pull requests"**. Dette er nødvendig for at Changesets skal få
  lov til å åpne den automatiske PR-en.
