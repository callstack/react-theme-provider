/* @flow */

import createTheming from './createTheming';

const { ThemeProvider, withTheme } = createTheming({});

export { ThemeProvider, withTheme, createTheming };
export type { ThemingType } from './createTheming';
