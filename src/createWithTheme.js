/* @flow */

import * as React from 'react';
import merge from 'lodash.merge';
import hoistNonReactStatics from 'hoist-non-react-statics';
import type { Context } from 'create-react-context';

import { getComponentDisplayName, isClassComponent } from './utils';

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
      static displayName = `withTheme(${getComponentDisplayName(Comp)})`;

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

      render() {
        const { forwardedRef, innerRef, ...rest } = this.props;

        return (
          <ThemeContext.Consumer>
            {theme => {
              const mergedTheme = this._merge(theme, this.props.theme);

              let element;
              if (React.forwardRef) {
                if (innerRef) {
                  console.warn(
                    "From React >=16.3 there's a new API support for refs, so you do not need to pass an `innerRef` prop any more. Use `ref` instead."
                  );
                }
                element = (
                  <Comp
                    {...rest}
                    theme={mergedTheme}
                    ref={forwardedRef || innerRef}
                  />
                );
              } else if (isClassComponent(Comp)) {
                // Only add refs for class components as function components don't support them
                // It's needed to support use cases which need access to the underlying node

                if (!innerRef) {
                  console.error(
                    `${getComponentDisplayName(
                      Comp
                    )} is using \`ref\`, use \`innerRef\` instead or upgrade React to >=16.3.x.`
                  );
                }
                element = <Comp {...rest} ref={innerRef} theme={mergedTheme} />;
              } else {
                element = <Comp {...rest} theme={mergedTheme} />;
              }

              if (mergedTheme !== this.props.theme) {
                // If a theme prop was passed, expose it to the children
                return (
                  <ThemeProvider theme={mergedTheme}>{element}</ThemeProvider>
                );
              }

              return element;
            }}
          </ThemeContext.Consumer>
        );
      }
    }

    return hoistNonReactStatics(ThemedComponent, Comp);
  };

export default createWithTheme;
