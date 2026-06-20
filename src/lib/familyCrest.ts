export type CrestStyle = 'dragon' | 'phoenix' | 'lotus' | 'dongson';
export type CrestColorScheme = 'red-gold' | 'black-gold' | 'jade';
export type EmbroideryPosition = 'pillow' | 'duvet-edge' | 'sheet-edge';

export interface CrestConfig {
  surname: string;
  style: CrestStyle;
  colorScheme: CrestColorScheme;
  position: EmbroideryPosition;
}

export interface CrestColors {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
  text: string;
}

export const COLOR_SCHEMES: Record<CrestColorScheme, CrestColors> = {
  'red-gold': {
    primary: '#C41E3A',
    secondary: '#D4A843',
    background: '#1A1A1A',
    accent: '#F0D68A',
    text: '#F0D68A',
  },
  'black-gold': {
    primary: '#1A1A1A',
    secondary: '#D4A843',
    background: '#2A2A2A',
    accent: '#F0D68A',
    text: '#D4A843',
  },
  jade: {
    primary: '#2E8B57',
    secondary: '#D4A843',
    background: '#1A1A1A',
    accent: '#F0D68A',
    text: '#F0D68A',
  },
};

export function getInitialLetter(surname: string): string {
  const trimmed = surname.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}

function stylePattern(style: CrestStyle, letter: string, colors: CrestColors): string {
  const { primary, secondary, accent } = colors;

  switch (style) {
    case 'dragon':
      return `
        <circle cx="100" cy="90" r="70" fill="none" stroke="${secondary}" stroke-width="1.5" opacity="0.4"/>
        <path d="M35 130 Q50 50 100 65 Q150 80 165 45 Q170 90 130 110 Q100 125 65 115 Q40 105 35 130"
          fill="none" stroke="${secondary}" stroke-width="2.5"/>
        <path d="M45 120 Q70 75 100 85 Q130 95 155 70" fill="none" stroke="${primary}" stroke-width="1.5" opacity="0.7"/>
        <text x="100" y="100" text-anchor="middle" fill="${accent}" font-family="Cormorant Garamond, serif"
          font-size="48" font-weight="700">${letter}</text>
      `;
    case 'phoenix':
      return `
        <ellipse cx="100" cy="90" rx="65" ry="55" fill="none" stroke="${secondary}" stroke-width="1" opacity="0.3"/>
        <path d="M30 100 Q60 30 100 55 Q140 30 170 100 Q140 130 100 120 Q60 130 30 100"
          fill="none" stroke="${secondary}" stroke-width="2"/>
        <path d="M50 95 Q75 60 100 75 Q125 60 150 95" fill="none" stroke="${primary}" stroke-width="1.5" opacity="0.6"/>
        <text x="100" y="100" text-anchor="middle" fill="${accent}" font-family="Cormorant Garamond, serif"
          font-size="48" font-weight="700">${letter}</text>
      `;
    case 'lotus':
      return `
        <circle cx="100" cy="90" r="60" fill="none" stroke="${secondary}" stroke-width="0.8" opacity="0.3"/>
        ${[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 20 * Math.cos(rad);
          const y1 = 90 + 20 * Math.sin(rad);
          const x2 = 100 + 55 * Math.cos(rad);
          const y2 = 90 + 55 * Math.sin(rad);
          return `<ellipse cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" rx="18" ry="35"
            transform="rotate(${angle} ${(x1 + x2) / 2} ${(y1 + y2) / 2})"
            fill="none" stroke="${secondary}" stroke-width="1.2" opacity="0.7"/>`;
        }).join('')}
        <circle cx="100" cy="90" r="18" fill="${primary}" opacity="0.3"/>
        <text x="100" y="100" text-anchor="middle" fill="${accent}" font-family="Cormorant Garamond, serif"
          font-size="48" font-weight="700">${letter}</text>
      `;
    case 'dongson':
      return `
        <circle cx="100" cy="90" r="65" fill="none" stroke="${secondary}" stroke-width="1" opacity="0.4"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 100 + 60 * Math.cos(rad);
          const y2 = 90 + 60 * Math.sin(rad);
          return `<line x1="100" y1="90" x2="${x2}" y2="${y2}" stroke="${secondary}" stroke-width="0.8" opacity="0.5"/>`;
        }).join('')}
        <circle cx="100" cy="90" r="30" fill="none" stroke="${primary}" stroke-width="2"/>
        <circle cx="100" cy="90" r="12" fill="${secondary}" opacity="0.4"/>
        <text x="100" y="100" text-anchor="middle" fill="${accent}" font-family="Cormorant Garamond, serif"
          font-size="48" font-weight="700">${letter}</text>
      `;
  }
}

export function generateFamilyCrestSvg(config: CrestConfig): string {
  const { surname, style, colorScheme } = config;
  const colors = COLOR_SCHEMES[colorScheme];
  const letter = getInitialLetter(surname);
  const displayName = surname.trim() || 'Gia Tộc';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="${colors.background}" rx="8"/>
    ${stylePattern(style, letter, colors)}
    <text x="100" y="165" text-anchor="middle" fill="${colors.text}"
      font-family="Cormorant Garamond, serif" font-size="18" font-style="italic" letter-spacing="2">
      ${displayName}
    </text>
    <text x="185" y="190" text-anchor="end" fill="${colors.secondary}" opacity="0.6"
      font-family="Cormorant Garamond, serif" font-size="7" letter-spacing="1">
      MAISON LẠC
    </text>
  </svg>`;
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const HERITAGE_BEDDING_PRICE = 1_000_000_000;

const VALID_STYLES: CrestStyle[] = ['dragon', 'phoenix', 'lotus', 'dongson'];
const VALID_COLORS: CrestColorScheme[] = ['red-gold', 'black-gold', 'jade'];
const VALID_POSITIONS: EmbroideryPosition[] = ['pillow', 'duvet-edge', 'sheet-edge'];

export function parseCrestConfig(
  params: Record<string, string | string[] | undefined>,
): CrestConfig | null {
  const surname = typeof params.surname === 'string' ? params.surname.trim() : '';
  const style = params.style as CrestStyle;
  const colorScheme = params.colorScheme as CrestColorScheme;
  const position = params.position as EmbroideryPosition;

  if (
    !surname ||
    !VALID_STYLES.includes(style) ||
    !VALID_COLORS.includes(colorScheme) ||
    !VALID_POSITIONS.includes(position)
  ) {
    return null;
  }

  return { surname, style, colorScheme, position };
}

export function crestConfigToQuery(config: CrestConfig): string {
  return new URLSearchParams({
    surname: config.surname,
    style: config.style,
    colorScheme: config.colorScheme,
    position: config.position,
  }).toString();
}

export function downloadSvgAsPng(svg: string, filename: string): void {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  img.onload = () => {
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 0, 400, 400);
    ctx.drawImage(img, 0, 0, 400, 400);
    URL.revokeObjectURL(url);

    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pngBlob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };
  img.src = url;
}
