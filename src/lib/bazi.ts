export type Element = 'METAL' | 'WOOD' | 'WATER' | 'FIRE' | 'EARTH';

export interface Pillar {
  heavenly: string;
  earthly: string;
  element: Element;
}

export interface BaziReport {
  eightCharacters: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  elementCount: Record<Element, number>;
  deficits: Element[];
  dayMaster: { stem: string; element: Element };
  favorableElements: Element[];
  summary: string;
}

const HEAVENLY_STEMS = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
] as const;

const EARTHLY_BRANCHES = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
] as const;

const STEM_ELEMENTS: Element[] = [
  'WOOD', 'WOOD', 'FIRE', 'FIRE', 'EARTH', 'EARTH', 'METAL', 'METAL', 'WATER', 'WATER',
];

const BRANCH_ELEMENTS: Element[] = [
  'WATER', 'EARTH', 'WOOD', 'WOOD', 'EARTH', 'FIRE', 'FIRE', 'EARTH', 'METAL', 'METAL', 'EARTH', 'WATER',
];

const ELEMENT_VI: Record<Element, string> = {
  METAL: 'Kim',
  WOOD: 'Mộc',
  WATER: 'Thủy',
  FIRE: 'Hỏa',
  EARTH: 'Thổ',
};

const GENERATES: Record<Element, Element> = {
  WOOD: 'FIRE',
  FIRE: 'EARTH',
  EARTH: 'METAL',
  METAL: 'WATER',
  WATER: 'WOOD',
};

const CONTROLS: Record<Element, Element> = {
  WOOD: 'EARTH',
  EARTH: 'WATER',
  WATER: 'FIRE',
  FIRE: 'METAL',
  METAL: 'WOOD',
};

// Lunar month data: bit-encoded leap months and month lengths (1900-2100)
const LUNAR_INFO: number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a6a8, 0x0e4d0, 0x06e55,
  0x06aa0, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520,
];

function leapMonth(year: number): number {
  return LUNAR_INFO[year - 1900] & 0xf;
}

function leapDays(year: number): number {
  if (leapMonth(year)) {
    return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function monthDays(year: number, month: number): number {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

function lunarYearDays(year: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(year);
}

export function solarToLunar(year: number, month: number, day: number): {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
} {
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);

  let lunarYear = 1900;
  let daysInYear = lunarYearDays(lunarYear);
  while (offset >= daysInYear && lunarYear < 2100) {
    offset -= daysInYear;
    lunarYear++;
    daysInYear = lunarYearDays(lunarYear);
  }

  const leap = leapMonth(lunarYear);
  let isLeap = false;
  let lunarMonth = 1;

  for (let m = 1; m <= 12 && offset >= 0; m++) {
    if (leap > 0 && m === leap + 1 && !isLeap) {
      const leapDaysCount = leapDays(lunarYear);
      if (offset < leapDaysCount) {
        isLeap = true;
        lunarMonth = m - 1;
        break;
      }
      offset -= leapDaysCount;
    }

    const md = monthDays(lunarYear, m);
    if (offset < md) {
      lunarMonth = m;
      break;
    }
    offset -= md;
  }

  return {
    lunarYear,
    lunarMonth,
    lunarDay: offset + 1,
    isLeap,
  };
}

function makePillar(stemIdx: number, branchIdx: number): Pillar {
  return {
    heavenly: HEAVENLY_STEMS[((stemIdx % 10) + 10) % 10],
    earthly: EARTHLY_BRANCHES[((branchIdx % 12) + 12) % 12],
    element: STEM_ELEMENTS[((stemIdx % 10) + 10) % 10],
  };
}

function getYearPillar(lunarYear: number): Pillar {
  const stemIdx = (lunarYear - 4) % 10;
  const branchIdx = (lunarYear - 4) % 12;
  return makePillar(stemIdx, branchIdx);
}

function getMonthPillar(lunarYear: number, lunarMonth: number): Pillar {
  const yearStem = (lunarYear - 4) % 10;
  const monthStemBase = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemIdx = (monthStemBase[yearStem] + lunarMonth - 1) % 10;
  const branchIdx = (lunarMonth + 1) % 12;
  return makePillar(stemIdx, branchIdx);
}

function getDayPillar(year: number, month: number, day: number): Pillar {
  const c = Math.floor((14 - month) / 12);
  const y = year + 4800 - c;
  const m = month + 12 * c - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const stemIdx = (jd + 9) % 10;
  const branchIdx = (jd + 1) % 12;
  return makePillar(stemIdx, branchIdx);
}

function getHourPillar(dayStemIdx: number, hourBranchIdx: number): Pillar {
  const hourStemBase = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const stemIdx = (hourStemBase[dayStemIdx] + hourBranchIdx) % 10;
  return makePillar(stemIdx, hourBranchIdx);
}

function countElements(pillars: Pillar[]): Record<Element, number> {
  const count: Record<Element, number> = { METAL: 0, WOOD: 0, WATER: 0, FIRE: 0, EARTH: 0 };
  for (const p of pillars) {
    count[p.element]++;
    const branchIdx = EARTHLY_BRANCHES.indexOf(p.earthly as typeof EARTHLY_BRANCHES[number]);
    if (branchIdx >= 0) {
      count[BRANCH_ELEMENTS[branchIdx]]++;
    }
  }
  return count;
}

export function getEightCharacters(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  hourBranchIdx?: number,
): { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null } {
  const year = getYearPillar(lunarYear);
  const month = getMonthPillar(lunarYear, lunarMonth);
  const day = getDayPillar(solarYear, solarMonth, solarDay);

  let hour: Pillar | null = null;
  if (hourBranchIdx !== undefined && hourBranchIdx >= 0) {
    const dayStemIdx = HEAVENLY_STEMS.indexOf(day.heavenly as typeof HEAVENLY_STEMS[number]);
    hour = getHourPillar(dayStemIdx, hourBranchIdx);
  }

  return { year, month, day, hour };
}

export function getFiveElements(pillars: Pillar[]): Record<Element, number> {
  return countElements(pillars);
}

export function getDeficits(elementCount: Record<Element, number>): Element[] {
  return (Object.keys(elementCount) as Element[]).filter((e) => elementCount[e] === 0);
}

export function getDayMaster(eightChars: { day: Pillar }): { stem: string; element: Element } {
  return { stem: eightChars.day.heavenly, element: eightChars.day.element };
}

export function getFavorableElements(
  dayMaster: { element: Element },
  elementCount: Record<Element, number>,
): Element[] {
  const dm = dayMaster.element;
  const total = Object.values(elementCount).reduce((a, b) => a + b, 0);
  const dmCount = elementCount[dm];
  const isStrong = dmCount >= total / 5;

  if (isStrong) {
    const controlsDm = (Object.keys(CONTROLS) as Element[]).find(
      (e) => CONTROLS[e] === dm,
    )!;
    const favorable = new Set<Element>([GENERATES[dm], controlsDm]);
    return Array.from(favorable);
  }

  const favorable = new Set<Element>([
    Object.entries(GENERATES).find(([, v]) => v === dm)?.[0] as Element,
    dm,
  ].filter(Boolean));
  return Array.from(favorable);
}

function buildSummary(
  dayMaster: { element: Element },
  deficits: Element[],
  favorable: Element[],
): string {
  const parts = [`Mệnh ${ELEMENT_VI[dayMaster.element]}`];
  if (deficits.length > 0) {
    parts.push(`thiếu ${deficits.map((d) => ELEMENT_VI[d]).join(', ')}`);
  }
  if (favorable.length > 0) {
    parts.push(`Hỷ ${favorable.map((f) => ELEMENT_VI[f]).join(', ')}`);
  }
  return parts.join('. ') + '.';
}

export function generateBaziReport(
  birthDate: string,
  birthHour: string | undefined,
  _gender: 'MALE' | 'FEMALE',
): BaziReport {
  const [year, month, day] = birthDate.split('-').map(Number);
  const lunar = solarToLunar(year, month, day);

  const hourBranchIdx = birthHour !== undefined && birthHour !== ''
    ? parseInt(birthHour, 10)
    : undefined;

  const eightCharacters = getEightCharacters(
    lunar.lunarYear,
    lunar.lunarMonth,
    lunar.lunarDay,
    year,
    month,
    day,
    hourBranchIdx,
  );

  const pillars = [
    eightCharacters.year,
    eightCharacters.month,
    eightCharacters.day,
    ...(eightCharacters.hour ? [eightCharacters.hour] : []),
  ];

  const elementCount = getFiveElements(pillars);
  const deficits = getDeficits(elementCount);
  const dayMaster = getDayMaster(eightCharacters);
  const favorableElements = getFavorableElements(dayMaster, elementCount);
  const summary = buildSummary(dayMaster, deficits, favorableElements);

  return {
    eightCharacters,
    elementCount,
    deficits,
    dayMaster,
    favorableElements,
    summary,
  };
}

export { ELEMENT_VI, HEAVENLY_STEMS, EARTHLY_BRANCHES };
