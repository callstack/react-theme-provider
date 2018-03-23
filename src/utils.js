/* @flow */

import * as React from 'react';

const REACT_METHODS = [
  'autobind',
  'childContextTypes',
  'componentDidMount',
  'componentDidUpdate',
  'componentWillMount',
  'componentWillReceiveProps',
  'componentWillUnmount',
  'componentWillUpdate',
  'contextTypes',
  'displayName',
  'getChildContext',
  'getDefaultProps',
  'getDOMNode',
  'getInitialState',
  'mixins',
  'propTypes',
  'render',
  'replaceProps',
  'setProps',
  'shouldComponentUpdate',
  'statics',
  'updateComponent',
];

export function copyRefs<Props>(
  ThemedComponent: React.ComponentType<Props>,
  OriginalComponent: React.ComponentType<Props>
): React.ComponentType<Props> {
  const ComponentWithMethods = ThemedComponent;
  Object.getOwnPropertyNames(OriginalComponent.prototype)
    .filter(
      prop =>
        !(
          REACT_METHODS.includes(prop) || // React specific methods and properties
          prop in React.Component.prototype || // Properties from React's prototype such as `setState`
          prop in ComponentWithMethods.prototype || // Properties from enhanced component's prototype
          // Private methods
          prop.startsWith('_')
        )
    )
    .forEach(prop => {
      // $FlowFixMe
      if (typeof OriginalComponent.prototype[prop] === 'function') {
        /* eslint-disable func-names */
        // $FlowFixMe
        ComponentWithMethods.prototype[prop] = function(...args) {
          // Make sure the function is called with correct context
          // $FlowFixMe
          return OriginalComponent.prototype[prop].apply(
            this.getWrappedInstance(),
            args
          );
        };
      } else {
        // Copy properties as getters and setters
        // This make sure dynamic properties always stay up-to-date
        Object.defineProperty(ComponentWithMethods.prototype, prop, {
          get() {
            return this.getWrappedInstance()[prop];
          },
          set(value) {
            this.getWrappedInstance()[prop] = value;
          },
        });
      }
    });

  return ComponentWithMethods;
}
