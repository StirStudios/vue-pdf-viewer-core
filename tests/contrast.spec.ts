import { describe, expect, it } from "vitest";

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return [r, g, b];
}

function toLinear(channel: number): number {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Theme contrast guardrails", () => {
  it("meets AA text contrast for light mode toolbar/menu text", () => {
    const ratio = contrastRatio("#1f1f1f", "#e9e9e9");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("meets AA text contrast for dark mode toolbar/menu text", () => {
    const ratio = contrastRatio("#f5f5f5", "#3a3a3a");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps error text contrast readable in both themes", () => {
    const lightErrorRatio = contrastRatio("#b42318", "#e9e9e9");
    const darkErrorRatio = contrastRatio("#fda29b", "#2b2b2b");

    expect(lightErrorRatio).toBeGreaterThanOrEqual(4.5);
    expect(darkErrorRatio).toBeGreaterThanOrEqual(4.5);
  });
});
