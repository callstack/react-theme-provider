/* @flow */
// import ThemeProvider from './ThemeProvider';
// import withTheme from './withTheme';
import createTheming from './createTheming';
// import type { ThemingType } from './createTheming';

const { ThemeProvider, withTheme } = createTheming({});

export { ThemeProvider, withTheme, createTheming };
export type { ThemingType } from './createTheming';
