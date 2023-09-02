// Type definitions for @callstack/react-theme-provider 1.0.2
// TypeScript version 3.0.3

import * as React from 'react';
import hoistNonReactStatics = require('./hoist-non-react-statics');

type $Without<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
type $DeepPartial<T> = { [P in keyof T]?: $DeepPartial<T[P]> };

export type ThemedComponent<Theme, Props extends { theme: Theme }> = React.ComponentType<
  $Without<Props, 'theme'> & { theme?: $DeepPartial<Theme> }
> & hoistNonReactStatics.NonReactStatics<typeof WrappedComponent>;

export type ThemingType<Theme> = {
  ThemeProvider: React.ComponentType<{children: React.ReactNode, theme?: Theme }>;
  withTheme: <Props extends { theme: Theme }, C>(
    WrappedComponent: React.ComponentType<Props> & C
  ) => ThemedComponent<Theme, Props>
  useTheme<T = Theme>(overrides?: $DeepPartial<T>): T;
};

export const createTheming: <Theme>(defaultTheme: Theme) => ThemingType<Theme>;
