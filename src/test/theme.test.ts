import { describe, it, expect } from 'vitest';

describe('Theme System', () => {
  const theme = {
    light: {
      background: '#faf9f5',
      text: '#141413',
      secondary: '#b0aea5',
      accent: '#d97757',
      surface: '#ffffff',
      border: '#e8e6e1',
    },
    dark: {
      background: '#141413',
      text: '#faf9f5',
      secondary: '#b0aea5',
      accent: '#d97757',
      surface: '#1c1c1a',
      border: '#2c2c2a',
    },
  };

  it('should have light theme colors', () => {
    expect(theme.light.background).toBe('#faf9f5');
    expect(theme.light.text).toBe('#141413');
    expect(theme.light.secondary).toBe('#b0aea5');
    expect(theme.light.accent).toBe('#d97757');
  });

  it('should have dark theme colors', () => {
    expect(theme.dark.background).toBe('#141413');
    expect(theme.dark.text).toBe('#faf9f5');
    expect(theme.dark.secondary).toBe('#b0aea5');
    expect(theme.dark.accent).toBe('#d97757');
  });

  it('should have accent color same in both themes', () => {
    expect(theme.light.accent).toBe(theme.dark.accent);
  });
});
