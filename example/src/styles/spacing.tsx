/* container for tabbed navigation menu and general containers */
export const container = {
  flex: 1,
  alignItems: 'center' as 'center',
  justifyContent: 'space-evenly' as 'space-evenly',
  padding: 20,
};

/* flexbox centered recipe */
export const centeredFlexView = {
  flex: 1,
  justifyContent: 'center' as 'center',
  alignItems: 'center' as 'center',
};
/* recipe for centering without flex */
export const marginAuto = {
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: 5,
  marginTop: 5,
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
/* footer */
export const footer = {
  paddingLeft: 10,
  paddingRight: 10,
  flex: 3,
  flexDirection: 'row' as 'row',
  alignItems: 'center' as 'center',
  justifyContent: 'space-evenly' as 'space-evenly',
};
