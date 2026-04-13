# Plan: JSON data-endpoint integreren in de app

## Context

De app (`app/`) gebruikt nu hardcoded data in `constants/` bestanden. Er is een statisch gepubliceerd JSON-bestand beschikbaar op de WebHare site:

- **Lokaal**: `http://127.0.0.1:8001/spinnerij/data.json`
- **Live**: wordt de URL van de gepubliceerde site + `/data.json`

Dit JSON-bestand bevat alle WRD-data: `rooms`, `tenants`, `supplyDemandItems`, `reports`, `reservations`.

## Huidige situatie

| Scherm | Databron | Constant-bestand |
|--------|----------|-----------------|
| Huurders | Hardcoded (12 items) | `constants/huurders.ts` |
| Vraag & Aanbod | Hardcoded (3 items) | `constants/vraagAanbod.ts` |
| Reserveren | Hardcoded (3 rooms) | `constants/ruimtes.ts` |
| Melding | Alleen formulier, geen data | — |
| Home | Live RSS feed | `hooks/useRssFeed.ts` |

## Stappen

### 1. Data-endpoint configureren

Maak een configuratie aan voor de base URL zodat deze makkelijk te wisselen is tussen dev en productie.

**Bestand**: `constants/api.ts`

```typescript
const API_BASE_URL = "http://127.0.0.1:8001/spinnerij";
// Productie: "https://spinnerij.spinnerijoosterveld.nl" of vergelijkbaar

export const DATA_URL = `${API_BASE_URL}/data.json`;
```

### 2. TypeScript types definiëren

Maak types die matchen met de JSON-structuur. De veldnamen in de JSON zijn lowercase (door HareScript's `EncodeJSON`).

**Bestand**: `constants/types.ts`

```typescript
export interface Room {
  wrdid: number;
  wrdtitle: string;
  subtitle: string;
  capacity: number;
  description: string;
}

export interface Tenant {
  wrdid: number;
  wrdtitle: string;
  description: string;
  category: string;
  room: string;
  website: string;
}

export interface SupplyDemandItem {
  wrdid: number;
  wrdtitle: string;
  type: "vraag" | "aanbod";
  description: string;
  author: string;
  organization: string;
  email: string;
  date: string; // ISO date string
}

export interface Report {
  wrdid: number;
  category: string;
  description: string;
  reportername: string;
  reporteremail: string;
  status: string;
}

export interface Reservation {
  wrdid: number;
  room: number; // wrdId van de room
  date: string; // ISO date string
  requestername: string;
  requesteremail: string;
  description: string;
  status: string;
}

export interface SpinnerijData {
  rooms: Room[];
  tenants: Tenant[];
  supplydemanditems: SupplyDemandItem[];
  reports: Report[];
  reservations: Reservation[];
}
```

**Let op**: alle veldnamen zijn lowercase in de JSON output (bijv. `wrdtitle`, niet `wrdTitle`). Dit komt doordat HareScript's `EncodeJSON` keys lowercaset.

### 3. Data-fetching hook aanmaken

Maak een hook vergelijkbaar met de bestaande `useRssFeed.ts`.

**Bestand**: `hooks/useSpinnerijData.ts`

- Fetch `DATA_URL` bij mount
- Cache in state
- Pull-to-refresh support via `refresh()` functie
- Return: `{ data, loading, error, refresh }`
- Typ return als `SpinnerijData | null`

### 4. Schermen aanpassen

#### Huurders (`app/(tabs)/huurders.tsx`)
- Vervang `import { tenants, categories } from "@/constants/huurders"` door de hook
- Map `data.tenants` naar de bestaande `TenantCard` component
- Categorieën afleiden uit `data.tenants` met `[...new Set(tenants.map(t => t.category))]`
- Logo's: nu via `ui-avatars.com` placeholder — dit blijft voorlopig zo (WRD heeft `logo` image veld maar dat komt nog)
- Skeleton/loading state toevoegen (zoals Home al heeft)

#### Vraag & Aanbod (`app/(tabs)/vraag-aanbod.tsx`)
- Vervang hardcoded items door `data.supplydemanditems`
- `type` veld (`"vraag"` / `"aanbod"`) matcht al met de bestaande filter
- Datum formatteren met `toLocaleDateString("nl-NL")`

#### Reserveren (`app/(tabs)/reserveren.tsx`)
- Vervang hardcoded ruimtes door `data.rooms`
- Images: nu Unsplash placeholders — WRD heeft `image` veld maar dat wordt nog niet meegegeven in de API. Voorlopig placeholders houden of mappen op basis van room naam.

### 5. Oude constants opruimen

Na migratie kunnen deze bestanden weg:
- `constants/huurders.ts`
- `constants/ruimtes.ts`
- `constants/vraagAanbod.ts`

`constants/Colors.ts` blijft — dat is styling, geen data.

### 6. Aandachtspunten

- **Offline/fallback**: De app werkt nu altijd (hardcoded data). Na migratie toont hij een loading state + error bij geen verbinding. Overweeg een fallback/cache strategie.
- **Images**: WRD schema heeft `image` en `logo` velden maar die worden nog niet meegestuurd in de JSON. De `SpinnerijApi` selecteert ze niet. Als images nodig zijn: API uitbreiden + image URLs resolven.
- **Melding-formulier**: Dit scherm stuurt nu via WhatsApp. Geen data nodig uit de JSON, maar zou later een POST endpoint kunnen krijgen.
- **Republish trigger**: Bij elke WRD-wijziging moet het JSON-bestand opnieuw gepubliceerd worden. Dit kan via `<scheduletimedtask>` of handmatig. Nog in te richten.

## Verificatie

1. App starten: `cd app && npx expo start --web`
2. Controleer dat Huurders, Vraag & Aanbod, en Reserveren data tonen uit het JSON-endpoint
3. Pull-to-refresh werkt op alle schermen
4. Error state toont retry-knop bij netwerk-fout
5. Lege states (geen items) tonen een passende melding
