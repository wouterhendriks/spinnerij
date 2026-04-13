# Prompt: Backend tests voor Spinnerij module

## Opdracht

Schrijf backend unit tests voor de Spinnerij module. De module heeft een TypeScript API (`js/api.ts`) met een `SpinnerijApi` class die WRD-data ophaalt. Er zijn al basis tests in `tests/api.unittest.ts` maar die moeten uitgebreid worden.

## Wat te testen

1. **SpinnerijApi** (`js/api.ts`) — alle 5 getters: getRooms, getTenants, getSupplyDemandItems, getReports, getReservations
2. **Publish template** (`webdesigns/spinnerij/scripts/data.ts`) — de `getData()` functie die alle data combineert
3. **Seed script** (`scripts/seed.ts`) — controleer dat het seed script correct data aanmaakt
4. **RepublishDataJson** (`tolliumapps/main.whlib`) — als dat testbaar is vanuit TypeScript

## Referentie voor patronen

Bestudeer de backend tests in `/Users/wouter/whrunkit/myserver/whdata/installedmodules/wvuaw/wvuaw/tests/backend/` voor:
- Test structuur en conventies
- Hoe WRD test schemas worden opgezet (test isolation)
- Hoe entities worden aangemaakt in tests
- Assert patronen
- Gebruik van `@webhare/test` en `@webhare/test-backend`

De bestaande tests in `tests/api.unittest.ts` gebruiken al dit framework — breid die uit of maak nieuwe test files.

## Belangrijk

- Volg TDD: schrijf eerst de test (RED), dan de implementatie als nodig (GREEN)
- Gebruik `wh runtest spinnerij.api` om tests te draaien (staat bovenin het test bestand)
- Gebruik de `webhare-testing` skill voor WebHare test conventies
- Zoek MCP (`webhare-search`) voor test patronen voordat je gaat greppen
