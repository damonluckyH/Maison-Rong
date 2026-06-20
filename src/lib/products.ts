import type { Element } from './bazi';

export type ProductLine =
  | 'dragon-seal'
  | 'phoenix-grace'
  | 'turtle-guardian'
  | 'lotus-dream'
  | 'dong-son'
  | 'heritage';

export type ProductGender = 'MALE' | 'FEMALE' | 'UNISEX';
export type TryOnCategory = 'ring' | 'bracelet' | 'necklace';

export interface Product {
  id: string;
  name: Record<string, string>;
  productLine: ProductLine;
  price: number;
  elements: Element[];
  zodiacs: string[];
  gender: ProductGender;
  images: string[];
  description: Record<string, string>;
  tryOnCategory?: TryOnCategory;
  overlayImage?: string;
  overlayScale?: number;
}

function p(
  id: string,
  viName: string,
  line: ProductLine,
  price: number,
  elements: Element[],
  zodiacs: string[],
  gender: ProductGender,
  viDesc: string,
  translations: Partial<Record<string, { name: string; desc: string }>> = {},
  tryOn?: { category: TryOnCategory; overlayScale: number },
): Product {
  const name: Record<string, string> = {
    vi: viName,
    fr: translations.fr?.name ?? viName,
    en: translations.en?.name ?? viName,
    ko: translations.ko?.name ?? viName,
    ja: translations.ja?.name ?? viName,
    zh: translations.zh?.name ?? viName,
  };
  const description: Record<string, string> = {
    vi: viDesc,
    fr: translations.fr?.desc ?? viDesc,
    en: translations.en?.desc ?? viDesc,
    ko: translations.ko?.desc ?? viDesc,
    ja: translations.ja?.desc ?? viDesc,
    zh: translations.zh?.desc ?? viDesc,
  };
  return {
    id,
    name,
    productLine: line,
    price,
    elements,
    zodiacs,
    gender,
    images: [`/products/${id}.jpg`],
    description,
    ...(tryOn
      ? {
          tryOnCategory: tryOn.category,
          overlayImage: `/products/overlays/${id}.png`,
          overlayScale: tryOn.overlayScale,
        }
      : {}),
  };
}

export const ALL_PRODUCTS: Product[] = [
  p('dragon-seal-ring', 'Nhẫn Dragon Seal', 'dragon-seal', 158_000_000, ['METAL', 'WATER'], ['Thìn', 'Thân', 'Tý'], 'MALE',
    'Nhẫn vàng 24K khắc rồng Lý dynasty, biểu tượng quyền lực và danh dự.',
    { en: { name: 'Dragon Seal Ring', desc: '24K gold ring engraved with Lý dynasty dragon, symbol of power and honor.' }, fr: { name: 'Bague Dragon Seal', desc: 'Bague en or 24K gravée du dragon de la dynastie Lý, symbole de pouvoir et d\'honneur.' } },
    { category: 'ring', overlayScale: 1.0 }),
  p('golden-carp-ring', 'Nhẫn Cá Chép Vàng', 'dragon-seal', 128_000_000, ['WATER', 'METAL'], ['Tý', 'Hợi'], 'UNISEX',
    'Cá chép hóa rồng — biểu tượng thịnh vượng và kiên trì.',
    { en: { name: 'Golden Carp Ring', desc: 'Carp transforming into dragon — symbol of prosperity and perseverance.' } },
    { category: 'ring', overlayScale: 0.9 }),
  p('imperial-dragon-bracelet', 'Vòng Rồng Hoàng Gia', 'dragon-seal', 268_000_000, ['METAL', 'EARTH'], ['Thìn', 'Tuất'], 'MALE',
    'Vòng tay vàng khắc vảy rồng, ẩn số 68 trong hoa văn.',
    { en: { name: 'Imperial Dragon Bracelet', desc: 'Gold bracelet with dragon scales, hidden 68 motif in the pattern.' } },
    { category: 'bracelet', overlayScale: 1.1 }),
  p('azure-dragon-pendant', 'Mặt Dây Rồng Lam', 'dragon-seal', 198_000_000, ['WATER', 'WOOD'], ['Thìn', 'Dần'], 'MALE',
    'Mặt dây chuyền ngọc lam pha vàng, rồng uốn lượn tinh xảo.',
    { en: { name: 'Azure Dragon Pendant', desc: 'Blue jade and gold pendant with exquisitely coiled dragon.' } },
    { category: 'necklace', overlayScale: 1.0 }),

  p('phoenix-grace-necklace', 'Dây Chuyền Phoenix Grace', 'phoenix-grace', 225_000_000, ['FIRE', 'WOOD'], ['Dậu', 'Tỵ', 'Sửu'], 'FEMALE',
    'Dây chuyền vàng hồng khắc chim phượng, lấy cảm hứng từ đường nét áo dài.',
    { en: { name: 'Phoenix Grace Necklace', desc: 'Rose gold necklace with phoenix motif, inspired by áo dài lines.' }, fr: { name: 'Collier Phoenix Grace', desc: 'Collier en or rose gravé de phénix, inspiré des lignes de l\'áo dài.' } },
    { category: 'necklace', overlayScale: 1.05 }),
  p('ember-phoenix-earrings', 'Bông Tai Phượng Lửa', 'phoenix-grace', 186_000_000, ['FIRE', 'METAL'], ['Dậu', 'Ngọ'], 'FEMALE',
    'Bông tai vàng đỏ pha kim cương, lấp lánh như đuôi phượng.',
    { en: { name: 'Ember Phoenix Earrings', desc: 'Red gold earrings with diamonds, shimmering like phoenix tail.' } }),
  p('lotus-phoenix-brooch', 'Trâm Phượng Sen', 'phoenix-grace', 168_000_000, ['FIRE', 'EARTH'], ['Dậu', 'Mão'], 'FEMALE',
    'Trâm cài sen hồng phượng, hòa quyện hoa sen và chim phượng.',
    { en: { name: 'Lotus Phoenix Brooch', desc: 'Brooch blending lotus and phoenix in rose gold.' } }),
  p('crimson-grace-ring', 'Nhẫn Crimson Grace', 'phoenix-grace', 145_000_000, ['FIRE', 'WATER'], ['Tỵ', 'Dần'], 'FEMALE',
    'Nhẫn ruby đỏ thẫm khung vàng, tượng trưng nữ thần và quyền lực.',
    { en: { name: 'Crimson Grace Ring', desc: 'Deep ruby ring in gold setting, symbol of feminine power.' } },
    { category: 'ring', overlayScale: 0.85 }),

  p('turtle-guardian-bracelet', 'Vòng Turtle Guardian', 'turtle-guardian', 98_000_000, ['WATER', 'EARTH'], ['Tý', 'Hợi', 'Ngọ'], 'UNISEX',
    'Vòng tay rùa thần hồ Hoàn Kiếm, bảo vệ và trí tuệ.',
    { en: { name: 'Turtle Guardian Bracelet', desc: 'Sacred turtle bracelet of Hoàn Kiếm Lake, wisdom and protection.' } },
    { category: 'bracelet', overlayScale: 1.0 }),
  p('jade-serenity-bracelet', 'Vòng Ngọc Bích An Nhiên', 'turtle-guardian', 186_000_000, ['WOOD', 'EARTH'], ['Mão', 'Dần', 'Mùi'], 'FEMALE',
    'Ngọc bích Việt Nam xanh lá, mang lại bình an và sự tĩnh lặng.',
    { en: { name: 'Jade Serenity Bracelet', desc: 'Vietnamese green jade bracelet for peace and serenity.' } },
    { category: 'bracelet', overlayScale: 0.95 }),
  p('lake-turtle-amulet', 'Bùa Hồ Rùa Thần', 'turtle-guardian', 112_000_000, ['WATER', 'METAL'], ['Hợi', 'Tý'], 'UNISEX',
    'Bùa hộ mệnh rùa vàng, cảm hứng từ truyền thuyết trả kiếm.',
    { en: { name: 'Lake Turtle Amulet', desc: 'Golden turtle amulet inspired by the sword-returning legend.' } },
    { category: 'necklace', overlayScale: 0.9 }),
  p('sacred-turtle-beads', 'Chuỗi Hạt Rùa Thiêng', 'turtle-guardian', 136_000_000, ['EARTH', 'WATER'], ['Sửu', 'Hợi'], 'UNISEX',
    'Chuỗi hạt gỗ trầm hương khắc rùa, hương thơm thanh khiết.',
    { en: { name: 'Sacred Turtle Beads', desc: 'Agarwood bead bracelet with turtle carvings and pure fragrance.' } },
    { category: 'bracelet', overlayScale: 1.05 }),

  p('lotus-dream-pillow-set', 'Bộ Gối Lotus Dream', 'lotus-dream', 320_000_000, ['WOOD', 'WATER'], ['all'], 'UNISEX',
    'Bộ gối lụa tơ tằm thêu sen, công nghệ giấc ngủ Pháp.',
    { en: { name: 'Lotus Dream Pillow Set', desc: 'Silk pillow set with lotus embroidery, French sleep technology.' } }),
  p('sen-bloom-duvet', 'Chăn Sen Nở', 'lotus-dream', 480_000_000, ['WOOD', 'EARTH'], ['all'], 'UNISEX',
    'Chăn lông vũ cao cấp thêu hoa sen nở, mềm mại tuyệt đối.',
    { en: { name: 'Sen Bloom Duvet', desc: 'Premium down duvet with blooming lotus embroidery.' } }),
  p('moonlit-lotus-sheets', 'Ga Trăng Sen', 'lotus-dream', 560_000_000, ['WATER', 'WOOD'], ['all'], 'UNISEX',
    'Bộ ga lụa cao cấp họa tiết sen dưới trăng, mát mẻ quanh năm.',
    { en: { name: 'Moonlit Lotus Sheets', desc: 'Luxury silk sheets with moonlit lotus motif, cool year-round.' } }),
  p('tranquil-lotus-shams', 'Vỏ Gối Sen Tĩnh', 'lotus-dream', 280_000_000, ['WOOD', 'FIRE'], ['Mão', 'Mùi'], 'UNISEX',
    'Vỏ gối thêu sen tay, từng đường kim tinh xảo.',
    { en: { name: 'Tranquil Lotus Shams', desc: 'Hand-embroidered lotus pillow shams with exquisite stitching.' } }),

  p('dong-son-leather-bag', 'Túi Da Dong Son', 'dong-son', 450_000_000, ['EARTH', 'METAL'], ['all'], 'UNISEX',
    'Túi da bê cao cấp dập nổi trống đồng Đông Sơn.',
    { en: { name: 'Dong Son Leather Bag', desc: 'Premium calfskin bag with embossed Đông Sơn drum pattern.' } }),
  p('bronze-drum-clutch', 'Clutch Trống Đồng', 'dong-son', 380_000_000, ['METAL', 'FIRE'], ['Thân', 'Dậu'], 'UNISEX',
    'Clutch đêm khóa đồng mặt trời, lấp lánh dưới ánh đèn.',
    { en: { name: 'Bronze Drum Clutch', desc: 'Evening clutch with bronze sun clasp, radiant under light.' } }),
  p('sun-drum-tote', 'Tote Mặt Trời', 'dong-son', 520_000_000, ['FIRE', 'EARTH'], ['Ngọ', 'Tuất'], 'UNISEX',
    'Tote da lớn họa tiết mặt trời Đông Sơn, sang trọng hàng ngày.',
    { en: { name: 'Sun Drum Tote', desc: 'Large leather tote with Đông Sơn sun motif for daily elegance.' } }),
  p('lacquer-drum-wallet', 'Ví Sơn Mài Trống', 'dong-son', 168_000_000, ['EARTH', 'WOOD'], ['all'], 'UNISEX',
    'Ví sơn mài truyền thống Việt Nam, họa tiết trống đồng tinh tế.',
    { en: { name: 'Lacquer Drum Wallet', desc: 'Traditional Vietnamese lacquer wallet with drum motif.' } }),

  p('heritage-family-bedding', 'Bộ Ga Heritage Gia Tộc', 'heritage', 880_000_000, ['EARTH', 'FIRE'], ['all'], 'UNISEX',
    'Bộ ga gia tộc thêu họ tên và huy hiệu riêng, di sản truyền đời.',
    { en: { name: 'Heritage Family Bedding', desc: 'Family bedding set with custom surname crest, heirloom quality.' } }),
  p('dynasty-crest-coverlet', 'Chăn Huy Hiệu Vương Triều', 'heritage', 1_280_000_000, ['FIRE', 'METAL'], ['all'], 'UNISEX',
    'Chăn lụa vàng thêu huy hiệu vương triều, giới hạn 68 bộ.',
    { en: { name: 'Dynasty Crest Coverlet', desc: 'Gold silk coverlet with dynasty crest, limited to 68 pieces.' } }),
  p('ancestral-silk-set', 'Bộ Lụa Tổ Tiên', 'heritage', 960_000_000, ['EARTH', 'WATER'], ['all'], 'UNISEX',
    'Bộ ga lụa tơ tằm Bảo Lộc, thêu chữ thư pháp Quốc Ngữ.',
    { en: { name: 'Ancestral Silk Set', desc: 'Bảo Lộc silk set with Quốc Ngữ calligraphy embroidery.' } }),
  p('royal-lineage-blanket', 'Chăn Dòng Dõi Hoàng Gia', 'heritage', 1_050_000_000, ['METAL', 'EARTH'], ['all'], 'UNISEX',
    'Chăn cashmere cao cấp viền vàng 24K, dành cho gia tộc danh giá.',
    { en: { name: 'Royal Lineage Blanket', desc: 'Premium cashmere blanket with 24K gold trim for noble families.' } }),
];

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function createProduct(data: Product): Product {
  if (ALL_PRODUCTS.some((p) => p.id === data.id)) {
    throw new Error('Product ID already exists');
  }
  ALL_PRODUCTS.push(data);
  return data;
}

export function updateProduct(id: string, data: Partial<Omit<Product, 'id'>>): Product | undefined {
  const index = ALL_PRODUCTS.findIndex((p) => p.id === id);
  if (index < 0) return undefined;
  ALL_PRODUCTS[index] = { ...ALL_PRODUCTS[index], ...data };
  return ALL_PRODUCTS[index];
}

export function deleteProduct(id: string): boolean {
  const index = ALL_PRODUCTS.findIndex((p) => p.id === id);
  if (index < 0) return false;
  ALL_PRODUCTS.splice(index, 1);
  return true;
}

export function getTryOnProducts(): Product[] {
  return ALL_PRODUCTS.filter((p) => p.tryOnCategory != null);
}

export function supportsTryOn(product: Product): boolean {
  return product.tryOnCategory != null;
}

export function formatVnd(price: number): string {
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₫`;
}

export const PRODUCT_LINE_GRADIENTS: Record<ProductLine, string> = {
  'dragon-seal': 'from-brand-red/40 to-brand-gold/30',
  'phoenix-grace': 'from-brand-red/30 to-brand-gold-light/40',
  'turtle-guardian': 'from-brand-jade/40 to-brand-black-light',
  'lotus-dream': 'from-brand-jade/30 to-brand-gold/20',
  'dong-son': 'from-brand-gold/30 to-brand-black-light',
  'heritage': 'from-brand-gold/40 to-brand-red/20',
};
