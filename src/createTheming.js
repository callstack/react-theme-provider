/* @flow */

import createThemeProvider from './createThemeProvider';
import createWithTheme from './createWithTheme';
import type { WithThemeType } from './createWithTheme';
import type { ThemeProviderType } from './createThemeProvider';

let id = 0;

export type ThemingType<T> = {
  ThemeProvider: ThemeProviderType<T>,
  withTheme: WithThemeType<T>,
};

export default function createTheming<T>(defaultTheme: T): ThemingType<T> {
  const channelName = `react-theme-provider-${id++}$theme`;

  const ThemeProvider: ThemeProviderType<T> = createThemeProvider(
    defaultTheme,
    channelName
  );
  const withTheme: WithThemeType<T> = createWithTheme(
    ThemeProvider,
    channelName
  );

  return {
    ThemeProvider,
    withTheme,
  };
}
