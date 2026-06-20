'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Product, TryOnCategory } from '@/lib/products';
import type { OverlayTransform } from '@/lib/mediapipe';
import {
  canvasToImageCoords,
  detectLandmarks,
  drawProductOverlay,
  getDefaultOverlayScale,
  getMarkerForCategory,
  renderComposite,
  saveCompositeCanvas,
} from '@/lib/mediapipe';

interface VirtualTryOnProps {
  productId: string;
  productName: string;
  category: TryOnCategory;
  overlayScale?: number;
  tryOnProducts: Product[];
  locale: string;
  onClose: () => void;
  onProductChange: (product: Product) => void;
}

type Layout = { drawWidth: number; drawHeight: number; offsetX: number; offsetY: number };

const CANVAS_W = 640;
const CANVAS_H = 480;

export default function VirtualTryOn({
  productId,
  productName,
  category,
  overlayScale = 1,
  tryOnProducts,
  onClose,
  onProductChange,
}: VirtualTryOnProps) {
  const t = useTranslations('tryOn');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const layoutRef = useRef<Layout>({ drawWidth: 0, drawHeight: 0, offsetX: 0, offsetY: 0 });

  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<OverlayTransform | null>(null);
  const [opacity, setOpacity] = useState(0.85);
  const [scaleMul, setScaleMul] = useState(overlayScale);
  const [placing, setPlacing] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);

  const loadPhoto = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      setPhoto(img);
      setTransform(null);
      setPlacing(true);
      setScaleMul(overlayScale);
    };
    img.src = url;
  }, [overlayScale]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !photo) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const layout = renderComposite(
      ctx,
      photo,
      canvas.width,
      canvas.height,
      category,
      transform ? { ...transform, opacity } : null,
    );
    layoutRef.current = layout;

    if (placing && !transform) {
      ctx.save();
      ctx.fillStyle = 'rgba(212,168,67,0.7)';
      ctx.font = '13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t('tapToPlace'), canvas.width / 2, canvas.height - 16);
      ctx.restore();
    }
  }, [photo, transform, opacity, category, placing, t]);

  useEffect(() => {
    paint();
  }, [paint]);

  useEffect(() => {
    setScaleMul(overlayScale);
  }, [overlayScale, productId]);

  const placeAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !photo) return;
    const point = canvasToImageCoords(clientX, clientY, canvas, layoutRef.current);
    if (!point) return;

    const base = getDefaultOverlayScale(category, layoutRef.current.drawWidth) / 50;
    setTransform({
      x: point.x,
      y: point.y,
      scale: base * scaleMul,
      rotation: 0,
      opacity,
    });
    setPlacing(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!photo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    if (!transform || placing) {
      placeAt(e.clientX, e.clientY);
      return;
    }

    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging || !dragStart.current || !transform) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.current.x) / rect.width) * CANVAS_W;
    const dy = ((e.clientY - dragStart.current.y) / rect.height) * CANVAS_H;
    setTransform({ ...transform, x: dragStart.current.tx + dx, y: dragStart.current.ty + dy });
  };

  const handlePointerUp = () => {
    setDragging(false);
    dragStart.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2 && transform) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (!pinchStart.current) {
        pinchStart.current = { dist, scale: transform.scale };
      } else {
        const ratio = dist / pinchStart.current.dist;
        setTransform({ ...transform, scale: pinchStart.current.scale * ratio });
        setScaleMul((pinchStart.current.scale * ratio) / (getDefaultOverlayScale(category, layoutRef.current.drawWidth) / 50));
      }
    }
  };

  const handleTouchEnd = () => {
    pinchStart.current = null;
  };

  const handleAutoDetect = async () => {
    if (!photo) return;
    setDetecting(true);
    try {
      const landmarks = await detectLandmarks(photo);
      let marker = getMarkerForCategory(landmarks, category);

      if (!marker && category === 'necklace') {
        marker = {
          x: layoutRef.current.offsetX + layoutRef.current.drawWidth * 0.5,
          y: layoutRef.current.offsetY + layoutRef.current.drawHeight * 0.35,
        };
      }

      if (marker) {
        const canvas = canvasRef.current!;
        const scaleX = canvas.width / photo.naturalWidth;
        const scaleY = canvas.height / photo.naturalHeight;
        const s = Math.min(scaleX, scaleY);
        const ox = (canvas.width - photo.naturalWidth * s) / 2;
        const oy = (canvas.height - photo.naturalHeight * s) / 2;
        const base = getDefaultOverlayScale(category, layoutRef.current.drawWidth) / 50;
        setTransform({
          x: marker.x * s + ox,
          y: marker.y * s + oy,
          scale: base * scaleMul,
          rotation: 0,
          opacity,
        });
        setPlacing(false);
      }
    } finally {
      setDetecting(false);
    }
  };

  const handleReset = () => {
    setTransform(null);
    setPlacing(true);
    setScaleMul(overlayScale);
    setOpacity(0.85);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !photo) return;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = photo.naturalWidth;
    exportCanvas.height = photo.naturalHeight;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx || !transform) return;

    ctx.drawImage(photo, 0, 0);
    const layout = layoutRef.current;
    const ratio = photo.naturalWidth / layout.drawWidth;
    drawProductOverlay(ctx, category, {
      x: (transform.x - layout.offsetX) * ratio,
      y: (transform.y - layout.offsetY) * ratio,
      scale: transform.scale * ratio,
      rotation: transform.rotation,
      opacity,
    });
    saveCompositeCanvas(exportCanvas, productId);
  };

  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      const snap = document.createElement('canvas');
      snap.width = video.videoWidth;
      snap.height = video.videoHeight;
      snap.getContext('2d')!.drawImage(video, 0, 0);
      stream.getTracks().forEach((tr) => tr.stop());
      snap.toBlob((blob) => {
        if (blob) loadPhoto(new File([blob], 'camera.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg');
    } catch {
      alert(t('cameraDenied'));
    }
  };

  useEffect(() => {
    if (!transform || !photo) return;
    const base = getDefaultOverlayScale(category, layoutRef.current.drawWidth) / 50;
    setTransform((prev) =>
      prev ? { ...prev, scale: base * scaleMul, opacity } : prev,
    );
  }, [scaleMul, opacity, category, photo]);

  const sameCategoryProducts = tryOnProducts.filter((p) => p.tryOnCategory === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/95 p-4">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-brand-gold/30 bg-brand-black-light shadow-2xl">
        <div className="flex items-center justify-between border-b border-brand-gold/15 px-5 py-3">
          <h2 className="font-serif text-brand-gold-light text-lg tracking-wide">{t('title')}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 transition hover:text-brand-gold">
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-auto lg:flex-row">
          <div className="flex flex-1 flex-col p-4">
            {!photo ? (
              <div
                className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-brand-gold/25 bg-brand-black p-8"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file?.type.startsWith('image/')) loadPhoto(file);
                }}
              >
                <p className="text-gray-500 text-sm">{t('uploadHint')}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="btn-gold rounded px-6 py-2.5 text-sm tracking-widest text-brand-black uppercase"
                  >
                    {t('upload')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCamera}
                    className="rounded border border-brand-gold/40 px-6 py-2.5 text-sm text-brand-gold tracking-widest"
                  >
                    {t('camera')}
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) loadPhoto(file);
                  }}
                />
              </div>
            ) : (
              <div className="relative flex-1">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="h-auto w-full touch-none rounded-lg border border-brand-gold/15"
                  style={{ maxHeight: '60vh' }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded border border-brand-gold/20 px-3 py-1.5 text-xs text-gray-400"
                  >
                    {t('changePhoto')}
                  </button>
                  <button
                    type="button"
                    onClick={handleAutoDetect}
                    disabled={detecting}
                    className="rounded border border-brand-gold/20 px-3 py-1.5 text-xs text-brand-gold disabled:opacity-40"
                  >
                    {detecting ? t('detecting') : t('autoDetect')}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) loadPhoto(file);
                }} />
              </div>
            )}
          </div>

          <div className="w-full border-t border-brand-gold/15 p-4 lg:w-72 lg:border-t-0 lg:border-l">
            <p className="mb-1 text-xs text-gray-500 uppercase tracking-widest">{t('product')}</p>
            <p className="mb-4 font-serif text-brand-gold-light text-sm">{productName}</p>

            <div className="mb-4 max-h-32 space-y-1 overflow-y-auto">
              {sameCategoryProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onProductChange(p)}
                  className={`block w-full rounded px-2 py-1.5 text-left text-xs transition ${
                    p.id === productId
                      ? 'bg-brand-gold/15 text-brand-gold'
                      : 'text-gray-500 hover:bg-brand-black hover:text-brand-gold-light'
                  }`}
                >
                  {p.name.vi}
                </button>
              ))}
            </div>

            <label className="mb-1 block text-xs text-gray-500">{t('opacity')}</label>
            <input
              type="range"
              min={0.3}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="mb-4 w-full accent-brand-gold"
            />

            <label className="mb-1 block text-xs text-gray-500">{t('scale')}</label>
            <input
              type="range"
              min={0.4}
              max={2.5}
              step={0.05}
              value={scaleMul}
              onChange={(e) => setScaleMul(parseFloat(e.target.value))}
              className="mb-4 w-full accent-brand-gold"
            />

            <button
              type="button"
              onClick={handleReset}
              className="mb-4 w-full rounded border border-brand-gold/20 py-2 text-xs text-gray-400 tracking-widest"
            >
              {t('reset')}
            </button>
          </div>
        </div>

        <div className="flex gap-3 border-t border-brand-gold/15 p-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={!photo || !transform}
            className="btn-gold flex-1 rounded py-3 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-40"
          >
            {t('save')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded border border-brand-gold/30 py-3 text-sm text-brand-gold tracking-widest"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
