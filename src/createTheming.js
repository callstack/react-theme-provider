/* @flow */
import createReactContext, { type Context } from 'create-react-context';

import createThemeProvider from './createThemeProvider';
import createWithTheme from './createWithTheme';
import type { WithThemeType } from './createWithTheme';
import type { ThemeProviderType } from './createThemeProvider';

export type ThemingType<T, S> = {
  ThemeProvider: ThemeProviderType<T>,
  withTheme: WithThemeType<T, S>,
};

export default function createTheming<T, S>(
  defaultTheme: T
): ThemingType<T, S> {
  const ThemeContext: Context<T> = createReactContext(defaultTheme);

  const ThemeProvider: ThemeProviderType<T> = createThemeProvider(
    defaultTheme,
    ThemeContext
  );
  const withTheme: WithThemeType<T, S> = createWithTheme(
    ThemeProvider,
    ThemeContext
  );

  return {
    ThemeProvider,
    withTheme,
  };
}
