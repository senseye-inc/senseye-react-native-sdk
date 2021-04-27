type Primary = 'brand' | 'dark' | 'light';
export const primary: Record<Primary, string> = {
  brand: '#0ea8a4',
  dark: '#28B7FF',
  light: '#00D8BB',
};

type Secondary = 'brand' | 'dark' | 'light';
export const secondary: Record<Secondary, string> = {
  brand: '#2f4374',
  dark: '#141726',
  light: '#22294E',
};
type Tertiary = 'brand' | 'dark' | 'light';
export const tertiary: Record<Tertiary, string> = {
  brand: '#9FB7C6',
  dark: '#29557D',
  light: '#DBEEF1',
};

type Danger = 'brand';
export const danger: Record<Danger, string> = {
  brand: '#cf1717',
};

type Success = 'brand';
export const success: Record<Success, string> = {
  brand: '#008a09',
};

type Warning = 'brand';
export const warning: Record<Warning, string> = {
  brand: '#d7b357',
};
/* adds shadow */
export const shadow = {
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};
