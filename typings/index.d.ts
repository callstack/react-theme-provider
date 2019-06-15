// Type definitions for @callstack/react-theme-provider 1.0.2
// TypeScript version 3.0.3

import * as React from 'react';

// Static hoisting
interface REACT_STATICS {
  childContextTypes: true;
  contextType: true;
  contextTypes: true;
  defaultProps: true;
  displayName: true;
  getDefaultProps: true;
  getDerivedStateFromError: true;
  getDerivedStateFromProps: true;
  mixins: true;
  propTypes: true;
  type: true;
}

interface KNOWN_STATICS {
  name: true;
  length: true;
  prototype: true;
  caller: true;
  callee: true;
  arguments: true;
  arity: true;
}

interface MEMO_STATICS {
  $$typeof: true;
  compare: true;
  defaultProps: true;
  displayName: true;
  propTypes: true;
  type: true;
}

interface FORWARD_REF_STATICS {
  $$typeof: true;
  render: true;
  defaultProps: true;
  displayName: true;
  propTypes: true;
}

type NonReactStatics<
  S extends React.ComponentType<any>,
  C extends {
    [key: string]: true;
  } = {}
> = {
  [key in Exclude<
    keyof S,
    S extends React.MemoExoticComponent<any>
      ? keyof MEMO_STATICS | keyof C
      : S extends React.ForwardRefExoticComponent<any>
      ? keyof FORWARD_REF_STATICS | keyof C
      : keyof REACT_STATICS | keyof KNOWN_STATICS | keyof C
  >]: S[key]
};

type $Without<T, K> = Pick<T, Exclude<keyof T, K>>;
type $DeepPartial<T> = { [P in keyof T]?: $DeepPartial<T[P]> };

export type ThemingType<Theme> = {
  ThemeProvider: React.ComponentType<{ theme?: Theme }>;
  withTheme: <Props extends { theme: Theme }, C>(
    WrappedComponent: React.ComponentType<Props> & C
  ) => React.ComponentType<
    $Without<Props, 'theme'> & { theme?: $DeepPartial<Theme> }
  > &
    NonReactStatics<typeof WrappedComponent>;
  useTheme(overrides?: $DeepPartial<Theme>): Theme;
};

export const createTheming: <Theme>(defaultTheme: Theme) => ThemingType<Theme>;
