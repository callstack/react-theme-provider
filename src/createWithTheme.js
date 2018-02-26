/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash.merge';
import isEqual from 'lodash.isequal';
import hoistNonReactStatics from 'hoist-non-react-statics';

type withThemeRetunType<Theme, Props: {}> = React.ComponentType<
  React.ElementConfig<React.ComponentType<$Diff<Props, { theme: Theme }>>>
>;

const isClassComponent = (Component: Function) =>
  Boolean(
    Component &&
      Component.prototype &&
      typeof Component.prototype.render === 'function'
  );

export type WithThemeType<T> = <Props: {}>(
  Comp: React.ComponentType<Props>
) => withThemeRetunType<T, Props>;

const createWithTheme = <T>(
  ThemeProvider: React.ComponentType<*>,
  channel: string
): WithThemeType<T> =>
  function withTheme<Props: {}>(
    Comp: React.ComponentType<Props>
  ): withThemeRetunType<T, Props> {
    class ThemedComponent extends React.PureComponent<*, { theme: T }> {
      static displayName = `withTheme(${Comp.displayName || Comp.name})`;

      static contextTypes = {
        [channel]: PropTypes.object,
      };

      constructor(props, context) {
        super(props, context);

        const theme = this.context[channel] && this.context[channel].get();

        if (typeof theme !== 'object' && typeof this.props.theme !== 'object') {
          throw new Error(
            `Couldn't find theme in the context or props. ` +
              `You need to wrap your component in '<ThemeProvider />' or pass a 'theme' prop`
          );
        }

        this.state = {
          theme: this._merge(theme, props),
        };
      }

      state: { theme: T };

      componentDidMount() {
        // Pure components could prevent propagation of context updates
        // We setup a subscription so we always get notified about theme updates
        this._subscription =
          this.context[channel] &&
          this.context[channel].subscribe(theme =>
            this.setState({ theme: this._merge(theme, this.props) })
          );
      }

      componentWillReceiveProps(nextProps: *) {
        if (isEqual(this.props.theme, nextProps.theme)) {
          this.setState({
            theme: this._merge(
              this.context[channel] && this.context[channel].get(),
              nextProps
            ),
          });
        }
      }

      componentWillUnmount() {
        this._subscription && this._subscription.remove();
      }

      _merge = (theme: T, props: *) =>
        // Only merge if both theme from context and props are present
        // Avoiding unnecessary merge allows us to check equality by reference
        theme && props.theme
          ? merge({}, theme, props.theme)
          : theme || props.theme;

      _subscription: { remove: Function };
      _root: any;

      render() {
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
              theme={this.state.theme}
            />
          );
        } else {
          element = <Comp {...this.props} theme={this.state.theme} />;
        }

        if (this.state.theme !== this.props.theme) {
          // If a theme prop was passed, expose it to the children
          return (
            <ThemeProvider theme={this.state.theme}>{element}</ThemeProvider>
          );
        }

        return element;
      }
    }

    if (isClassComponent(Comp)) {
      // getWrappedInstance is exposed by some HOCs like react-redux's connect
      // Use it to get the ref to the underlying element
      // Also expose it to access the underlying element after wrapping
      // $FlowFixMe
      ThemedComponent.prototype.getWrappedInstance = function getWrappedInstance() {
        return this._root.getWrappedInstance
          ? this._root.getWrappedInstance()
          : this._root;
      };

      // setNativeProps is used by Animated to set props on the native component
      /* $FlowFixMe */
      if (Comp.prototype.setNativeProps) {
        // $FlowFixMe
        ThemedComponent.prototype.setNativeProps = function setNativeProps(
          ...args
        ) {
          const root = this.getWrappedInstance();
          return root.setNativeProps(...args);
        };
      }
    }

    return hoistNonReactStatics(ThemedComponent, Comp);
  };

export default createWithTheme;
