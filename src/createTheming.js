/* @flow */
import createReactContext, { type Context } from 'create-react-context';

import createThemeProvider from './createThemeProvider';
import createWithTheme from './createWithTheme';
import type { WithThemeType } from './createWithTheme';
import type { ThemeProviderType } from './createThemeProvider';

export type ThemingType<T> = {
  ThemeProvider: ThemeProviderType<T>,
  withTheme: WithThemeType<T>,
};

export default function createTheming<T: Object>(
  defaultTheme: T
): ThemingType<T> {
  const ThemeContext: Context<T> = createReactContext(defaultTheme);

  const ThemeProvider: ThemeProviderType<T> = createThemeProvider(
    defaultTheme,
    ThemeContext
  );
  const withTheme: WithThemeType<T> = createWithTheme(
    ThemeProvider,
    ThemeContext
  );

  return {
    ThemeProvider,
    withTheme,
  };
}
