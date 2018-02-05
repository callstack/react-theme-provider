/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { channel } from './constants';

type ThemeProviderProps<T> = {
  children?: any,
  theme?: T,
};

export type ThemeProviderType<T> = React.ComponentType<ThemeProviderProps<T>>;

function createThemeProvider<T>(defaultTheme: T): ThemeProviderType<T> {
  return class ThemeProvider extends React.PureComponent<
    ThemeProviderProps<T>
  > {
    static propTypes = {
      children: PropTypes.element.isRequired,
      theme: PropTypes.object,
    };

    static defaultProps = {
      theme: defaultTheme,
    };

    static childContextTypes = {
      [channel]: PropTypes.object,
    };

    getChildContext() {
      return {
        [channel]: {
          subscribe: this._subscribe,
          get: this._get,
        },
      };
    }

    componentWillReceiveProps(nextProps: *) {
      if (this.props.theme !== nextProps.theme) {
        this._subscriptions.forEach(cb => cb(nextProps.theme));
      }
    }

    _subscriptions = [];

    _subscribe = (callback: T => void) => {
      this._subscriptions.push(callback);

      const remove = () => {
        const index = this._subscriptions.indexOf(callback);
        if (index > -1) {
          this._subscriptions.splice(index, 1);
        }
      };

      return { remove };
    };

    _get = () => this.props.theme;

    render() {
      return React.Children.only(this.props.children);
    }
  };
}

export default createThemeProvider;
