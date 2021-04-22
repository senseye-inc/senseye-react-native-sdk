/* container for tabbed navigation menu */
export const container = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-evenly',
  padding: 20,
};

/* nestled child layer for parent container */
export const childContainer = {
  flex: 1,
  justifyContent: 'space-between' as 'space-between',
  margin: 30,
  padding: 30,
};
/* contains main body of content */
export const bodyContainer = {
  flex: 3,
  justifyContent: 'center' as 'center',
  marginTop: 10,
  marginBottom: 10,
};
/* navigation container */
export const navContainer = {
  flex: 0,
  flexDirection: 'row' as 'row',
  justifyContent: 'space-between' as 'space-between',
  marginTop: 10,
  marginBottom: 10,
};
/* logo */
export const logo = {
  alignSelf: 'center' as 'center',
  resizeMode: 'contain' as 'contain',
  margin: 0,
};
