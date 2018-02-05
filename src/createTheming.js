/* @flow */

import createThemeProvider from './createThemeProvider';
import createWithTheme from './createWithTheme';
import type { WithThemeType } from './createWithTheme';
import type { ThemeProviderType } from './createThemeProvider';

export type ThemingType<T> = {
  ThemeProvider: ThemeProviderType<T>,
  withTheme: WithThemeType<T>,
};

export default function createTheming<T>(defaultTheme: T): ThemingType<T> {
  const ThemeProvider: ThemeProviderType<T> = createThemeProvider(defaultTheme);
  const withTheme: WithThemeType<T> = createWithTheme();

  return {
    ThemeProvider,
    withTheme,
  };
}
