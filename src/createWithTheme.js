/* @flow */

import * as React from 'react';
import deepmerge from 'deepmerge';
import hoistNonReactStatics from 'hoist-non-react-statics';

import type { Context } from 'create-react-context';

import { copyRefs } from './utils';

import type { ThemeProviderType } from './createThemeProvider';

const isClassComponent = (Component: any) =>
  Boolean(Component.prototype && Component.prototype.isReactComponent);

export type WithThemeType<T, S> = <P, C: React.ComponentType<P>>(
  Comp: C
) => C &
  React.ComponentType<
    $Diff<React.ElementConfig<C>, { theme: T }> & { theme?: S }
  >;

const createWithTheme = <T, S>(
  ThemeProvider: ThemeProviderType<T>,
  ThemeContext: Context<T>
) =>
  function withTheme(Comp: *) {
    class ThemedComponent extends React.Component<*> {
      /* $FlowFixMe */
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
        const { forwardedRef, ...rest } = this.props;
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
                    {...rest}
                    ref={c => {
                      this._root = c;
                    }}
                    theme={merged}
                  />
                );
              } else {
                element = <Comp {...rest} theme={merged} />;
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

    let ComponentWithMethods = ThemedComponent;
    if (isClassComponent(Comp)) {
      // getWrappedInstance is exposed by some HOCs like react-redux's connect
      // Use it to get the ref to the underlying element
      // Also expose it to access the underlying element after wrapping
      // $FlowFixMe
      ComponentWithMethods.prototype.getWrappedInstance = function getWrappedInstance() {
        return this._root.getWrappedInstance
          ? this._root.getWrappedInstance()
          : this._root;
      };

      ComponentWithMethods = copyRefs(ComponentWithMethods, Comp);
    }

    hoistNonReactStatics(ComponentWithMethods, Comp);

    return (ComponentWithMethods: any);
  };

export default createWithTheme;
