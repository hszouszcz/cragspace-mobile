import type {
  SearchContextConfig,
  SearchFilterMeta,
} from '@/features/SearchBar';
import type { Guidebook } from '@/services/guidebooks/types';
import type { HeroGuidebook, ScreenItem } from './types';

export const GUIDEBOOK_FILTERS: SearchFilterMeta[] = [
  { id: 'all', label: 'All Climbing', value: 'all' },
  { id: 'sport', label: 'Sport', value: 'sport' },
  { id: 'trad', label: 'Trad', value: 'trad' },
  { id: 'bouldering', label: 'Bouldering', value: 'bouldering' },
  { id: 'alpine', label: 'Alpine', value: 'alpine' },
  { id: 'ice', label: 'Ice', value: 'ice' },
];

export const GUIDEBOOK_CONTEXT_CONFIG: SearchContextConfig = {
  contextId: 'guidebook-explorer',
  placeholder: 'Search guidebooks...',
  filters: GUIDEBOOK_FILTERS,
  initialSelectedValues: ['all'],
};

export const GUIDEBOOKS: HeroGuidebook[] = [
  // ── New Releases ────────────────────────────────────────────────────────────
  {
    id: '1155',
    title: 'Himalayan Rocks',
    location: 'Himalayas',
    routeCount: '500+ Routes',
    color: '#5C4A3A',
    badge: 'New 2025',
    year: 2025,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_himalayan-rocks-2025.jpg',
  },
  {
    id: '1154',
    title: 'Malta i Gozo',
    location: 'Malta & Gozo',
    routeCount: '350+ Routes',
    color: '#2A6B7C',
    badge: 'New 2026',
    year: 2026,
    image:
      'https://ksiegarnia.wspinanie.pl/images/mini/250px_malta-gozo-2026.jpg',
  },
  // ── Poland & Central Europe ──────────────────────────────────────────────────
  {
    id: '566',
    title: 'Jura Północna',
    location: 'Jura, Poland',
    routeCount: '2,500+ Routes',
    color: '#6A5490',
    publisher: 'Wspinanie.pl',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/jpn2024/mini/250px_jura_polnocna_okladka.jpg',
  },
  {
    id: '422',
    title: 'Jura Środkowa',
    location: 'Jura, Poland',
    routeCount: 'Sport & Trad',
    color: '#7A6090',
    publisher: 'Wspinanie.pl',
    year: 2025,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/js2025/mini/250px_jura-srodkowa-2025-okladka.jpg',
  },
  {
    id: '471',
    title: 'Jura Południowa',
    location: 'Jura, Poland',
    routeCount: '1,800+ Routes',
    color: '#8A6580',
    publisher: 'Wspinanie.pl',
    year: 2025,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/jpd2025/mini/250px_Jura Poludniowa okladka.jpg',
  },
  {
    id: '1101',
    title: 'Ziemia Kłodzka',
    location: 'Lower Silesia, Poland',
    routeCount: '600+ Routes',
    color: '#5A7A6A',
    publisher: 'Wspinanie.pl',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/ziemia_klodzka/mini/250px_Ziemia-klodzka-2024.jpg',
  },
  {
    id: '949',
    title: 'Tatry Polskie – Drogi Zimowe',
    location: 'Tatra Mountains, Poland',
    routeCount: 'Ice & Mixed',
    color: '#3A6A8A',
    publisher: 'Biblioteka Taternika',
    year: 2025,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/tatryzima2025/mini/250px_tatry-polskie-zima.jpg',
  },
  {
    id: '1089',
    title: '50 Tatrzańskich Klasyków',
    location: 'Tatra Mountains',
    routeCount: '50 Classic Routes',
    color: '#4A5A7A',
    publisher: 'Biblioteka Taternika',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/50tatrzanskich/mini/250px_50-tatrzanskich-klasykow-dla-poczatkujacych-okladka-mala.jpg',
  },
  {
    id: '1088',
    title: 'Sudety Zachodnie',
    location: 'Western Sudetes, Poland',
    routeCount: '800+ Routes',
    color: '#6A5A4A',
    publisher: 'GÓRY BOOKS',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/sudety_zachodnie/mini/250px_Sudety-Zachodnie-Kajca-2024.jpg',
  },
  {
    id: '470',
    title: 'Góry Sokole',
    location: 'Lower Silesia, Poland',
    routeCount: '400+ Routes',
    color: '#7A5A3A',
    publisher: 'GÓRY BOOKS',
    year: 2025,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_gory-sokole-2025.jpg',
  },
  {
    id: '356',
    title: 'Rudawy Janowickie',
    location: 'Lower Silesia, Poland',
    routeCount: '500+ Routes',
    color: '#5A6A4A',
    publisher: 'GÓRY BOOKS',
    year: 2022,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/rudawy2022/mini/250px_rudawy_janowickie_kajca_2022.jpg',
  },
  {
    id: '751',
    title: 'Beskidy Zachodnie i Pogórze',
    location: 'Western Beskids, Poland',
    routeCount: '700+ Routes',
    color: '#4A6A5A',
    publisher: 'Wspinanie.pl',
    year: 2019,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/Beskidy2019/mini/250px_beskidy-okladka-wspinacz.jpg',
  },
  {
    id: '829',
    title: 'POLSKA 1 – Sudety & Przedgórze',
    location: 'Western Poland',
    routeCount: '1,200+ Routes',
    color: '#5A4A6A',
    publisher: 'GÓRY BOOKS',
    image:
      'https://ksiegarnia.wspinanie.pl/images/mini/250px_polska-przewodnik-wspinaczkowy-wydawnictwo-gory-books.jpg',
  },
  // ── Mediterranean & Adriatic ─────────────────────────────────────────────────
  {
    id: '393',
    title: 'Chorwacja',
    location: 'Croatia',
    routeCount: '3,000+ Routes',
    color: '#3A6E5A',
    publisher: 'Astroida',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_Chorwacja-2024.jpg',
  },
  {
    id: '392',
    title: 'Paklenica',
    location: 'Paklenica, Croatia',
    routeCount: '500+ Routes',
    color: '#8A5A3A',
    publisher: 'Astroida',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_Paklenica-2024.jpg',
  },
  {
    id: '440',
    title: 'Climbing Without Frontiers – Istria',
    location: 'Istria, Croatia',
    routeCount: '900+ Routes',
    color: '#3A6A7A',
    year: 2021,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/Istria/mini/250px_istria_2021_okladka.jpg',
  },
  {
    id: '467',
    title: 'Słowenia',
    location: 'Slovenia',
    routeCount: '1,500+ Routes',
    color: '#2A7A6A',
    year: 2023,
    image:
      'https://ksiegarnia.wspinanie.pl/images/mini/250px_slovenia_topo_2023.jpg',
  },
  {
    id: '1125',
    title: 'Serbia',
    location: 'Serbia',
    routeCount: '1,800+ Routes',
    color: '#8B3A2A',
    badge: 'New 2025',
    publisher: 'Balkan Colours',
    year: 2025,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/Serbia2025/mini/250px_serbia_2025.jpg',
  },
  {
    id: '1134',
    title: 'Crag Climbing in Romsdal',
    location: 'Romsdal, Norway',
    routeCount: '600+ Routes',
    color: '#3A4A6A',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/Romsdal/mini/250px_Crag-Climbing-Romsdal.png',
  },
  // ── Alps & Dolomites ─────────────────────────────────────────────────────────
  {
    id: '211',
    title: "Dolomity – Cortina d'Ampezzo",
    location: 'Dolomites, Italy',
    routeCount: '800+ Routes',
    color: '#4A7A4A',
    publisher: 'Sklep Podróżnika',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/mini/250px_dolomity_cortina_2024.jpg',
  },
  {
    id: '1053',
    title: 'Dolomity – Korona Trzytysięczników',
    location: 'Dolomites, Italy',
    routeCount: '3,000m+ Peaks',
    color: '#5A6A5A',
    publisher: 'Bezdroża',
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_dolomity-korona-trzytysiecznikow-roberto-ciri-alberto-bernardi.jpg',
  },
  {
    id: '1124',
    title: 'Góry Regionu Trentino',
    location: 'Trentino, Italy',
    routeCount: '700+ Routes',
    color: '#4A5A6A',
    publisher: 'Biblioteka Taternika',
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_Gory-Regionu-Trentino-okladka.jpg',
  },
  {
    id: '974',
    title: 'Alpy Wschodnie',
    location: 'Eastern Alps',
    routeCount: '101 Routes',
    color: '#5A5A7A',
    publisher: 'Bezdroża',
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_alpy-wschodnie-przewodnik-wspinaczkowy.jpg',
  },
  {
    id: '963',
    title: 'Alpy Zachodnie',
    location: 'Western Alps',
    routeCount: '102 Routes',
    color: '#6A5A5A',
    publisher: 'Bezdroża',
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_alpy-zachodnie-przewodnik-wspinaczkowy.jpg',
  },
  // ── Slovakia ─────────────────────────────────────────────────────────────────
  {
    id: '1060',
    title: 'Zahorie – Słowackie Skały I',
    location: 'Záhorie, Slovakia',
    routeCount: '400+ Routes',
    color: '#5A7A5A',
    publisher: 'Skaly na Slovensku',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/slowacja/mini/250px_zahorie_2024.jpg',
  },
  {
    id: '990',
    title: 'Małe Karpaty – Słowackie Skały II',
    location: 'Malé Karpaty, Slovakia',
    routeCount: '600+ Routes',
    color: '#6A6A4A',
    publisher: 'Skaly na Slovensku',
    year: 2024,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/slowacja/mini/250px_male_karpaty_2024.jpg',
  },
  {
    id: '907',
    title: 'Dreveník – Słowackie Skały III',
    location: 'Dreveník, Slovakia',
    routeCount: '300+ Routes',
    color: '#7A5A4A',
    publisher: 'Skaly na Slovensku',
    year: 2019,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/slowacja/mini/250px_drevenik_2019.jpg',
  },
  {
    id: '989',
    title: 'Demianowska Dolina – Słowackie Skały V',
    location: 'Demänovská dolina, Slovakia',
    routeCount: '500+ Routes',
    color: '#4A6A7A',
    publisher: 'Skaly na Slovensku',
    year: 2025,
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/slowacja/mini/250px_Dolina-Demianowska-2025.jpg',
  },
  {
    id: '1148',
    title: 'Trenčín – Słowackie Skały VIII',
    location: 'Trenčín, Slovakia',
    routeCount: '400+ Routes',
    color: '#6A4A5A',
    publisher: 'Skaly na Slovensku',
    image:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_trencin.jpg',
  },
];

const CARD_PALETTE = [
  '#5C4A3A',
  '#2A6B7C',
  '#3A6E5A',
  '#8B3A2A',
  '#6A5490',
  '#4A7A4A',
  '#7A6090',
  '#8A6580',
  '#5A7A6A',
  '#3A6A8A',
] as const;

export function cardColorFromId(id: string): string {
  const hash = id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return CARD_PALETTE[hash % CARD_PALETTE.length];
}

export const SEARCH_CORPUS: Guidebook[] = [
  {
    id: '1155',
    title: 'Himalayan Rocks',
    country: 'Nepal',
    region: 'Himalayas',
    publisher: null,
    pricePln: '180.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_himalayan-rocks-2025.jpg',
    productUrl: null,
    climbingStyles: ['alpine'],
  },
  {
    id: '1154',
    title: 'Malta i Gozo',
    country: 'Malta',
    region: 'Gozo',
    publisher: null,
    pricePln: '169.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/mini/250px_malta-gozo-2026.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '566',
    title: 'Jura Północna',
    country: 'Poland',
    region: 'Jura',
    publisher: 'Wspinanie.pl',
    pricePln: '109.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/jpn2024/mini/250px_jura_polnocna_okladka.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '422',
    title: 'Jura Środkowa',
    country: 'Poland',
    region: 'Jura',
    publisher: 'Wspinanie.pl',
    pricePln: '109.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/js2025/mini/250px_jura-srodkowa-2025-okladka.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '471',
    title: 'Jura Południowa',
    country: 'Poland',
    region: 'Jura',
    publisher: 'Wspinanie.pl',
    pricePln: '99.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/jpd2025/mini/250px_Jura Poludniowa okladka.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '1101',
    title: 'Ziemia Kłodzka',
    country: 'Poland',
    region: 'Sudety',
    publisher: 'Wspinanie.pl',
    pricePln: '99.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/ziemia_klodzka/mini/250px_Ziemia-klodzka-2024.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '949',
    title: 'Tatry Polskie – Drogi Zimowe',
    country: 'Poland',
    region: 'Tatry',
    publisher: 'Biblioteka Taternika',
    pricePln: '159.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/tatryzima2025/mini/250px_tatry-polskie-zima.jpg',
    productUrl: null,
    climbingStyles: ['alpine', 'ice'],
  },
  {
    id: '1089',
    title: '50 Tatrzańskich Klasyków',
    country: 'Poland',
    region: 'Tatry',
    publisher: 'Biblioteka Taternika',
    pricePln: '89.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/50tatrzanskich/mini/250px_50-tatrzanskich-klasykow-dla-poczatkujacych-okladka-mala.jpg',
    productUrl: null,
    climbingStyles: ['alpine', 'trad'],
  },
  {
    id: '1088',
    title: 'Sudety Zachodnie',
    country: 'Poland',
    region: 'Sudety',
    publisher: 'GÓRY BOOKS',
    pricePln: '110.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/sudety_zachodnie/mini/250px_Sudety-Zachodnie-Kajca-2024.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '470',
    title: 'Góry Sokole',
    country: 'Poland',
    region: 'Sudety',
    publisher: 'GÓRY BOOKS',
    pricePln: '130.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_gory-sokole-2025.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '356',
    title: 'Rudawy Janowickie',
    country: 'Poland',
    region: 'Sudety',
    publisher: 'GÓRY BOOKS',
    pricePln: '99.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/rudawy2022/mini/250px_rudawy_janowickie_kajca_2022.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '751',
    title: 'Beskidy Zachodnie i Pogórze',
    country: 'Poland',
    region: 'Beskidy',
    publisher: 'Wspinanie.pl',
    pricePln: '89.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/Beskidy2019/mini/250px_beskidy-okladka-wspinacz.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad', 'bouldering'],
  },
  {
    id: '829',
    title: 'POLSKA 1 – Sudety & Przedgórze',
    country: 'Poland',
    region: 'Sudety',
    publisher: 'GÓRY BOOKS',
    pricePln: '120.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/mini/250px_polska-przewodnik-wspinaczkowy-wydawnictwo-gory-books.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '393',
    title: 'Chorwacja',
    country: 'Croatia',
    region: 'Dalmatia',
    publisher: 'Astroida',
    pricePln: '149.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_Chorwacja-2024.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '392',
    title: 'Paklenica',
    country: 'Croatia',
    region: 'Paklenica',
    publisher: 'Astroida',
    pricePln: '99.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_Paklenica-2024.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '440',
    title: 'Climbing Without Frontiers – Istria',
    country: 'Croatia',
    region: 'Istria',
    publisher: null,
    pricePln: '89.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/Istria/mini/250px_istria_2021_okladka.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '467',
    title: 'Słowenia',
    country: 'Slovenia',
    region: 'Julian Alps',
    publisher: null,
    pricePln: '119.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/mini/250px_slovenia_topo_2023.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '1125',
    title: 'Serbia',
    country: 'Serbia',
    region: 'Central Serbia',
    publisher: 'Balkan Colours',
    pricePln: '129.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/Serbia2025/mini/250px_serbia_2025.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'trad'],
  },
  {
    id: '1134',
    title: 'Crag Climbing in Romsdal',
    country: 'Norway',
    region: 'Romsdal',
    publisher: null,
    pricePln: '149.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/Romsdal/mini/250px_Crag-Climbing-Romsdal.png',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '211',
    title: "Dolomity – Cortina d'Ampezzo",
    country: 'Italy',
    region: 'Dolomites',
    publisher: 'Sklep Podróżnika',
    pricePln: '129.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/mini/250px_dolomity_cortina_2024.jpg',
    productUrl: null,
    climbingStyles: ['sport', 'alpine'],
  },
  {
    id: '1053',
    title: 'Dolomity – Korona Trzytysięczników',
    country: 'Italy',
    region: 'Dolomites',
    publisher: 'Bezdroża',
    pricePln: '89.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_dolomity-korona-trzytysiecznikow-roberto-ciri-alberto-bernardi.jpg',
    productUrl: null,
    climbingStyles: ['alpine'],
  },
  {
    id: '1124',
    title: 'Góry Regionu Trentino',
    country: 'Italy',
    region: 'Trentino',
    publisher: 'Biblioteka Taternika',
    pricePln: '99.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_Gory-Regionu-Trentino-okladka.jpg',
    productUrl: null,
    climbingStyles: ['alpine', 'sport'],
  },
  {
    id: '974',
    title: 'Alpy Wschodnie',
    country: 'Austria',
    region: 'Alps',
    publisher: 'Bezdroża',
    pricePln: '79.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_alpy-wschodnie-przewodnik-wspinaczkowy.jpg',
    productUrl: null,
    climbingStyles: ['alpine'],
  },
  {
    id: '963',
    title: 'Alpy Zachodnie',
    country: 'France',
    region: 'Alps',
    publisher: 'Bezdroża',
    pricePln: '79.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_alpy-zachodnie-przewodnik-wspinaczkowy.jpg',
    productUrl: null,
    climbingStyles: ['alpine'],
  },
  {
    id: '1060',
    title: 'Zahorie – Słowackie Skały I',
    country: 'Slovakia',
    region: 'Záhorie',
    publisher: 'Skaly na Slovensku',
    pricePln: '89.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/slowacja/mini/250px_zahorie_2024.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '990',
    title: 'Małe Karpaty – Słowackie Skały II',
    country: 'Slovakia',
    region: 'Malé Karpaty',
    publisher: 'Skaly na Slovensku',
    pricePln: '99.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/slowacja/mini/250px_male_karpaty_2024.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '907',
    title: 'Dreveník – Słowackie Skały III',
    country: 'Slovakia',
    region: 'Dreveník',
    publisher: 'Skaly na Slovensku',
    pricePln: '79.00',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/slowacja/mini/250px_drevenik_2019.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '989',
    title: 'Demianowska Dolina – Słowackie Skały V',
    country: 'Slovakia',
    region: 'Demänovská dolina',
    publisher: 'Skaly na Slovensku',
    pricePln: '119.99',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/slowacja/mini/250px_Dolina-Demianowska-2025.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
  {
    id: '1148',
    title: 'Trenčín – Słowackie Skały VIII',
    country: 'Slovakia',
    region: 'Trenčín',
    publisher: 'Skaly na Slovensku',
    pricePln: '114.99',
    coverImageUrl:
      'https://ksiegarnia.wspinanie.pl/images/images/mini/250px_trencin.jpg',
    productUrl: null,
    climbingStyles: ['sport'],
  },
];

const guidebooksBySection = {
  newReleases: GUIDEBOOKS.slice(0, 2),
  poland: GUIDEBOOKS.slice(2, 13),
  adriatic: GUIDEBOOKS.slice(13, 19),
  alpine: GUIDEBOOKS.slice(19, 23),
  slovakia: GUIDEBOOKS.slice(23),
};

export const SCREEN_ITEMS: ScreenItem[] = [
  { type: 'section-header', id: 'section-new', title: 'New Releases' },
  ...guidebooksBySection.newReleases.map((g) => ({
    type: 'hero-card' as const,
    id: g.id,
    guidebook: g,
  })),
  { type: 'info-cards-row', id: 'info-cards' },

  {
    type: 'section-header',
    id: 'section-poland',
    title: 'Poland & Central Europe',
  },
  ...guidebooksBySection.poland.map((g) => ({
    type: 'hero-card' as const,
    id: g.id,
    guidebook: g,
  })),

  {
    type: 'section-header',
    id: 'section-adriatic',
    title: 'Mediterranean & Adriatic',
  },
  ...guidebooksBySection.adriatic.map((g) => ({
    type: 'hero-card' as const,
    id: g.id,
    guidebook: g,
  })),

  { type: 'section-header', id: 'section-alpine', title: 'Alps & Dolomites' },
  ...guidebooksBySection.alpine.map((g) => ({
    type: 'hero-card' as const,
    id: g.id,
    guidebook: g,
  })),

  { type: 'section-header', id: 'section-slovakia', title: 'Slovakia' },
  ...guidebooksBySection.slovakia.map((g) => ({
    type: 'hero-card' as const,
    id: g.id,
    guidebook: g,
  })),

  { type: 'spacer', id: 'bottom-spacer' },
];
