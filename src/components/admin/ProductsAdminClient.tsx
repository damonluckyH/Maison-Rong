'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable, { type Column } from '@/components/admin/DataTable';
import SearchInput from '@/components/admin/SearchInput';
import { formatVnd, type Product, type ProductGender, type ProductLine } from '@/lib/products';
import type { Element } from '@/lib/bazi';

const LOCALES = ['vi', 'en', 'fr', 'ko', 'ja', 'zh'] as const;
const ELEMENTS: Element[] = ['METAL', 'WOOD', 'WATER', 'FIRE', 'EARTH'];
const LINES: ProductLine[] = [
  'dragon-seal',
  'phoenix-grace',
  'turtle-guardian',
  'lotus-dream',
  'dong-son',
  'heritage',
];
const GENDERS: ProductGender[] = ['MALE', 'FEMALE', 'UNISEX'];
const ZODIACS = ['Thìn', 'Thân', 'Tý', 'Dậu', 'Tỵ', 'Sửu', 'Hợi', 'Ngọ', 'Mão', 'Dần', 'Mùi', 'Tuất', 'all'];

const emptyProduct = (): Product => ({
  id: '',
  name: { vi: '', en: '', fr: '', ko: '', ja: '', zh: '' },
  description: { vi: '', en: '', fr: '', ko: '', ja: '', zh: '' },
  productLine: 'dragon-seal',
  price: 0,
  elements: [],
  zodiacs: [],
  gender: 'UNISEX',
  images: [],
});

export default function ProductsAdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(emptyProduct());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data.products ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.vi.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q),
    );
  }, [products, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct());
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm(JSON.parse(JSON.stringify(product)));
    setModalOpen(true);
  };

  const saveProduct = async () => {
    if (!form.id || !form.name.vi) return;

    const res = await fetch('/api/admin/products', {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setModalOpen(false);
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/admin/products?id=${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    load();
  };

  const columns: Column<Product>[] = useMemo(
    () => [
      { key: 'id', header: 'Mã SP', render: (p) => <span className="text-brand-gold text-xs">{p.id}</span> },
      { key: 'name', header: 'Tên (VI)', render: (p) => p.name.vi },
      { key: 'line', header: 'Dòng', render: (p) => p.productLine },
      { key: 'price', header: 'Giá', render: (p) => formatVnd(p.price) },
      { key: 'elements', header: 'Ngũ hành', render: (p) => p.elements.join(', ') },
      {
        key: 'actions',
        header: 'Thao tác',
        render: (p) => (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openEdit(p);
              }}
              className="text-xs text-brand-gold hover:underline"
            >
              Sửa
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(p.id);
              }}
              className="text-xs text-brand-red hover:underline"
            >
              Xóa
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-2xl tracking-widest text-brand-gold">Quản lý sản phẩm</h2>
        <button
          type="button"
          onClick={openCreate}
          className="btn-gold rounded px-4 py-2 text-xs tracking-widest text-brand-black uppercase"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Tìm theo mã hoặc tên..."
        className="mb-4 max-w-md"
      />

      <p className="mb-3 text-xs text-gray-500">{filtered.length} / {products.length} sản phẩm</p>

      <DataTable columns={columns} data={filtered} keyField={(p) => p.id} />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-brand-gold/20 bg-brand-black-light p-6">
            <h3 className="mb-4 font-serif text-xl text-brand-gold">
              {editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Mã sản phẩm</label>
                <input
                  value={form.id}
                  disabled={!!editing}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  className="w-full rounded border border-brand-gold/20 bg-brand-black px-3 py-2 text-sm text-gray-200 disabled:opacity-50"
                />
              </div>

              {LOCALES.map((loc) => (
                <div key={loc}>
                  <label className="mb-1 block text-xs text-gray-500">Tên ({loc.toUpperCase()})</label>
                  <input
                    value={form.name[loc] ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, name: { ...form.name, [loc]: e.target.value } })
                    }
                    className="w-full rounded border border-brand-gold/20 bg-brand-black px-3 py-2 text-sm text-gray-200"
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-xs text-gray-500">Giá (VND)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseInt(e.target.value, 10) || 0 })}
                  className="w-full rounded border border-brand-gold/20 bg-brand-black px-3 py-2 text-sm text-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Dòng sản phẩm</label>
                  <select
                    value={form.productLine}
                    onChange={(e) => setForm({ ...form, productLine: e.target.value as ProductLine })}
                    className="w-full rounded border border-brand-gold/20 bg-brand-black px-3 py-2 text-sm text-gray-200"
                  >
                    {LINES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Giới tính</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as ProductGender })}
                    className="w-full rounded border border-brand-gold/20 bg-brand-black px-3 py-2 text-sm text-gray-200"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">Ngũ hành</label>
                <div className="flex flex-wrap gap-2">
                  {ELEMENTS.map((el) => (
                    <label key={el} className="flex items-center gap-1 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={form.elements.includes(el)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...form.elements, el]
                            : form.elements.filter((x) => x !== el);
                          setForm({ ...form, elements: next });
                        }}
                        className="accent-brand-gold"
                      />
                      {el}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">Giáp chi (Zodiac)</label>
                <div className="flex flex-wrap gap-2">
                  {ZODIACS.map((z) => (
                    <label key={z} className="flex items-center gap-1 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={form.zodiacs.includes(z)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...form.zodiacs, z]
                            : form.zodiacs.filter((x) => x !== z);
                          setForm({ ...form, zodiacs: next });
                        }}
                        className="accent-brand-gold"
                      />
                      {z}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded border border-brand-gold/30 px-4 py-2 text-xs text-gray-400"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={saveProduct}
                className="btn-gold rounded px-4 py-2 text-xs tracking-widest text-brand-black uppercase"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-xl border border-brand-red/30 bg-brand-black-light p-6 text-center">
            <p className="mb-4 text-gray-300">Xác nhận xóa sản phẩm <span className="text-brand-gold">{deleteId}</span>?</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded border border-brand-gold/30 px-4 py-2 text-xs text-gray-400"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded border border-brand-red/50 bg-brand-red/10 px-4 py-2 text-xs text-brand-red"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
