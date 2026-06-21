import { PrismaClient } from '@prisma/client';
import { generateBaziReport } from '../src/lib/bazi';
import { ALL_PRODUCTS } from '../src/lib/products';

const prisma = new PrismaClient();

const SEED_USERS = [
  {
    id: 'seed_user_1',
    surname: 'Nguyễn',
    givenName: 'Minh Anh',
    gender: 'FEMALE',
    birthDate: '1990-03-15',
    bloodType: 'A',
    email: 'minhanh@email.vn',
    password: 'demo1234',
    phone: '0901234567',
    zalo: '0901234567',
    locale: 'vi',
    points: 850,
    tier: 'BRONZE',
    vip: false,
    blacklist: false,
  },
  {
    id: 'seed_user_2',
    surname: 'Trần',
    givenName: 'Thu Hà',
    gender: 'FEMALE',
    birthDate: '1988-07-22',
    bloodType: 'B',
    email: 'thuha@email.vn',
    password: 'demo1234',
    phone: '0912345678',
    zalo: '0912345678',
    messenger: 'thuha.fb',
    locale: 'vi',
    points: 3200,
    tier: 'SILVER',
    vip: true,
    blacklist: false,
  },
  {
    id: 'seed_user_3',
    surname: 'Lê',
    givenName: 'Văn Đức',
    gender: 'MALE',
    birthDate: '1985-11-08',
    bloodType: 'O',
    email: 'vanduc@email.vn',
    password: 'demo1234',
    zalo: '0987654321',
    locale: 'vi',
    points: 12500,
    tier: 'GOLD',
    vip: true,
    blacklist: false,
  },
  {
    id: 'seed_user_4',
    surname: 'Phạm',
    givenName: 'Quốc Bảo',
    gender: 'MALE',
    birthDate: '1992-01-30',
    bloodType: 'AB',
    email: 'quocbao@email.vn',
    password: 'demo1234',
    phone: '0923456789',
    zalo: '0923456789',
    locale: 'vi',
    points: 450,
    tier: 'BRONZE',
    vip: false,
    blacklist: true,
  },
  {
    id: 'seed_user_5',
    surname: 'Hoàng',
    givenName: 'Thị Lan',
    gender: 'FEMALE',
    birthDate: '1978-09-12',
    bloodType: 'A',
    email: 'thilan@email.vn',
    password: 'demo1234',
    zalo: '0977889900',
    tiktok: '@thilan_lux',
    locale: 'vi',
    points: 28000,
    tier: 'PLATINUM',
    vip: true,
    blacklist: false,
  },
  {
    id: 'seed_user_6',
    surname: 'Võ',
    givenName: 'Đình Khang',
    gender: 'MALE',
    birthDate: '1995-05-05',
    bloodType: 'B',
    email: 'dinhkhang@email.vn',
    password: 'demo1234',
    phone: '0934567890',
    zalo: '0934567890',
    messenger: 'dinhkhang.messenger',
    locale: 'vi',
    points: 62000,
    tier: 'DIAMOND',
    vip: true,
    blacklist: false,
  },
] as const;

const SEED_ORDERS = [
  {
    id: 'ORD-2026-001',
    userId: 'seed_user_1',
    customerName: 'Nguyễn Minh Anh',
    customerEmail: 'minhanh@email.vn',
    customerPhone: '0901234567',
    recipientName: 'Nguyễn Minh Anh',
    recipientPhone: '0901234567',
    shippingAddress: 'TP. Hồ Chí Minh, Việt Nam',
    paymentMethod: 'COD',
    totalAmount: 158_000_000,
    pointsEarned: 158_000,
    status: 'PENDING',
    createdAt: new Date('2026-06-01T10:30:00'),
    items: [
      { productId: 'dragon-seal-ring', productName: 'Nhẫn Dragon Seal', quantity: 1, unitPrice: 158_000_000 },
    ],
  },
  {
    id: 'ORD-2026-002',
    userId: 'seed_user_2',
    customerName: 'Trần Thu Hà',
    customerEmail: 'thuha@email.vn',
    customerPhone: '0912345678',
    recipientName: 'Trần Thu Hà',
    recipientPhone: '0912345678',
    shippingAddress: 'TP. Hồ Chí Minh, Việt Nam',
    paymentMethod: 'COD',
    totalAmount: 411_000_000,
    pointsEarned: 411_000,
    status: 'PAID',
    createdAt: new Date('2026-06-02T14:15:00'),
    items: [
      { productId: 'phoenix-grace-necklace', productName: 'Dây Chuyền Phoenix Grace', quantity: 1, unitPrice: 225_000_000 },
      { productId: 'ember-phoenix-earrings', productName: 'Bông Tai Phượng Lửa', quantity: 1, unitPrice: 186_000_000 },
    ],
  },
  {
    id: 'ORD-2026-003',
    userId: 'seed_user_3',
    customerName: 'Lê Văn Đức',
    customerEmail: 'vanduc@email.vn',
    recipientName: 'Lê Văn Đức',
    recipientPhone: '',
    shippingAddress: 'TP. Hồ Chí Minh, Việt Nam',
    paymentMethod: 'COD',
    totalAmount: 268_000_000,
    pointsEarned: 268_000,
    status: 'SHIPPED',
    createdAt: new Date('2026-05-28T09:00:00'),
    items: [
      { productId: 'imperial-dragon-bracelet', productName: 'Vòng Rồng Hoàng Gia', quantity: 1, unitPrice: 268_000_000 },
    ],
  },
  {
    id: 'ORD-2026-004',
    userId: 'seed_user_1',
    customerName: 'Nguyễn Minh Anh',
    customerEmail: 'minhanh@email.vn',
    customerPhone: '0901234567',
    recipientName: 'Nguyễn Minh Anh',
    recipientPhone: '0901234567',
    shippingAddress: 'TP. Hồ Chí Minh, Việt Nam',
    paymentMethod: 'COD',
    totalAmount: 320_000_000,
    pointsEarned: 320_000,
    status: 'COMPLETED',
    createdAt: new Date('2026-05-20T08:45:00'),
    items: [
      { productId: 'lotus-dream-pillow-set', productName: 'Bộ Gối Lotus Dream', quantity: 1, unitPrice: 320_000_000 },
    ],
  },
  {
    id: 'ORD-2026-005',
    userId: 'seed_user_4',
    customerName: 'Phạm Quốc Bảo',
    customerEmail: 'quocbao@email.vn',
    customerPhone: '0923456789',
    recipientName: 'Phạm Quốc Bảo',
    recipientPhone: '0923456789',
    shippingAddress: 'TP. Hồ Chí Minh, Việt Nam',
    paymentMethod: 'COD',
    totalAmount: 450_000_000,
    pointsEarned: 450_000,
    status: 'CANCELLED',
    createdAt: new Date('2026-05-15T12:00:00'),
    items: [
      { productId: 'dong-son-leather-bag', productName: 'Túi Da Dong Son', quantity: 1, unitPrice: 450_000_000 },
    ],
  },
] as const;

async function main() {
  await prisma.pointsLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  for (const seed of SEED_USERS) {
    const baziReport = generateBaziReport(seed.birthDate, undefined, seed.gender as 'MALE' | 'FEMALE');
    await prisma.user.create({
      data: {
        id: seed.id,
        surname: seed.surname,
        givenName: seed.givenName,
        fullName: `${seed.surname} ${seed.givenName}`,
        gender: seed.gender,
        birthDate: seed.birthDate,
        bloodType: seed.bloodType,
        email: seed.email,
        password: seed.password,
        phone: 'phone' in seed ? seed.phone : null,
        zalo: seed.zalo,
        messenger: 'messenger' in seed ? seed.messenger : null,
        tiktok: 'tiktok' in seed ? seed.tiktok : null,
        baziReport: JSON.stringify(baziReport),
        locale: seed.locale,
        points: seed.points,
        tier: seed.tier,
        vip: seed.vip,
        blacklist: seed.blacklist,
        createdAt: new Date('2026-01-01'),
      },
    });

    await prisma.pointsLog.create({
      data: {
        userId: seed.id,
        amount: 100,
        reason: 'register',
        balance: 100,
        createdAt: new Date('2026-01-01'),
      },
    });

    if (seed.points > 100) {
      await prisma.pointsLog.create({
        data: {
          userId: seed.id,
          amount: seed.points - 100,
          reason: 'purchase',
          balance: seed.points,
          createdAt: new Date('2026-01-15'),
        },
      });
    }
  }

  for (const product of ALL_PRODUCTS) {
    await prisma.product.create({
      data: {
        id: product.id,
        nameVi: product.name.vi,
        nameFr: product.name.fr ?? null,
        nameEn: product.name.en ?? null,
        nameKo: product.name.ko ?? null,
        nameJa: product.name.ja ?? null,
        nameZh: product.name.zh ?? null,
        descVi: product.description.vi,
        descFr: product.description.fr ?? null,
        descEn: product.description.en ?? null,
        descKo: product.description.ko ?? null,
        descJa: product.description.ja ?? null,
        descZh: product.description.zh ?? null,
        productLine: product.productLine,
        price: product.price,
        elements: JSON.stringify(product.elements),
        zodiacs: JSON.stringify(product.zodiacs),
        gender: product.gender,
        tryOnCategory: product.tryOnCategory ?? null,
        overlayScale: product.overlayScale ?? null,
      },
    });
  }

  for (const order of SEED_ORDERS) {
    await prisma.order.create({
      data: {
        id: order.id,
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: 'customerPhone' in order ? order.customerPhone ?? null : null,
        recipientName: order.recipientName,
        recipientPhone: order.recipientPhone,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        pointsEarned: order.pointsEarned,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.createdAt,
        items: {
          create: order.items.map((item) => ({ ...item })),
        },
      },
    });
  }

  console.log(`Seeded ${SEED_USERS.length} users, ${ALL_PRODUCTS.length} products, ${SEED_ORDERS.length} orders`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
