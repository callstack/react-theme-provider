/* @flow */

import * as React from 'react';
import merge from 'lodash.merge';
import hoistNonReactStatics from 'hoist-non-react-statics';

import type { Context } from 'create-react-context';

import { copyRefs } from './utils';

const isClassComponent = (Component: Function) => !!Component.prototype.render;

type withThemeReturnType<Theme, Props: {}> = React.ComponentType<
  React.ElementConfig<React.ComponentType<$Diff<Props, { theme: Theme }>>>
>;

export type WithThemeType<T> = <Props: {}>(
  Comp: React.ComponentType<Props>
) => withThemeReturnType<T, Props>;

const createWithTheme = <T>(
  ThemeProvider: React.ComponentType<*>,
  ThemeContext: Context<T>
): WithThemeType<T> =>
  function withTheme<Props: {}>(
    Comp: React.ComponentType<Props>
  ): WithThemeType<T> {
    class ThemedComponent extends React.Component<*> {
      /* $FlowFixMe */
      static displayName = `withTheme(${Comp.displayName || Comp.name})`;

      _previous: ?{ a: T, b: ?$Shape<T>, result: T };
      _merge = (a: T, b: ?$Shape<T>) => {
        const previous = this._previous;

        if (previous && previous.a === a && previous.b === b) {
          return previous.result;
        }

        const result = a && b ? merge(a, b) : a || b;

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
              if (React.forwardRef) {
                element = <Comp {...rest} theme={merged} ref={forwardedRef} />;
              } else if (isClassComponent(Comp)) {
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

      if (React.forwardRef) {
        ComponentWithMethods = React.forwardRef((props, ref) => (
          <ComponentWithMethods {...props} forwardedRef={ref} />
        ));
      } else {
        ComponentWithMethods = copyRefs(ComponentWithMethods, Comp);
      }
    }

    hoistNonReactStatics(ComponentWithMethods, Comp);

    return (ComponentWithMethods: any);
  };

export default createWithTheme;
