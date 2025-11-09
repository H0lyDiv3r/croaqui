export const toHMS = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};

export interface HSL {
  h: number; // 0–360
  s: number; // 0–1
  l: number; // 0–1
}

export interface RGB {
  r: number; // 0–255
  g: number; // 0–255
  b: number; // 0–255
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return { h, s, l };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - C / 2;

  let r1 = 0,
    g1 = 0,
    b1 = 0;

  if (0 <= h && h < 60) [r1, g1, b1] = [C, X, 0];
  else if (60 <= h && h < 120) [r1, g1, b1] = [X, C, 0];
  else if (120 <= h && h < 180) [r1, g1, b1] = [0, C, X];
  else if (180 <= h && h < 240) [r1, g1, b1] = [0, X, C];
  else if (240 <= h && h < 300) [r1, g1, b1] = [X, 0, C];
  else if (300 <= h && h < 360) [r1, g1, b1] = [C, 0, X];

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}
export const getComplementaryColor = (rgb: string): string => {
  const match = rgb.slice(4, -1).split(",");
  let r1 = Number(match[0]);
  let g1 = Number(match[1]);
  let b1 = Number(match[2]);

  let { h, s, l } = rgbToHsl(r1, g1, b1);

  // 1. Rotate hue to complementary
  h = (h + 180) % 360;

  // 2. Boost saturation a bit for stronger pop
  s = Math.min(1, s * 1.2);

  l = l >= 0.7 ? Math.max(0.1, l - 0.4) : Math.max(0.9, l + 0.3);

  console.log("this is the old and new", h, s, l);

  const { r, g, b } = hslToRgb(h, s, l);
  return `rgb(${r}, ${g}, ${b})`;
};
