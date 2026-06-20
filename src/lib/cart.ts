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

const carts = new Map<string, Cart>();

function getOrCreateCart(userId: string): Cart {
  let cart = carts.get(userId);
  if (!cart) {
    cart = { userId, items: [] };
    carts.set(userId, cart);
  }
  return cart;
}

export function getCart(userId: string): Cart {
  return { ...getOrCreateCart(userId), items: [...getOrCreateCart(userId).items] };
}

export function getCartItemCount(userId: string): number {
  return getOrCreateCart(userId).items.reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(userId: string, productId: string, quantity: number): Cart {
  const cart = getOrCreateCart(userId);
  const qty = Math.max(1, quantity);
  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({ productId, quantity: qty });
  }
  return getCart(userId);
}

export function removeFromCart(userId: string, productId: string): Cart {
  const cart = getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => i.productId !== productId);
  return getCart(userId);
}

export function updateQuantity(userId: string, productId: string, quantity: number): Cart {
  const cart = getOrCreateCart(userId);
  const item = cart.items.find((i) => i.productId === productId);
  if (!item) return getCart(userId);
  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
  } else {
    item.quantity = quantity;
  }
  return getCart(userId);
}

export function clearCart(userId: string): void {
  carts.set(userId, { userId, items: [] });
}

export function getCartTotal(userId: string): number {
  const cart = getOrCreateCart(userId);
  return cart.items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);
}

export function getCartLineItems(userId: string, locale = 'vi'): CartLineItem[] {
  const cart = getOrCreateCart(userId);
  return cart.items
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
