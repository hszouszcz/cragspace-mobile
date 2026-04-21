/**
 * Mock data for Jura Północna (Northern Jura) guidebook — id "566".
 *
 * Grades use the Kurtyki system (Polish standard).
 * Coordinates are real GPS positions based on actual Jura climbing areas.
 * Parking spots are shared across sectors within the same valley.
 */
import {
  getGradeBand,
  type GuidebookDetail,
  type Parking,
  type Route,
  type Sector,
} from './types';

const DEMO_IMAGE_ASSET = require('@/assets/topo/dSlonia.jpeg') as number;
const DEMO_SVG_ASSET = require('@/assets/topo/dSlonia_test.svg') as number;

// ── Helpers ───────────────────────────────────────────────────────────────────

let _routeId = 0;
let _sectorId = 0;
let _regionId = 0;
let _parkingId = 0;

function rid(): string {
  return `r${++_routeId}`;
}
function sid(): string {
  return `s${++_sectorId}`;
}
function rgid(): string {
  return `rg${++_regionId}`;
}
function pid(): string {
  return `p${++_parkingId}`;
}

let _wallId = 0;
function wid(): string {
  return `w${++_wallId}`;
}

type RouteInput = [
  name: string,
  grade: Route['grade'],
  style: Route['style'],
  lengthM: number | null,
  bolts: number | null,
];

function makeRoutes(inputs: RouteInput[]): Route[] {
  return inputs.map(([name, grade, style, lengthM, bolts]) => ({
    id: rid(),
    name,
    grade,
    gradeBand: getGradeBand(grade),
    style,
    lengthM,
    bolts,
  }));
}

function makeSector(
  name: string,
  coords: Sector['coords'],
  parking: Parking[],
  approachMinutes: number | null,
  inputs: RouteInput[],
  sunExposure: string | null = null,
): Sector {
  const routes = makeRoutes(inputs);
  const styleSet = new Set(routes.map((r) => r.style));
  return {
    id: sid(),
    name,
    routes,
    routeCount: routes.length,
    styles: [...styleSet],
    coords,
    parking,
    approachMinutes,
    sunExposure,
    walls: [],
  };
}

// ── Shared Parking Spots ──────────────────────────────────────────────────────

// Dolina Kobylańska
const P_KOBYLANSKA_MAIN: Parking = {
  id: pid(),
  label: 'Parking Dolina Kobylańska',
  coords: { lat: 50.2478, lng: 19.7612 },
  directions:
    'Zjazd z drogi Kraków–Olkusz w Nielepicach, parking przy wjeździe do doliny.',
};

const P_KOBYLANSKA_UPPER: Parking = {
  id: pid(),
  label: 'Parking Górna Kobylańska',
  coords: { lat: 50.2501, lng: 19.7634 },
  directions: 'Parking przy leśniczówce, 300 m za głównym parkingiem.',
};

// Dolina Będkowska
const P_BEDKOWSKA_MAIN: Parking = {
  id: pid(),
  label: 'Parking Dolina Będkowska',
  coords: { lat: 50.2195, lng: 19.7943 },
  directions:
    'Parking przy wejściu do doliny, wieś Będkowice. Płatny w sezonie.',
};

// Dolina Bolechowicka
const P_BOLECHOWICKA: Parking = {
  id: pid(),
  label: 'Parking Bolechowice',
  coords: { lat: 50.1987, lng: 19.8321 },
  directions:
    'Parking przy kościele w Bolechowicach, następnie ścieżką przez pola 10 min.',
};

// Dolina Prądnika — OPN
const P_PRADNIKA_OJCOW: Parking = {
  id: pid(),
  label: 'Parking Ojców – wjazd do parku',
  coords: { lat: 50.2143, lng: 19.8267 },
  directions:
    'Płatny parking przy wjeździe do OPN. W sezonie zapełnia się szybko.',
};

const P_PRADNIKA_GRODZISKO: Parking = {
  id: pid(),
  label: 'Parking Grodzisko',
  coords: { lat: 50.2178, lng: 19.8198 },
  directions:
    'Mały darmowy parking przy drodze do Grodziska, 400 m przed klasztorem.',
};

// Okolice Olkusza
const P_OLKUSZ_PAZUREK: Parking = {
  id: pid(),
  label: 'Parking Pazurek / Pomorzany',
  coords: { lat: 50.2834, lng: 19.5712 },
  directions:
    'Parking przy drodze nr 791, zjazd na Pomorzany. Duże miejsce, zawsze wolne.',
};

const P_OLKUSZ_LGOTA: Parking = {
  id: pid(),
  label: 'Parking Lgota Wielka',
  coords: { lat: 50.2756, lng: 19.5489 },
  directions: 'Polna droga za wsią Lgota, parking nieutwardzony przy lesie.',
};

// ── Region 1: Dolina Kobylańska ───────────────────────────────────────────────

const sokolica = makeSector(
  'Sokolica',
  { lat: 50.2491, lng: 19.7643 },
  [P_KOBYLANSKA_MAIN],
  5,
  [
    ['Droga Klasyczna', 'IV', 'trad', 18, null],
    ['Rysa Sokolika', 'VI', 'sport', 20, 8],
    ['Komin Centralny', 'IV+', 'trad', 15, null],
    ['Filar Południowy', 'VI.2+', 'sport', 22, 10],
    ['Zaciek', 'VI.1+', 'sport', 18, 9],
    ['Dach Sokolicy', 'VI.3', 'sport', 12, 7],
    ['Płyta Wschodnia', 'V+', 'sport', 16, 6],
    ['Depresja', 'V', 'trad', 14, null],
    ['Kantem Lewym', 'VI+', 'sport', 19, 8],
    ['Banan', 'VI.1', 'sport', 17, 8],
    ['Żebro Północne', 'V-', 'trad', 20, null],
    ['Przewieszka', 'VI.2', 'sport', 10, 6],
    ['Jaskółczy Lot', 'VI.4', 'sport', 24, 11],
    ['Stara Droga', 'III', 'trad', 18, null],
    ['Diagonalna', 'V+', 'sport', 21, 8],
  ],
);

sokolica.walls = [
  {
    id: wid(),
    name: 'Ściana Główna',
    facing: 'SW',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: sokolica.routes.slice(0, 8),
  },
  {
    id: wid(),
    name: 'Filar Południowy',
    facing: 'S',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: sokolica.routes.slice(8),
  },
  {
    id: wid(),
    name: 'Rysa Wschodnia',
    facing: 'E',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: sokolica.routes.slice(4, 12),
  },
];

const turnia_zamkowa = makeSector(
  'Turnia Zamkowa',
  { lat: 50.248, lng: 19.762 },
  [P_KOBYLANSKA_MAIN],
  8,
  [
    ['Droga po Filarze', 'V', 'trad', 25, null],
    ['Komin Zamkowy', 'IV+', 'trad', 22, null],
    ['Rysa Środkowa', 'VI', 'sport', 20, 9],
    ['Łatwiejsza', 'III', 'trad', 18, null],
    ['Płyta z Trawkami', 'V-', 'sport', 16, 7],
    ['Lewy Filar', 'VI.1', 'sport', 23, 10],
    ['Diedro Centralne', 'VI+', 'trad', 20, null],
    ['Spływ', 'V+', 'sport', 14, 7],
    ['Kant Północny', 'VI.2', 'sport', 18, 9],
    ['Klasyk Zamkowy', 'IV', 'trad', 22, null],
    ['Zacięcie Prawe', 'VI.3+', 'sport', 16, 8],
  ],
);

turnia_zamkowa.walls = [
  {
    id: wid(),
    name: 'Lewa Ściana',
    facing: 'W',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: turnia_zamkowa.routes.slice(
      0,
      Math.ceil(turnia_zamkowa.routes.length / 2),
    ),
  },
  {
    id: wid(),
    name: 'Prawa Ściana',
    facing: 'NW',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: turnia_zamkowa.routes.slice(
      Math.ceil(turnia_zamkowa.routes.length / 2),
    ),
  },
];

const grodzisko_kobyl = makeSector(
  'Skała Grodzisko',
  { lat: 50.2512, lng: 19.765 },
  [P_KOBYLANSKA_UPPER],
  10,
  [
    ['Prawą Stroną', 'V', 'sport', 14, 6],
    ['Lewą Stroną', 'IV+', 'trad', 16, null],
    ['Dach Grodziska', 'VI.2', 'sport', 10, 5],
    ['Przez Zacięcie', 'VI-', 'trad', 12, null],
    ['Mamut', 'VI.3', 'sport', 11, 6],
    ['Rysa Grodziskowa', 'V+', 'trad', 15, null],
    ['Płytka', 'V-', 'sport', 10, 5],
    ['Zawijas', 'VI.1+', 'sport', 13, 7],
  ],
);

const baszta_kobylanska = makeSector(
  'Baszta Kobylańska',
  { lat: 50.2467, lng: 19.7598 },
  [P_KOBYLANSKA_MAIN],
  6,
  [
    ['Filar Baszty', 'VI.1', 'sport', 28, 12],
    ['Komin Wielki', 'IV', 'trad', 25, null],
    ['Przez Rysy', 'V', 'trad', 22, null],
    ['Prawa Ściana', 'VI.2+', 'sport', 20, 10],
    ['Lewa Ściana', 'VI+', 'sport', 19, 9],
    ['Droga Herbertowska', 'V+', 'trad', 28, null],
    ['Przewieszka Basztowa', 'VI.4', 'sport', 15, 8],
    ['Igła', 'VI.3', 'sport', 18, 9],
    ['Kominek', 'IV+', 'trad', 12, null],
    ['Środkiem', 'VI-', 'sport', 16, 8],
    ['Krzesiwo', 'VI.2', 'sport', 22, 10],
    ['Stary Szlak', 'III', 'trad', 25, null],
  ],
);

const okiennik_wielki = makeSector(
  'Okiennik Wielki',
  { lat: 50.2534, lng: 19.7671 },
  [P_KOBYLANSKA_UPPER],
  12,
  [
    ['Przez Okno', 'IV', 'trad', 20, null],
    ['Droga Oknem', 'V', 'sport', 18, 7],
    ['Komin Wielki', 'IV+', 'trad', 22, null],
    ['Filar Lewy', 'VI.1+', 'sport', 25, 10],
    ['Filar Prawy', 'VI.2', 'sport', 25, 11],
    ['Prawa Depresja', 'V-', 'trad', 18, null],
    ['Dach Wielki', 'VI.3+', 'sport', 14, 7],
    ['Pod Oknem', 'V+', 'sport', 16, 7],
    ['Kant', 'VI+', 'sport', 20, 9],
    ['Wiosna', 'VI.1', 'sport', 22, 10],
  ],
);

const okiennik_maly = makeSector(
  'Okiennik Mały',
  { lat: 50.254, lng: 19.768 },
  [P_KOBYLANSKA_UPPER],
  14,
  [
    ['Lewą Rysą', 'V', 'trad', 15, null],
    ['Prawą Rysą', 'V+', 'trad', 15, null],
    ['Przez Małe Okno', 'IV+', 'trad', 12, null],
    ['Diedro', 'VI-', 'sport', 14, 6],
    ['Płyta Gładka', 'VI.1', 'sport', 12, 6],
    ['Zacięcie', 'V-', 'trad', 10, null],
    ['Kant Ostry', 'VI.2+', 'sport', 13, 7],
  ],
);

const skala_kraszewskiego = makeSector(
  'Skała Kraszewskiego',
  { lat: 50.2456, lng: 19.758 },
  [P_KOBYLANSKA_MAIN],
  4,
  [
    ['Droga Kraszewskiego', 'V', 'sport', 16, 7],
    ['Kant Wschodni', 'VI.1', 'sport', 18, 8],
    ['Łatwa Lewo', 'IV', 'trad', 14, null],
    ['Ekspresówka', 'VI.2', 'sport', 15, 7],
    ['Dach', 'VI.3', 'sport', 10, 6],
    ['Klasyczna', 'III', 'trad', 16, null],
    ['Rysa Pionowa', 'V+', 'trad', 14, null],
    ['Nowa Droga', 'VI.1+', 'sport', 17, 8],
  ],
);

const turnia_nad_droga = makeSector(
  'Turnia nad Drogą',
  { lat: 50.2471, lng: 19.7607 },
  [P_KOBYLANSKA_MAIN],
  3,
  [
    ['Nad Drogą', 'V-', 'sport', 12, 6],
    ['Lewo od Centrum', 'VI', 'sport', 14, 7],
    ['Centrum', 'VI+', 'sport', 13, 7],
    ['Prawa Strona', 'VI.1', 'sport', 14, 7],
    ['Gładka Płyta', 'V+', 'sport', 12, 6],
    ['Rysa Lewa', 'IV+', 'trad', 10, null],
  ],
);

// ── Region 2: Dolina Będkowska ────────────────────────────────────────────────

const skala_olszowiecka = makeSector(
  'Skała Olszowiecka',
  { lat: 50.2211, lng: 19.7961 },
  [P_BEDKOWSKA_MAIN],
  8,
  [
    ['Klasyk Olszowiecki', 'V', 'trad', 20, null],
    ['Lewy Filar', 'VI.1', 'sport', 22, 9],
    ['Prawy Filar', 'VI.2', 'sport', 22, 10],
    ['Komin', 'IV', 'trad', 18, null],
    ['Wyciąg Środkowy', 'VI+', 'sport', 20, 9],
    ['Diedro Lewe', 'V+', 'trad', 18, null],
    ['Dach Będkowski', 'VI.3', 'sport', 12, 6],
    ['Płyta', 'V-', 'sport', 16, 7],
    ['Ekspres', 'VI.1+', 'sport', 20, 9],
  ],
  'Sun from 12:00',
);

skala_olszowiecka.walls = [
  {
    id: wid(),
    name: 'Ściana Główna',
    facing: 'W',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: skala_olszowiecka.routes.slice(0, 5),
  },
];

const turnia_w_kurhanie = makeSector(
  'Turnia w Kurhanie',
  { lat: 50.2234, lng: 19.7978 },
  [P_BEDKOWSKA_MAIN],
  12,
  [
    ['Kurhan Klasyk', 'IV+', 'trad', 22, null],
    ['Przez Kurhan', 'V', 'trad', 20, null],
    ['Lewy Kant', 'VI', 'sport', 18, 8],
    ['Prawy Kant', 'VI.1', 'sport', 18, 9],
    ['Środek', 'V+', 'sport', 16, 7],
    ['Rysa Ukośna', 'V-', 'trad', 14, null],
    ['Nowa na Kurhanie', 'VI.2+', 'sport', 17, 8],
    ['Stara Droga', 'III', 'trad', 20, null],
  ],
  'Mostly Shady',
);

const igla_bedkowska = makeSector(
  'Igła Będkowska',
  { lat: 50.2187, lng: 19.7921 },
  [P_BEDKOWSKA_MAIN],
  6,
  [
    ['Igła Klasyczna', 'V', 'trad', 15, null],
    ['Wschodnia Ściana', 'VI.1', 'sport', 14, 7],
    ['Zachodnia Ściana', 'VI.2', 'sport', 14, 8],
    ['Przez Rysy', 'IV+', 'trad', 12, null],
    ['Dach Igły', 'VI.4', 'sport', 8, 5],
    ['Kominek Igły', 'IV', 'trad', 10, null],
    ['Kant Igły', 'VI.3', 'sport', 13, 7],
  ],
  'Full sun',
);

const murowana_scianka = makeSector(
  'Murowana Ścianka',
  { lat: 50.2201, lng: 19.7948 },
  [P_BEDKOWSKA_MAIN],
  5,
  [
    ['Murowana Klasyk', 'V+', 'sport', 16, 7],
    ['Mały Dach', 'VI.2', 'sport', 12, 6],
    ['Rysa Prawa', 'V', 'trad', 14, null],
    ['Rysa Lewa', 'V+', 'trad', 14, null],
    ['Traversem', 'VI.1', 'sport', 18, 8],
    ['Prosto w Górę', 'VI+', 'sport', 15, 7],
    ['Najłatwiejsza', 'IV', 'trad', 14, null],
    ['Bulwar', 'VI.3+', 'sport', 10, 6],
  ],
  'Morning sun',
);

const dolna_scianka_bedkowska = makeSector(
  'Dolna Ścianka Będkowska',
  { lat: 50.2178, lng: 19.7912 },
  [P_BEDKOWSKA_MAIN],
  3,
  [
    ['Dolna Lewa', 'V-', 'sport', 10, 5],
    ['Dolna Prawa', 'V', 'sport', 10, 5],
    ['Środkowa', 'V+', 'sport', 11, 6],
    ['Bulwarowa', 'VI-', 'sport', 10, 5],
    ['Zacięcie', 'IV+', 'trad', 9, null],
  ],
  'Afternoon sun',
);

const skala_jerzmanowskiego = makeSector(
  'Skała Jerzmanowskiego',
  { lat: 50.2258, lng: 19.8001 },
  [P_BEDKOWSKA_MAIN],
  15,
  [
    ['Droga Jerzmanowskiego', 'VI', 'sport', 24, 10],
    ['Komin Jerzmanowskiego', 'IV+', 'trad', 22, null],
    ['Filar', 'VI.2', 'sport', 26, 11],
    ['Lewy Komin', 'IV', 'trad', 20, null],
    ['Dach Wielki', 'VI.4+', 'sport', 14, 7],
    ['Kantem', 'VI.1+', 'sport', 22, 10],
    ['Prosta Droga', 'III', 'trad', 20, null],
    ['Rysa Skośna', 'V+', 'trad', 18, null],
    ['Zacięcie Centralne', 'VI.3', 'sport', 20, 9],
  ],
);

// ── Region 3: Dolina Bolechowicka ─────────────────────────────────────────────

const zebrownia = makeSector(
  'Żebrownia',
  { lat: 50.1998, lng: 19.834 },
  [P_BOLECHOWICKA],
  10,
  [
    ['Żebro Żebrowniane', 'V+', 'sport', 18, 7],
    ['Lewa Ściana', 'VI.1', 'sport', 20, 9],
    ['Prawa Ściana', 'VI.2+', 'sport', 20, 10],
    ['Komin Żebrownyi', 'IV+', 'trad', 18, null],
    ['Klasyk', 'V-', 'trad', 16, null],
    ['Dach', 'VI.3', 'sport', 12, 6],
    ['Lewy Kant', 'VI+', 'sport', 17, 8],
    ['Rysa Pionowa', 'V', 'trad', 16, null],
    ['Nowa Żebrowniana', 'VI.4', 'sport', 16, 8],
  ],
);

zebrownia.walls = [
  {
    id: wid(),
    name: 'Ściana Żebrowni',
    facing: 'S',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: zebrownia.routes.slice(0, 5),
  },
];

const bolechowicka_dolna = makeSector(
  'Ścianka Bolechowicka Dolna',
  { lat: 50.1978, lng: 19.8312 },
  [P_BOLECHOWICKA],
  5,
  [
    ['Dolna Klasyk', 'IV', 'trad', 14, null],
    ['Sport Lewa', 'V+', 'sport', 12, 6],
    ['Sport Prawa', 'VI', 'sport', 13, 6],
    ['Środkowy Komin', 'IV+', 'trad', 12, null],
    ['Gładka', 'VI.1', 'sport', 11, 6],
    ['Travers', 'V-', 'sport', 14, 6],
  ],
);

const bolechowicka_gorna = makeSector(
  'Ścianka Bolechowicka Górna',
  { lat: 50.2012, lng: 19.8352 },
  [P_BOLECHOWICKA],
  18,
  [
    ['Górna Klasyk', 'V', 'trad', 22, null],
    ['Lewy Filar', 'VI.1+', 'sport', 24, 10],
    ['Prawy Filar', 'VI.2', 'sport', 24, 10],
    ['Dach Górny', 'VI.3+', 'sport', 15, 7],
    ['Komin Górny', 'IV', 'trad', 20, null],
    ['Przez Zacięcia', 'V+', 'trad', 20, null],
    ['Ekspres Górny', 'VI.2+', 'sport', 22, 10],
    ['Płyta Górna', 'V-', 'sport', 18, 8],
  ],
);

const skala_piekna = makeSector(
  'Skała Piękna',
  { lat: 50.2023, lng: 19.8367 },
  [P_BOLECHOWICKA],
  20,
  [
    ['Piękna Droga', 'VI', 'sport', 20, 9],
    ['Piękna Lewa', 'VI.2', 'sport', 18, 9],
    ['Piękna Prawa', 'VI.1+', 'sport', 19, 9],
    ['Stary Klasyk', 'V', 'trad', 18, null],
    ['Nowa Piękna', 'VI.4', 'sport', 18, 9],
    ['Komin Piękny', 'V+', 'trad', 16, null],
    ['Kant Piękny', 'VI.3', 'sport', 17, 8],
  ],
);

const okap_bolechowicki = makeSector(
  'Okap Bolechowicki',
  { lat: 50.1965, lng: 19.8298 },
  [P_BOLECHOWICKA],
  8,
  [
    ['Klasyczny Okap', 'VI.2', 'sport', 14, 7],
    ['Lewy Okap', 'VI.3', 'sport', 12, 7],
    ['Prawy Okap', 'VI.4', 'sport', 13, 7],
    ['Okap Centralny', 'VI.3+', 'sport', 12, 6],
    ['Pod Okapem', 'V+', 'sport', 10, 5],
    ['Bulwar', 'VI.1', 'sport', 16, 7],
    ['Wielki Okap', 'VI.5', 'sport', 10, 6],
  ],
);

const skaly_nad_droga_bolechowicka = makeSector(
  'Skały nad Drogą',
  { lat: 50.199, lng: 19.8329 },
  [P_BOLECHOWICKA],
  3,
  [
    ['Przy Drodze', 'V-', 'sport', 10, 5],
    ['Mała Rysa', 'IV+', 'trad', 8, null],
    ['Środek', 'V', 'sport', 10, 5],
    ['Gładka Mała', 'V+', 'sport', 9, 5],
    ['Szybka', 'VI', 'sport', 10, 5],
  ],
);

// ── Region 4: Dolina Prądnika (OPN) ───────────────────────────────────────────

const skaly_panienek = makeSector(
  'Skały Panienek',
  { lat: 50.2165, lng: 19.8298 },
  [P_PRADNIKA_OJCOW],
  10,
  [
    ['Droga Klasyków', 'V', 'trad', 25, null],
    ['Lewa Rysa', 'V+', 'trad', 20, null],
    ['Prawa Rysa', 'VI-', 'trad', 20, null],
    ['Przez Trawki', 'IV+', 'trad', 22, null],
    ['Komin Panieński', 'IV', 'trad', 18, null],
    ['Filar Panieński', 'V+', 'trad', 24, null],
    ['Prosta Droga', 'III', 'trad', 20, null],
    ['Dyagonalna', 'V', 'trad', 18, null],
  ],
);

const maczuga_herkulesa = makeSector(
  'Maczuga Herkulesa',
  { lat: 50.2234, lng: 19.8334 },
  [P_PRADNIKA_GRODZISKO],
  15,
  [
    ['Droga Herkulesa', 'V', 'trad', 30, null],
    ['Komin Zachodni', 'IV', 'trad', 28, null],
    ['Komin Wschodni', 'IV+', 'trad', 28, null],
    ['Filar Zachodni', 'VI+', 'sport', 32, 13],
    ['Filar Wschodni', 'VI.1+', 'sport', 32, 14],
    ['Diedro Wielkie', 'V-', 'trad', 30, null],
    ['Lewy Kant', 'VI.2', 'sport', 28, 12],
    ['Prawy Kant', 'VI.1', 'sport', 28, 11],
    ['Przez Środek', 'V+', 'trad', 30, null],
    ['Prosta', 'IV', 'trad', 32, null],
    ['Klasyk Herkulesa', 'V', 'trad', 30, null],
    ['Dach Herkulesa', 'VI.3+', 'sport', 16, 8],
  ],
);

maczuga_herkulesa.walls = [
  {
    id: wid(),
    name: 'Ściana Zachodnia',
    facing: 'W',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: maczuga_herkulesa.routes.slice(0, 6),
  },
  {
    id: wid(),
    name: 'Ściana Wschodnia',
    facing: 'E',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: maczuga_herkulesa.routes.slice(6),
  },
];

const okap_ojcowski = makeSector(
  'Okap Ojcowski',
  { lat: 50.2143, lng: 19.8276 },
  [P_PRADNIKA_OJCOW],
  5,
  [
    ['Klasyk Okapu', 'VI.2', 'sport', 15, 7],
    ['Wielki Okap', 'VI.3', 'sport', 14, 7],
    ['Lewe Ramię', 'VI.1+', 'sport', 16, 8],
    ['Prawe Ramię', 'VI.2+', 'sport', 16, 8],
    ['Środek Okapu', 'VI.4', 'sport', 12, 6],
    ['Pod Okapem', 'V+', 'sport', 14, 6],
    ['Przez Rysy', 'V', 'trad', 12, null],
    ['Komin Okapu', 'IV+', 'trad', 10, null],
  ],
);

const igla_deofilowa = makeSector(
  'Igła Deofilowa',
  { lat: 50.218, lng: 19.8312 },
  [P_PRADNIKA_GRODZISKO],
  20,
  [
    ['Igła Klasyczna', 'V+', 'trad', 20, null],
    ['Rysa Deofilowa', 'V', 'trad', 18, null],
    ['Filar Igły', 'VI.2', 'sport', 22, 10],
    ['Kant Lewy', 'VI.1', 'sport', 20, 9],
    ['Kant Prawy', 'VI+', 'sport', 19, 8],
    ['Komin Deofilowy', 'IV', 'trad', 16, null],
    ['Przez Okienko', 'IV+', 'trad', 14, null],
  ],
);

const skaly_przy_kaplicy = makeSector(
  'Skały przy Kaplicy',
  { lat: 50.2156, lng: 19.8289 },
  [P_PRADNIKA_OJCOW],
  7,
  [
    ['Kapliczna Klasyk', 'V', 'trad', 18, null],
    ['Lewo od Kaplicy', 'V-', 'trad', 16, null],
    ['Prawo od Kaplicy', 'V+', 'trad', 18, null],
    ['Przez Zacięcie', 'VI-', 'trad', 16, null],
    ['Komin Kaplicowy', 'IV+', 'trad', 14, null],
    ['Mała Rysa', 'IV', 'trad', 12, null],
    ['Gładka', 'V+', 'sport', 14, 6],
    ['Stara Droga', 'IV', 'trad', 18, null],
    ['Nowa Lewa', 'VI.1', 'sport', 16, 8],
  ],
);

const zamkowa_ojcow = makeSector(
  'Turnia Zamkowa Ojców',
  { lat: 50.2201, lng: 19.8321 },
  [P_PRADNIKA_OJCOW],
  12,
  [
    ['Zamkowa Klasyk', 'IV', 'trad', 28, null],
    ['Komin Zamkowy', 'IV+', 'trad', 25, null],
    ['Filar Zamkowy', 'V+', 'trad', 30, null],
    ['Lewa Ściana', 'VI', 'sport', 26, 11],
    ['Prawa Ściana', 'VI.1', 'sport', 26, 12],
    ['Diedro', 'V-', 'trad', 22, null],
    ['Przez Rysy', 'IV+', 'trad', 20, null],
    ['Stara Klasyczna', 'III', 'trad', 25, null],
    ['Ekspres', 'VI.2+', 'sport', 22, 10],
  ],
);

const trojka = makeSector(
  'Trójka',
  { lat: 50.2148, lng: 19.827 },
  [P_PRADNIKA_OJCOW],
  8,
  [
    ['Pierwsza', 'V-', 'trad', 16, null],
    ['Druga', 'V', 'sport', 16, 7],
    ['Trzecia', 'V+', 'sport', 16, 7],
    ['Czwarta', 'VI', 'sport', 15, 7],
    ['Piąta', 'VI+', 'sport', 15, 7],
    ['Szósta', 'VI.1', 'sport', 14, 7],
    ['Siódma', 'VI.2', 'sport', 14, 7],
  ],
);

const grota_lokietka = makeSector(
  'Grota Łokietka',
  { lat: 50.2192, lng: 19.8326 },
  [P_PRADNIKA_GRODZISKO],
  18,
  [
    ['Droga Łokietka', 'V', 'trad', 20, null],
    ['Lewa Ściana Groty', 'VI.1+', 'sport', 22, 10],
    ['Prawa Ściana Groty', 'VI.2', 'sport', 22, 11],
    ['Przez Grotę', 'IV', 'trad', 18, null],
    ['Dach nad Grotą', 'VI.3', 'sport', 12, 6],
    ['Komin Groty', 'IV+', 'trad', 16, null],
    ['Filar Groty', 'VI.1', 'sport', 24, 10],
    ['Rysa Groty', 'V+', 'trad', 18, null],
    ['Lewym Diedrem', 'VI+', 'sport', 20, 9],
    ['Prawym Diedrem', 'VI-', 'trad', 18, null],
  ],
);

// ── Region 5: Okolice Olkusza ─────────────────────────────────────────────────

const pazurek = makeSector(
  'Pazurek',
  { lat: 50.2841, lng: 19.5723 },
  [P_OLKUSZ_PAZUREK],
  8,
  [
    ['Klasyk Pazurka', 'V', 'sport', 16, 7],
    ['Lewy Pazurek', 'VI.1', 'sport', 18, 8],
    ['Prawy Pazurek', 'VI.2', 'sport', 18, 9],
    ['Dach Pazurka', 'VI.3', 'sport', 12, 6],
    ['Komin', 'IV+', 'trad', 14, null],
    ['Filar', 'VI+', 'sport', 16, 8],
    ['Płyta', 'V+', 'sport', 14, 7],
    ['Nowy Pazurek', 'VI.4+', 'sport', 16, 8],
    ['Mały Pazurek', 'V-', 'sport', 10, 5],
  ],
);

pazurek.walls = [
  {
    id: wid(),
    name: 'Ściana Główna',
    facing: 'SE',
    imageAsset: DEMO_IMAGE_ASSET,
    svgAsset: DEMO_SVG_ASSET,
    routes: pazurek.routes.slice(0, 5),
  },
];

const wolbromska = makeSector(
  'Skała Wolbromska',
  { lat: 50.2812, lng: 19.5698 },
  [P_OLKUSZ_PAZUREK],
  5,
  [
    ['Wolbromska Klasyk', 'V+', 'sport', 14, 7],
    ['Lewo', 'VI', 'sport', 15, 7],
    ['Prawo', 'VI.1+', 'sport', 15, 8],
    ['Środek', 'VI.2', 'sport', 14, 7],
    ['Traversem', 'V-', 'sport', 18, 7],
    ['Ekspres', 'VI.3', 'sport', 12, 6],
    ['Komin', 'IV', 'trad', 12, null],
  ],
);

const lgota = makeSector(
  'Lgota Wielka',
  { lat: 50.276, lng: 19.5497 },
  [P_OLKUSZ_LGOTA],
  10,
  [
    ['Lgocianka', 'V', 'sport', 16, 7],
    ['Lewy Filar Lgoty', 'VI.1', 'sport', 18, 8],
    ['Prawy Filar Lgoty', 'VI.2+', 'sport', 18, 9],
    ['Komin Lgocki', 'IV+', 'trad', 14, null],
    ['Dach Lgoty', 'VI.3+', 'sport', 10, 6],
    ['Płyta Lgocka', 'V+', 'sport', 15, 7],
    ['Klasyczna Lgota', 'IV', 'trad', 16, null],
    ['Nowa w Lgocie', 'VI.4', 'sport', 16, 8],
    ['Mała Lgota', 'V-', 'trad', 12, null],
  ],
);

const hucisko = makeSector(
  'Hucisko',
  { lat: 50.2789, lng: 19.5654 },
  [P_OLKUSZ_PAZUREK],
  12,
  [
    ['Hucisko Klasyk', 'VI', 'sport', 16, 7],
    ['Lewe Hucisko', 'VI.2', 'sport', 18, 8],
    ['Prawe Hucisko', 'VI.1+', 'sport', 18, 8],
    ['Komin Huciska', 'IV+', 'trad', 14, null],
    ['Dach', 'VI.3', 'sport', 12, 6],
    ['Kant', 'VI+', 'sport', 15, 7],
    ['Przez Rysy', 'V+', 'trad', 14, null],
    ['Ekspres Hucisko', 'VI.4', 'sport', 14, 7],
  ],
);

const bialy_dol = makeSector(
  'Biały Dół',
  { lat: 50.2867, lng: 19.5741 },
  [P_OLKUSZ_PAZUREK],
  6,
  [
    ['Biały Klasyk', 'V-', 'sport', 12, 6],
    ['Biała Lewa', 'V+', 'sport', 14, 6],
    ['Biała Prawa', 'VI', 'sport', 13, 6],
    ['Diedro Białe', 'V', 'trad', 12, null],
    ['Gładka', 'VI.1', 'sport', 11, 6],
    ['Mała', 'IV+', 'trad', 10, null],
  ],
);

const skaly_w_krzeszowicach = makeSector(
  'Skały w Krzeszowicach',
  { lat: 50.1398, lng: 19.6234 },
  [
    {
      id: pid(),
      label: 'Parking Krzeszowice – centrum',
      coords: { lat: 50.1389, lng: 19.6217 },
      directions:
        'Parking przy rynku w Krzeszowicach, następnie pieszo przez park 15 min.',
    },
  ],
  15,
  [
    ['Krzeszowicki Klasyk', 'V', 'trad', 18, null],
    ['Filar Krzeszowic', 'VI.1+', 'sport', 20, 9],
    ['Komin Krzeszowic', 'IV', 'trad', 16, null],
    ['Lewy Kant', 'VI.2', 'sport', 18, 8],
    ['Prawy Kant', 'VI+', 'sport', 17, 8],
    ['Płyta Krzeszowic', 'V+', 'sport', 16, 7],
    ['Stara Droga', 'III', 'trad', 18, null],
    ['Nowa Krzeszowice', 'VI.3', 'sport', 18, 9],
    ['Dach', 'VI.4', 'sport', 12, 6],
  ],
);

const skaly_czerna = makeSector(
  'Skały Czerneńskie',
  { lat: 50.1512, lng: 19.6345 },
  [
    {
      id: pid(),
      label: 'Parking Czerná – klasztor',
      coords: { lat: 50.1498, lng: 19.6323 },
      directions:
        'Parking przy klasztorze w Czernej, ścieżką przez las 10 min.',
    },
  ],
  10,
  [
    ['Czerneńska Klasyk', 'V+', 'trad', 20, null],
    ['Lewa Czerneńska', 'VI.1', 'sport', 22, 10],
    ['Prawa Czerneńska', 'VI.2+', 'sport', 22, 10],
    ['Komin Czerneński', 'IV+', 'trad', 18, null],
    ['Filar Czerneński', 'VI.3', 'sport', 20, 9],
    ['Dach Czerneński', 'VI.4+', 'sport', 14, 7],
    ['Rysa Czerneńska', 'V', 'trad', 18, null],
    ['Przez Trawki', 'IV', 'trad', 20, null],
  ],
);

// ── Build GuidebookDetail ─────────────────────────────────────────────────────

const regionKobylanska = {
  id: rgid(),
  name: 'Dolina Kobylańska',
  sectors: [
    sokolica,
    turnia_zamkowa,
    grodzisko_kobyl,
    baszta_kobylanska,
    okiennik_wielki,
    okiennik_maly,
    skala_kraszewskiego,
    turnia_nad_droga,
  ],
  sectorCount: 8,
  description:
    'Jedna z najpopularniejszych dolin wspinaczkowych Jury. Wapienne filary i ściany do 35 m, głównie drogi sportowe, liczne klasyki tradycyjne. Dobry dojazd z Krakowa.',
  bounds: {
    nw: { lat: 50.255, lng: 19.756 },
    se: { lat: 50.244, lng: 19.771 },
    center: { lat: 50.2495, lng: 19.7635 },
  },
};

const regionBedkowska = {
  id: rgid(),
  name: 'Dolina Będkowska',
  sectors: [
    skala_olszowiecka,
    turnia_w_kurhanie,
    igla_bedkowska,
    murowana_scianka,
    dolna_scianka_bedkowska,
    skala_jerzmanowskiego,
  ],
  sectorCount: 6,
  description:
    'Spokojna dolina z licznymi ściankami o zróżnicowanej trudności. Mniej zatłoczona niż Kobylańska, idealna na spokojny trening lub wyjazd z dziećmi.',
  bounds: {
    nw: { lat: 50.227, lng: 19.789 },
    se: { lat: 50.217, lng: 19.803 },
    center: { lat: 50.222, lng: 19.796 },
  },
};

const regionBolechowicka = {
  id: rgid(),
  name: 'Dolina Bolechowicka',
  sectors: [
    zebrownia,
    bolechowicka_dolna,
    bolechowicka_gorna,
    skala_piekna,
    okap_bolechowicki,
    skaly_nad_droga_bolechowicka,
  ],
  sectorCount: 6,
  description:
    'Dolina słynąca z przewieszonych dróg sportowych. Popularna wśród zaawansowanych wspinaczy, kilka ścianek dla początkujących nad drogą.',
  bounds: {
    nw: { lat: 50.204, lng: 19.828 },
    se: { lat: 50.196, lng: 19.838 },
    center: { lat: 50.2, lng: 19.833 },
  },
};

const regionPradnika = {
  id: rgid(),
  name: 'Dolina Prądnika (OPN)',
  sectors: [
    skaly_panienek,
    maczuga_herkulesa,
    okap_ojcowski,
    igla_deofilowa,
    skaly_przy_kaplicy,
    zamkowa_ojcow,
    trojka,
    grota_lokietka,
  ],
  sectorCount: 8,
  description:
    'Serce Ojcowskiego Parku Narodowego. Wyjątkowe formacje skalne, klasyki tradycyjne i kilka dróg sportowych. Część sektorów ma ograniczenia sezonowe z uwagi na lęgi sokołów.',
  bounds: {
    nw: { lat: 50.226, lng: 19.826 },
    se: { lat: 50.212, lng: 19.834 },
    center: { lat: 50.219, lng: 19.83 },
  },
};

const regionOlkusza = {
  id: rgid(),
  name: 'Okolice Olkusza',
  sectors: [
    pazurek,
    wolbromska,
    lgota,
    hucisko,
    bialy_dol,
    skaly_w_krzeszowicach,
    skaly_czerna,
  ],
  sectorCount: 7,
  description:
    'Rozległe tereny wspinaczkowe na zachód od Olkusza. Przeważa wspinaczka sportowa, skały niższe niż w środkowej Jurze, ale oferują wiele możliwości.',
  bounds: {
    nw: { lat: 50.29, lng: 19.542 },
    se: { lat: 50.138, lng: 19.638 },
    center: { lat: 50.214, lng: 19.59 },
  },
};

function computeTotals(regions: (typeof regionKobylanska)[]) {
  let totalRoutes = 0;
  let totalSectors = 0;
  for (const region of regions) {
    totalSectors += region.sectorCount;
    for (const sector of region.sectors) {
      totalRoutes += sector.routeCount;
    }
  }
  return { totalRoutes, totalSectors };
}

const regions = [
  regionKobylanska,
  regionBedkowska,
  regionBolechowicka,
  regionPradnika,
  regionOlkusza,
];

const { totalRoutes, totalSectors } = computeTotals(regions);

export const JURA_POLNOCNA_DETAIL: GuidebookDetail = {
  id: '566',
  title: 'Jura Północna',
  coverImageUrl:
    'https://ksiegarnia.wspinanie.pl/images/images/jpn2024/mini/250px_jura_polnocna_okladka.jpg',
  color: '#6A5490',
  location: 'Jura Krakowsko-Częstochowska, Polska',
  publisher: 'Wspinanie.pl',
  totalRoutes,
  totalSectors,
  gradeRange: 'III – VI.5',
  styles: ['sport', 'trad'],
  regions,
  metadata: {
    author: 'Michał Szymczak',
    edition: '4. wydanie',
    year: 2024,
    isbn: '978-83-960123-4-5',
    sections: [
      {
        id: 'meta-author',
        title: 'O autorze',
        content:
          'Michał Szymczak wspina się od ponad 25 lat. Absolwent Akademii Górskiej w Zakopanem, wieloletni instruktor PZA. Autor trzech poprzednich wydań przewodnika po Jurze Północnej oraz współautor przewodnika po Dolinie Prądnika. Przeszedł wszystkie kluczowe drogi opisane w tym tomie.',
      },
      {
        id: 'meta-preface',
        title: 'Przedmowa',
        content:
          'Czwarte wydanie przewodnika to efekt trzech lat intensywnej pracy terenowej. Zaktualizowano opisy ponad 200 dróg, dodano 87 nowych linii odkrytych po 2020 roku. Zmieniono układ działów – teraz każda dolina stanowi osobny rozdział z mapą dojazdu i planem sektorów. Szczegółowo opisano zmiany w dostępie do skał w granicach OPN po nowelizacji regulaminu parku z 2023 roku.',
      },
      {
        id: 'meta-nature',
        title: 'Ochrona przyrody i ograniczenia',
        content:
          'Dolina Prądnika leży w całości na terenie Ojcowskiego Parku Narodowego. Wspinaczka jest dopuszczona wyłącznie na skałach wymienionych w Planie Ochrony OPN. Corocznie, od 1 marca do 31 lipca, obowiązuje zamknięcie Maczugi Herkulesa z uwagi na lęgi sokołów wędrownych. Skała Panienek i Igła Deofilowa mogą być objęte tymczasowymi zamknięciami – sprawdzaj aktualny stan na stronie ojcow.pl. Poza OPN obowiązuje zasada nieodśmiecania i nierozpalania ognisk przy skałach.',
      },
      {
        id: 'meta-ethics',
        title: 'Etyka wspinaczkowa',
        content:
          'Jura ma długą tradycję wspinaczki tradycyjnej. Nowe drogi sportowe zakładaj wyłącznie po uzgodnieniu ze środowiskiem lokalnym (klub KW Kraków lub sekcja przy oddziale PTTK). Sztuczne ułatwienia na drogach tradycyjnych są niedopuszczalne. Magnezja w proszku jest dopuszczona, kule magnezjowe – zalecane zamiast luźnej magnezji. Nie czyść chwytów drutową szczotką, jeśli nie jesteś pierwszym ascentorem.',
      },
      {
        id: 'meta-access',
        title: 'Dojazd i zakwaterowanie',
        content:
          'Z Krakowa (25–45 km): autobusem linii 208 lub 238 do Nielepic (Dolina Kobylańska), pociągiem do Krzeszowic lub Olkusza. Samochodem: A4 lub DK94 na zachód od Krakowa, następnie drogi lokalne do poszczególnych dolin. Parking przy Dolinie Kobylańskiej: bezpłatny, lecz w weekendy zatłoczony już o 9:00. Polecane noclegi: kwatery w Nielepicach i Będkowicach (30–70 zł/os.), schronisko PTTK w Ojcowie (rezerwacja wymagana w szczycie sezonu).',
      },
      {
        id: 'meta-history',
        title: 'Historia wspinaczki na Jurze',
        content:
          'Pierwsze wejścia wspinaczkowe na Jurze Północnej datuje się na lata 30. XX wieku – pionierami byli krakowianie skupieni wokół Akademickiego Koła Alpinistów UJ. Do 1945 roku przeszli większość dróg w Dolinie Kobylańskiej i Prądnika. Lata 60.–70. to era wielkich trawersów i dróg tradycyjnych; wówczas powstały klasyki pokoleń: „Droga Herkulesa" na Maczudze czy „Klasyk Zamkowy" w Ojcowie. Rewolucję sportową przyniosły lata 90.: pierwsze ringi, nowe etyki i pierwsze drogi przekraczające trudność VI.3. Dziś Jura to najpopularniejszy rejon wspinaczkowy w Polsce z szacowanym ruchem ponad 50 000 wspinaczy rocznie.',
      },
    ],
  },
};

/** Lookup map for O(1) access by guidebook id. */
export const GUIDEBOOK_DETAILS: Record<string, GuidebookDetail> = {
  [JURA_POLNOCNA_DETAIL.id]: JURA_POLNOCNA_DETAIL,
};
