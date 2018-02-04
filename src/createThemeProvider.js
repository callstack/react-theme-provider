/* @flow */

import { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';

import { channel } from './constants';

function createThemeProvider<T>(defaultTheme: T | {}) {
  return class ThemeProvider<T1: T> extends PureComponent<{
    children?: any,
    theme?: T1,
  }> {
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
      return Children.only(this.props.children);
    }
  };
}

export default createThemeProvider;
