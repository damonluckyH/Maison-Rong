import { prisma } from './prisma';
import { getProductById } from './products';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface CartLineItem extends CartItem {
  productName: string;
  unitPrice: number;
  lineTotal: number;
  image?: string;
}

async function fetchCartItems(userId: string): Promise<CartItem[]> {
  const rows = await prisma.cartItem.findMany({ where: { userId } });
  return rows.map((row) => ({ productId: row.productId, quantity: row.quantity }));
}

export async function getCart(userId: string): Promise<Cart> {
  const items = await fetchCartItems(userId);
  return { userId, items: [...items] };
}

export async function getCartItemCount(userId: string): Promise<number> {
  const items = await fetchCartItems(userId);
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
  const qty = Math.max(1, quantity);
  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: existing.quantity + qty },
    });
  } else {
    await prisma.cartItem.create({
      data: { userId, productId, quantity: qty },
    });
  }

  return getCart(userId);
}

export async function removeFromCart(userId: string, productId: string): Promise<Cart> {
  await prisma.cartItem.deleteMany({ where: { userId, productId } });
  return getCart(userId);
}

export async function updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
  } else {
    await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, quantity },
      update: { quantity },
    });
  }
  return getCart(userId);
}

export async function clearCart(userId: string): Promise<void> {
  await prisma.cartItem.deleteMany({ where: { userId } });
}

export async function getCartTotal(userId: string): Promise<number> {
  const items = await fetchCartItems(userId);
  return items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);
}

export async function getCartLineItems(userId: string, locale = 'vi'): Promise<CartLineItem[]> {
  const items = await fetchCartItems(userId);
  return items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      const line: CartLineItem = {
        ...item,
        productName: product.name[locale] ?? product.name.vi,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity,
        image: product.images[0],
      };
      return line;
    })
    .filter((item): item is CartLineItem => item !== null);
}
