/* @flow */

import * as React from 'react';
import deepmerge from 'deepmerge';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { copyRefs } from './utils';

import type { ThemeProviderType } from './createThemeProvider';

type $DeepShape<O: Object> = $Shape<
  $ObjMap<O, (<V: Object>(V) => $DeepShape<V>) & (<V>(V) => V)>
>;

const isClassComponent = (Component: any) =>
  Boolean(Component.prototype && Component.prototype.isReactComponent);

export type WithThemeType<T> = <P, C: React.ComponentType<P>>(
  Comp: C
) => C &
  React.ComponentType<
    $Diff<React.ElementConfig<C>, { theme: T }> & { theme?: $DeepShape<T> }
  >;

const createWithTheme = <T: Object, S: $DeepShape<T>>(
  ThemeProvider: ThemeProviderType<T>,
  ThemeContext: React.Context<T>
) =>
  function withTheme(Comp: *) {
    class ThemedComponent extends React.Component<*> {
      static displayName = `withTheme(${Comp.displayName || Comp.name})`;

      _previous: ?{ a: T, b: ?S, result: T };

      _merge = (a: T, b: ?S) => {
        const previous = this._previous;

        if (previous && previous.a === a && previous.b === b) {
          return previous.result;
        }

        const result = a && b ? deepmerge(a, b) : a || b;

        this._previous = { a, b, result };

        return result;
      };

      _root: any;

      render() {
        return (
          <ThemeContext.Consumer>
            {theme => {
              const merged = this._merge(theme, this.props.theme);

              let element;
              if (isClassComponent(Comp)) {
                // Only add refs for class components as function components don't support them
                // It's needed to support use cases which need access to the underlying node
                element = (
                  <Comp
                    {...this.props}
                    ref={c => {
                      this._root = c;
                    }}
                    theme={merged}
                  />
                );
              } else {
                element = <Comp {...this.props} theme={merged} />;
              }

              if (merged !== this.props.theme) {
                // If a theme prop was passed, expose it to the children
                return <ThemeProvider theme={merged}>{element}</ThemeProvider>;
              }

              return element;
            }}
          </ThemeContext.Consumer>
        );
      }
    }

    if (isClassComponent(Comp)) {
      // getWrappedInstance is exposed by some HOCs like react-redux's connect
      // Use it to get the ref to the underlying element
      // Also expose it to access the underlying element after wrapping
      // $FlowFixMe
      ThemedComponent.prototype.getWrappedInstance = function getWrappedInstance() {
        return this._root && this._root.getWrappedInstance
          ? this._root.getWrappedInstance()
          : this._root;
      };

      ThemedComponent = copyRefs(ThemedComponent, Comp);
    }

    hoistNonReactStatics(ThemedComponent, Comp);

    return (ThemedComponent: any);
  };

export default createWithTheme;
