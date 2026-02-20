# Nawigacja po przewodniku wspinaczkowym — Projekt UX

## Hierarchia danych

```
Region (np. "Jura Krakowsko-Częstochowska")
  └─ Sektor (np. "Słoń")
       └─ Topo / Zdjęcie ściany (np. "Ściana południowa")
            └─ Drogi wspinaczkowe (wrysowane na zdjęciu)
```

---

## Przegląd flow

```
[1. Region Picker]  →  [2. Sektor Grid]  →  [3. Topo View (obecny ekran)]
     modal/sheet          nowy ekran             istniejący ekran
```

Użytkownik otwiera aplikację → widzi listę regionów → wybiera region → widzi siatkę sektorów z miniaturkami → wybiera sektor/zdjęcie → ląduje na TopoView.

---

## Ekran 1 — Region Picker (Bottom Sheet / Full-screen modal)

### Cel

Szybki wybór regionu. Większość wspinających jeździ do 2-3 regionów, więc ostatnio używane muszą być na wierzchu.

### Layout

```
┌──────────────────────────────────────┐
│  ╌╌╌╌╌  (handle)                     │
│                                      │
│  🔍 [ Szukaj regionu lub sektora… ] │  ← Unified search
│                                      │
│  OSTATNIO ODWIEDZANE                 │
│  ┌──────────┐  ┌──────────┐         │
│  │ 🏔 Jura  │  │ 🏔 Tatry │         │
│  │ 12 sekt. │  │  8 sekt. │         │
│  └──────────┘  └──────────┘         │
│                                      │
│  WSZYSTKIE REGIONY                   │
│  ┌─────────────────────────────────┐ │
│  │ 🏔  Jura Krakowsko-Częst.   >  │ │
│  │     42 sektory · 580 dróg      │ │
│  ├─────────────────────────────────┤ │
│  │ 🏔  Tatry                   >  │ │
│  │     18 sektorów · 290 dróg     │ │
│  ├─────────────────────────────────┤ │
│  │ 🏔  Sokoliki                >  │ │
│  │     8 sektorów · 120 dróg      │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Kluczowe decyzje

| Element                 | Decyzja                                                         | Dlaczego                                                                                        |
| ----------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Unified search**      | Jedno pole szuka po regionach, sektorach i drogach jednocześnie | Wspinacz często pamięta nazwę sektora, ale nie region — nie zmuszaj go do pamiętania hierarchii |
| **Ostatnio odwiedzane** | Horizontal scroll, max 4 karty                                  | 80% wizyt to powrót do znanego miejsca — 1 tap zamiast 3                                        |
| **Lista regionów**      | Flat list z subtitle (ilość sektorów/dróg)                      | Szybki scan wzrokiem, sortowanie alfabetyczne                                                   |
| **Nawigacja**           | Push na stack (nie modal)                                       | Umożliwia swipe-back i zachowuje kontekst                                                       |

### Interakcje

- **Tap region** → push do Ekranu 2 (Sektor Grid)
- **Tap "Ostatnio odwiedzane" kartę** → push bezpośrednio do Ekranu 2 z wybranym regionem
- **Search** → wyniki grouped: "Regiony", "Sektory", "Drogi". Tap na sektor → skip do Ekranu 2 z rozwiniętym sektorem. Tap na drogę → otwiera Topo View z focusem na drodze.

---

## Ekran 2 — Sektor Grid (z miniaturkami topo)

### Cel

Wizualny wybór konkretnej ściany. Wspinacz rozpoznaje sektory po wyglądzie skały, nie po nazwie — dlatego zdjęcia są kluczowe.

### Layout

```
┌──────────────────────────────────────┐
│  ←  Jura Krakowsko-Częstochowska     │  ← Header z back
│                                      │
│  🔍 [ Szukaj sektora lub drogi… ]   │
│                                      │
│  ┌─────────────┐  ┌─────────────┐   │
│  │             │  │             │   │
│  │  [PHOTO]    │  │  [PHOTO]    │   │
│  │             │  │  [PHOTO]    │   │  ← Jeśli sektor ma
│  │  Słoń       │  │             │   │    wiele zdjęć:
│  │  14 dróg    │  │  Brama      │   │    stack preview
│  │  5a – 7a    │  │  8 dróg     │   │
│  └─────────────┘  └─────────────┘   │
│                                      │
│  ┌─────────────┐  ┌─────────────┐   │
│  │             │  │             │   │
│  │  [PHOTO]    │  │  [PHOTO]    │   │
│  │             │  │             │   │
│  │  Okno       │  │  Filarek    │   │
│  │  6 dróg     │  │  4 drogi    │   │
│  └─────────────┘  └─────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

### Wariant: Sektor z wieloma zdjęciami

Gdy sektor ma >1 zdjęcie topo, karta pokazuje stackowane miniaturki (efekt głębi):

```
  ┌─────────────┐
  │ ┌─────────┐ │
  │ │ [PHOTO] │ │   ← Przesunięte 4px w prawo-dół
  │ └─────────┘ │
  │  Słoń       │
  │  3 zdjęcia  │   ← "3 zdjęcia" zamiast "14 dróg"
  │  14 dróg    │
  └─────────────┘
```

**Tap** → rozwija horizontal pager ze wszystkimi zdjęciami sektora (Ekran 2b).

### Ekran 2b — Topo Picker (Horizontal Pager wewnątrz sektora)

Pojawia się tylko gdy sektor ma >1 zdjęcie.

```
┌──────────────────────────────────────┐
│  ←  Słoń                             │
│                                      │
│      ●  ○  ○                         │  ← Page dots
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │                                 │ │
│  │         [LARGE PHOTO]           │ │  ← Swipeable
│  │      Ściana południowa          │ │
│  │                                 │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                      │
│  Ściana południowa                   │
│  14 dróg · 5a – 7a                  │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  [ Otwórz topo →              ]│ │  ← Primary CTA
│  └─────────────────────────────────┘ │
│                                      │
│  DROGI NA TYM ZDJĘCIU               │
│  1. Prosta droga  ·  5a  ·  ★★★☆☆  │  ← Quick preview
│  2. Rysa          ·  6a  ·  ★★★★☆  │
│  3. Filar         ·  6c  ·  ★★★★★  │
│                                      │
└──────────────────────────────────────┘
```

### Interakcje

- **Tap kartę sektora (1 zdjęcie)** → push bezpośrednio do TopoView
- **Tap kartę sektora (>1 zdjęcie)** → push do Ekran 2b (Topo Picker)
- **Tap "Otwórz topo"** → push do TopoView
- **Tap konkretną drogę** → push do TopoView z auto-focusem na tę drogę
- **Swipe left/right** → przełącza między zdjęciami sektora

---

## Ekran 3 — Topo View (istniejący)

Bez zmian w core. Dodajemy jedynie:

### Breadcrumb w headerze

```
┌──────────────────────────────────────┐
│  ←   Jura > Słoń > Płd.             │  ← Tappable breadcrumb
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │        [TOPO IMAGE]             │ │
│  │     (pinch/pan/zoom)            │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ╌╌╌╌╌╌╌╌╌╌╌ Bottom Sheet ╌╌╌╌╌╌╌╌  │
│  Słoń · Ściana południowa            │
│  [Filter]                            │
│  ┌─────────────────────────────────┐ │
│  │ 1. Prosta droga  5a  ★★★☆☆     │ │
│  │ 2. Rysa          6a  ★★★★☆     │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

- **Tap "Jura"** → pop do Ekran 2 (Sektor Grid)
- **Tap "Słoń"** → pop do Ekran 2b lub 2 (kontekstowo)

---

## Unified Search — Szczegóły

Search jest dostępny na Ekranach 1 i 2. Wyniki grupowane:

```
  🔍 [ "rysa" ]

  DROGI
  ┌─────────────────────────────────┐
  │  Rysa Lewoboczna  ·  6a        │
  │  Słoń, Jura                    │  ← Region + sektor dla kontekstu
  ├─────────────────────────────────┤
  │  Rysa Północna    ·  5c        │
  │  Brama, Jura                   │
  └─────────────────────────────────┘

  SEKTORY
  ┌─────────────────────────────────┐
  │  Rysie Skały  ·  6 dróg        │
  │  Sokoliki                      │
  └─────────────────────────────────┘
```

**Tap na drogę** → otwiera TopoView z focusem na tę drogę.
**Tap na sektor** → otwiera Sektor Grid z tym sektorem.

---

## Nawigacja — Mapa ekranów

```
(tabs)/index.tsx          ← Home (entry point)
   │
   └─ /guidebook          ← Ekran 1: Region Picker
        │
        └─ /guidebook/[regionId]        ← Ekran 2: Sektor Grid
             │
             ├─ /guidebook/[regionId]/[sectorId]   ← Ekran 2b: Topo Picker
             │       │                                 (tylko gdy >1 foto)
             │       └─ /TopoView?topoId=X            ← Ekran 3
             │
             └─ /TopoView?topoId=X                    ← Ekran 3 (direct)
```

### Expo Router structure

```
app/
  (tabs)/
    index.tsx                    ← Home
  guidebook/
    index.tsx                    ← Region Picker
    [regionId]/
      index.tsx                  ← Sektor Grid
      [sectorId].tsx             ← Topo Picker (pager)
  TopoView.tsx                   ← Topo View (istniejący, dodać query params)
```

---

## Typy danych

```typescript
type Region = {
  id: string;
  name: string;
  description?: string;
  sectorCount: number;
  routeCount: number;
  coverImageUrl?: string;
};

type Sector = {
  id: string;
  regionId: string;
  name: string;
  topos: TopoPhoto[];
  routeCount: number;
  gradeRange?: { min: string; max: string };
};

type TopoPhoto = {
  id: string;
  sectorId: string;
  name: string; // np. "Ściana południowa"
  imageSource: ImageSourcePropType;
  svgSource: string; // ścieżka do pliku SVG z drogami
  routeCount: number;
};
```

---

## Mikro-interakcje i detale

### 1. Skeleton loading

Każda miniaturka ładuje się z shimmer placeholder w kształcie karty. Nie blokujemy UI na ładowanie.

### 2. Haptic feedback

- Tap na kartę sektora → `selectionAsync()` (lekki haptic)
- Swipe w pagerze → brak haptic (nie przeszkadzać)

### 3. Animacje przejść

- Region → Sektor Grid: **shared element transition** na cover image sektora (miniaturka → duże zdjęcie)
- Sektor Grid → TopoView: **fade + scale** z pozycji karty

### 4. Recently visited

- Przechowywane w AsyncStorage / MMKV
- Max 4, FIFO
- Wyświetlane jako horizontal scroll na Ekranie 1

### 5. Quick-access shortcut

Na Home (tabs/index) dodajemy sekcję "Kontynuuj" z ostatnio oglądanym topo:

```
┌──────────────────────────────────────┐
│  KONTYNUUJ                           │
│  ┌─────────────────────────────────┐ │
│  │ [TOPO THUMB]  Słoń – Płd.      │ │
│  │               14 dróg           │ │→ 1 tap do TopoView
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

## Podsumowanie — ile tapów do celu?

| Scenariusz                     | Tapów | Flow                          |
| ------------------------------ | ----- | ----------------------------- |
| Wracam do ostatniego topo      | **1** | Home → "Kontynuuj"            |
| Znam region i sektor (1 foto)  | **3** | Home → Region → Sektor        |
| Znam region i sektor (>1 foto) | **4** | Home → Region → Sektor → Topo |
| Pamiętam nazwę drogi           | **2** | Search → Tap drogę            |
| Pamiętam nazwę sektora         | **2** | Search → Tap sektor           |

Najczęstszy case (powrót do znanego miejsca) = **1 tap**.
Najgorszy case (nowy teren, wiele zdjęć) = **4 tappy**.
