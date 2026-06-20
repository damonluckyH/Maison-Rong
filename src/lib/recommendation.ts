import type { Element } from './bazi';
import type { Product } from './products';

export const VIET_ZODIACS = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
] as const;

export function getVietZodiac(birthDate: string): string {
  const year = parseInt(birthDate.split('-')[0], 10);
  return VIET_ZODIACS[(year - 4) % 12];
}

const MODERATE_PRICE = 300_000_000;

function scoreProduct(
  product: Product,
  userDeficits: Element[],
  userFavorable: Element[],
  userGender: 'MALE' | 'FEMALE',
  userZodiac: string,
): number {
  let score = 0;

  if (userDeficits.some((d) => product.elements.includes(d))) score += 3;
  if (userFavorable.some((f) => product.elements.includes(f))) score += 2;
  if (product.gender === userGender || product.gender === 'UNISEX') score += 1;
  if (product.zodiacs.includes('all') || product.zodiacs.includes(userZodiac)) score += 1;

  score += (Math.random() - 0.5);
  return score;
}

export function recommendProducts(
  userDeficits: Element[],
  userFavorable: Element[],
  userGender: 'MALE' | 'FEMALE',
  userZodiac: string,
  allProducts: Product[],
  limit = 8,
): Product[] {
  const scored = allProducts.map((product) => ({
    product,
    score: scoreProduct(product, userDeficits, userFavorable, userGender, userZodiac),
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aDist = Math.abs(a.product.price - MODERATE_PRICE);
    const bDist = Math.abs(b.product.price - MODERATE_PRICE);
    return aDist - bDist;
  });

  return scored.slice(0, limit).map((s) => s.product);
}
