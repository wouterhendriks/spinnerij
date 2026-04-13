# Plan: Shared data caching met React Context

## Probleem

De `useSpinnerijData` hook fetcht `data.json` opnieuw bij elke tab-navigatie. Drie tabs = drie keer dezelfde JSON. Alle data zit bewust in 1 JSON-bestand, dus het hoort maar 1x opgehaald te worden.

## Oplossing

React Context provider die de data eenmalig ophaalt en deelt tussen alle schermen.

## Stappen

### 1. SpinnerijDataProvider aanmaken

**Bestand**: `providers/SpinnerijDataProvider.tsx`

- `createContext` met `{ data, loading, error, refresh }` 
- Provider doet de fetch bij mount (bestaande logica uit `useSpinnerijData`)
- `useSpinnerijData()` hook wordt een thin wrapper die `useContext` aanroept

### 2. Provider wrappen om tab layout

**Bestand**: `app/(tabs)/_layout.tsx`

- Wrap `<Tabs>` in `<SpinnerijDataProvider>`
- Data wordt eenmalig gefetcht wanneer de tab navigator mount

### 3. Hook vereenvoudigen

**Bestand**: `hooks/useSpinnerijData.ts`

- Verander van eigen state + fetch naar `useContext(SpinnerijDataContext)`
- API blijft identiek: `{ data, loading, error, refresh }`
- Schermen hoeven niet aangepast te worden

### 4. Pull-to-refresh

- `refresh()` in de context triggert een nieuwe fetch
- Alle schermen zien meteen de nieuwe data (shared state)

## Niet in scope

- Offline/persistent caching (AsyncStorage) — dat is een apart verhaal
- Stale-while-revalidate — overbodig voor een statisch JSON-bestand
