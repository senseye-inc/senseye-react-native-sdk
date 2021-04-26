type FontSize = 'x10' | 'x20' | 'x30' | 'x40' | 'x50' | 'x60' | 'x70';
export const fontSize: Record<FontSize, number> = {
  x10: 13,
  x20: 14,
  x30: 16,
  x40: 19,
  x50: 24,
  x60: 32,
  x70: 38,
};
type LineHeight = 'x5' | 'x10' | 'x20' | 'x30' | 'x40' | 'x50' | 'x60' | 'x70';
export const lineHeight: Record<LineHeight, number> = {
  x5: 15,
  x10: 20,
  x20: 22,
  x30: 24,
  x40: 26,
  x50: 32,
  x60: 38,
  x70: 44,
};

export const header = {
  fontStyle: 'normal' as 'normal',
  fontWeight: 'bold' as 'bold',
  fontSize: fontSize.x10,
  lineHeight: lineHeight.x5,
  textAlign: 'center' as 'center',
  textTransform: 'uppercase' as 'uppercase',
  marginBottom: 10,
};
export const text = {
  fontStyle: 'normal' as 'normal',
  fontWeight: 'normal' as 'normal',
  fontSize: fontSize.x10,
  lineHeight: lineHeight.x5,
  textAlign: 'center' as 'center',
  marginBottom: 10,
};
