import { NextRequest, NextResponse } from 'next/server';
import { ALL_PRODUCTS, createProduct, updateProduct, deleteProduct, type Product } from '@/lib/products';
import { requireAdminRequest, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();
  return NextResponse.json({ products: ALL_PRODUCTS });
}

export async function POST(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();

  const body = await request.json() as Product;
  if (!body.id || !body.name?.vi || body.price == null) {
    return NextResponse.json({ error: 'Thiếu thông tin sản phẩm' }, { status: 400 });
  }

  try {
    const product = createProduct(body);
    return NextResponse.json({ product, products: ALL_PRODUCTS });
  } catch {
    return NextResponse.json({ error: 'Mã sản phẩm đã tồn tại' }, { status: 409 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();

  const body = await request.json();
  const { id, ...data } = body as { id?: string } & Partial<Product>;

  if (!id) return NextResponse.json({ error: 'Thiếu mã sản phẩm' }, { status: 400 });

  const product = updateProduct(id, data);
  if (!product) return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });

  return NextResponse.json({ product, products: ALL_PRODUCTS });
}

export async function DELETE(request: NextRequest) {
  if (!requireAdminRequest(request)) return unauthorizedResponse();

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Thiếu mã sản phẩm' }, { status: 400 });

  const ok = deleteProduct(id);
  if (!ok) return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });

  return NextResponse.json({ success: true, products: ALL_PRODUCTS });
}
