// Type definitions for @callstack/react-theme-provider 1.0.2
// TypeScript version 3.0.3

import * as React from 'react';

type $Without<T, K> = Pick<T, Exclude<keyof T, K>>;
type $DeepPartial<T> = { [P in keyof T]?: $DeepPartial<T[P]> };

export type ThemingType<Theme> = {
  ThemeProvider: React.ComponentType<{ theme?: Theme }>;
  withTheme: <Props extends { theme: Theme }>(
    Comp: React.ComponentType<Props>
  ) => React.ComponentType<
    $Without<Props, 'theme'> & { theme?: $DeepPartial<Theme> }
  >;
};

// Library exports
export const ThemeProvider: ThemingType<object>['ThemeProvider'];
export const withTheme: ThemingType<object>['withTheme'];

export const createTheming: <Theme>(defaultTheme: Theme) => ThemingType<Theme>;
