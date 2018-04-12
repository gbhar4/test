import {Component, createElement} from 'react';
import {PropTypes} from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import shallowEqual from 'common/jsUtil/shallowEqual';

const DISPLAY_NAME_PREFIX = 'ReduxStoreInjector';

const REDUX_STORE_SHAPE = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

let getDisplayName = function (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

let injectStaticWarnings = function (hoc, component) {
  if (typeof process === 'undefined' || !process.env || process.env.NODE_ENV === 'production') {
    return;
  }

  ['propTypes', 'defaultProps', 'contextTypes'].forEach(function (prop) {
    const propValue = hoc[prop];
    Object.defineProperty(hoc, prop, {
      set: function (_) {
        // enable for testing:
        var name = component.displayName || component.name;
        console.warn(`${DISPLAY_NAME_PREFIX} you are trying to attach ${prop} to a HOC instead of ${name}. Use wrappedComponent property instead.`);
      },
      get: function () {
        return propValue;
      },
      configurable: true
    });
  });
};

// Helps track hot reloading.
let nextVersion = 0;

/**
 * higher order component that injects as props Redux store operators to a child.
 * takes an object that maps prop names to store operator factories
 * (i.e, functions that receive a store and return a class operator object).
 * for each property of this object the child component will get a prop with the same key
 * and a value which is an instance of the corresponding class that is bound to the store provided by the enclosing
 * redux provider.
 * The options object is similar to the one given to the react-redux connect() function.
 */
let injectStoreOperators = function (storeOperatorsFactories, options = {}) {
  // Helps track hot reloading.
  const version = nextVersion++;

  const {
    pure = true, withRef = false
  } = options;

  return function wrapWithInjector (WrappedComponent) {
    const connectDisplayName = `${DISPLAY_NAME_PREFIX}(${getDisplayName(WrappedComponent)})`;

    class Injector extends Component {

      shouldComponentUpdate () {
        return (!pure || this.haveOwnPropsChanged);
      }

      constructor (props, context) {
        super(props, context);

        invariant(context.store,
          `${DISPLAY_NAME_PREFIX}: the Redux store is not available. Make sure it is provided by some Provider.`
        );
        this.store = context.store;

        this.clearCache();

        // Helps track hot reloading.
        this.version = version;
      }

      componentWillReceiveProps (nextProps) {
        if (!pure || !shallowEqual(nextProps, this.props)) {
          this.haveOwnPropsChanged = true;
        }
      }

      componentWillUnmount () {
        this.clearCache();
      }

      render () {
        this.haveOwnPropsChanged = false;

        let mergedProps = {...this.props};
        for (let key in storeOperatorsFactories) {
          invariant(!(key in this.props),
            `${DISPLAY_NAME_PREFIX}: the property name ${key} is already used` +
              ' and cannot be used to inject the a Redux store operator'
          );
          if (storeOperatorsFactories.hasOwnProperty(key)) {
            mergedProps[key] = storeOperatorsFactories[key](this.store);
          }
        }

        if (withRef) {
          mergedProps.ref = (instance) => { this.refs.wrappedInstance = instance; };
        }
        return createElement(WrappedComponent, mergedProps);
      }

      clearCache () {
        this.haveOwnPropsChanged = true;
        this.renderedElement = null;
      }

      getWrappedInstance () {
        invariant(withRef,
          'To access the wrapped instance, you need to specify { withRef: true } as the second argument of the inject() call'
        );
        return this.refs.wrappedInstance;
      }
    }

    Injector.displayName = connectDisplayName;
    Injector.WrappedComponent = WrappedComponent;
    Injector.contextTypes = { store: REDUX_STORE_SHAPE };
    Injector.propTypes = { store: REDUX_STORE_SHAPE };
    Injector.WrappedComponent = WrappedComponent;
    injectStaticWarnings(Injector, WrappedComponent);

    // Helps track hot reloading.
    if (process.env.NODE_ENV !== 'production') {
      Injector.prototype.componentWillUpdate = function componentWillUpdate () {
        if (this.version === version) {
          return;
        }

        // hot reloading
        this.version = version;
        this.clearCache();
      };
    }

    return hoistStatics(Injector, WrappedComponent);
  };
};

export default injectStoreOperators;
