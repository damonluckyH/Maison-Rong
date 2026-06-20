export type TryOnCategory = 'ring' | 'bracelet' | 'necklace';

export interface LandmarkResult {
  wrist: { x: number; y: number } | null;
  indexFinger: { x: number; y: number } | null;
  middleFinger: { x: number; y: number } | null;
  ringFinger: { x: number; y: number } | null;
  neck: { x: number; y: number } | null;
  imageWidth: number;
  imageHeight: number;
}

export interface ManualMarker {
  x: number;
  y: number;
}

export type OverlayTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
};

const WASM_CDN =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';

let handLandmarkerPromise: Promise<import('@mediapipe/tasks-vision').HandLandmarker | null> | null = null;

async function getHandLandmarker() {
  if (!handLandmarkerPromise) {
    handLandmarkerPromise = (async () => {
      try {
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'IMAGE',
          numHands: 2,
        });
      } catch {
        return null;
      }
    })();
  }
  return handLandmarkerPromise;
}

export async function detectLandmarks(imageElement: HTMLImageElement): Promise<LandmarkResult> {
  const result: LandmarkResult = {
    wrist: null,
    indexFinger: null,
    middleFinger: null,
    ringFinger: null,
    neck: null,
    imageWidth: imageElement.naturalWidth,
    imageHeight: imageElement.naturalHeight,
  };

  const landmarker = await getHandLandmarker();
  if (!landmarker) return result;

  try {
    const detection = landmarker.detect(imageElement);
    const hand = detection.landmarks[0];
    if (!hand) return result;

    const toPoint = (idx: number) => ({
      x: hand[idx].x * imageElement.naturalWidth,
      y: hand[idx].y * imageElement.naturalHeight,
    });

    result.wrist = toPoint(0);
    result.indexFinger = toPoint(5);
    result.middleFinger = toPoint(9);
    result.ringFinger = toPoint(13);
  } catch {
    // fall through — caller uses manual picker
  }

  return result;
}

export function getMarkerForCategory(
  landmarks: LandmarkResult,
  category: TryOnCategory,
): ManualMarker | null {
  switch (category) {
    case 'ring':
      return landmarks.ringFinger ?? landmarks.middleFinger ?? landmarks.indexFinger;
    case 'bracelet':
      return landmarks.wrist;
    case 'necklace':
      return landmarks.neck;
    default:
      return null;
  }
}

export function getDefaultOverlayScale(category: TryOnCategory, imageWidth: number): number {
  const base = imageWidth;
  switch (category) {
    case 'ring':
      return base * 0.08;
    case 'bracelet':
      return base * 0.18;
    case 'necklace':
      return base * 0.14;
  }
}

export function drawProductOverlay(
  ctx: CanvasRenderingContext2D,
  category: TryOnCategory,
  transform: OverlayTransform,
): void {
  const { x, y, scale, rotation, opacity } = transform;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);

  const gold = '#D4A843';
  const goldLight = '#F0D68A';
  const red = '#C41E3A';
  const jade = '#2E8B57';

  switch (category) {
    case 'ring':
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 50, 0, 0, Math.PI * 2);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 35, 0, 0, Math.PI * 2);
      ctx.fillStyle = red;
      ctx.globalAlpha = opacity * 0.7;
      ctx.fill();
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.ellipse(0, -8, 12, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = goldLight;
      ctx.fill();
      break;

    case 'bracelet':
      ctx.beginPath();
      ctx.ellipse(0, 0, 80, 35, 0, 0, Math.PI * 2);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, 70, 28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = jade;
      ctx.lineWidth = 3;
      ctx.globalAlpha = opacity * 0.5;
      ctx.stroke();
      ctx.globalAlpha = opacity;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * 75, Math.sin(angle) * 32, 4, 0, Math.PI * 2);
        ctx.fillStyle = goldLight;
        ctx.fill();
      }
      break;

    case 'necklace':
      ctx.beginPath();
      ctx.moveTo(-60, -20);
      ctx.quadraticCurveTo(0, 30, 60, -20);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(0, 45);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 45);
      ctx.lineTo(-15, 70);
      ctx.lineTo(15, 70);
      ctx.closePath();
      ctx.fillStyle = red;
      ctx.globalAlpha = opacity * 0.8;
      ctx.fill();
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 58, 8, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = goldLight;
      ctx.fill();
      break;
  }

  ctx.restore();
}

export function renderComposite(
  ctx: CanvasRenderingContext2D,
  photo: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  category: TryOnCategory,
  transform: OverlayTransform | null,
): { drawWidth: number; drawHeight: number; offsetX: number; offsetY: number } {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const scale = Math.min(canvasWidth / photo.naturalWidth, canvasHeight / photo.naturalHeight);
  const drawWidth = photo.naturalWidth * scale;
  const drawHeight = photo.naturalHeight * scale;
  const offsetX = (canvasWidth - drawWidth) / 2;
  const offsetY = (canvasHeight - drawHeight) / 2;

  ctx.drawImage(photo, offsetX, offsetY, drawWidth, drawHeight);

  if (transform) {
    drawProductOverlay(ctx, category, transform);
  }

  return { drawWidth, drawHeight, offsetX, offsetY };
}

export function canvasToImageCoords(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement,
  layout: { drawWidth: number; drawHeight: number; offsetX: number; offsetY: number },
): ManualMarker | null {
  const rect = canvas.getBoundingClientRect();
  const cx = ((clientX - rect.left) / rect.width) * canvas.width;
  const cy = ((clientY - rect.top) / rect.height) * canvas.height;

  if (
    cx < layout.offsetX ||
    cx > layout.offsetX + layout.drawWidth ||
    cy < layout.offsetY ||
    cy > layout.offsetY + layout.drawHeight
  ) {
    return null;
  }

  return { x: cx, y: cy };
}

export function saveTryOnImage(
  photo: HTMLImageElement,
  category: TryOnCategory,
  transform: OverlayTransform,
  productId: string,
): void {
  const canvas = document.createElement('canvas');
  canvas.width = photo.naturalWidth;
  canvas.height = photo.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(photo, 0, 0);
  const scaleFactor = photo.naturalWidth / 600;
  drawProductOverlay(ctx, category, {
    ...transform,
    x: (transform.x - 0) * (photo.naturalWidth / 600),
    y: (transform.y - 0) * (photo.naturalWidth / 600),
    scale: transform.scale * scaleFactor,
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `maison-lac-tryon-${productId}-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, 'image/png');
}

export function saveCompositeCanvas(
  canvas: HTMLCanvasElement,
  productId: string,
): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `maison-lac-tryon-${productId}-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(link.href);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const key = `maison-lac-tryon-${productId}`;
        localStorage.setItem(key, reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch {
      // localStorage optional
    }
  }, 'image/png');
}
