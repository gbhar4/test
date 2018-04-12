/** @module ConnectPlusStoreOperators
 * @summary Connects a React component to a Redux store, with optional injected storeOperators props.
 *
 * The requested store operators with be automatically created and passed to the mapStateToProps method
 * as a third parameter. It is up to mapStateToProps to decide what to do with these operators. If a
 * mapStateToProps method is not passed to ConnectPlusStoreOperators, then a default one with the following
 * structure will be used:
 * <code> function mapStateToProps(state, ownProps, storeOperators) {return {storeOperators: storeOperators}}</code>.
 * In other words, the default behavior is to pass to the wrapped component a prop called storeOperators that
 * contains the created store operators.
 */

import {connect} from 'react-redux';

const DISPLAY_NAME_PREFIX = 'ConnectPlusOperators';
const STORE_KEY = 'store';

/**
 * @summary Connects a React component to a Redux store, with optional injected storeOperators props.
 *
 * This function acts exactly like the react-redux connect() function but adds
 * an extra initial parameter specifying store operators to be injected inside a storeOperators prop.
 * Observe that this prop is calculated only once inside the constructor of the connected component (or
 * when the store inside the context changes).
 *
 * If the first parameter (storeOperatorsFactories) passed to this method is a function
 * then this method assumes that no storeOperators are needed and shifts all parameters left, thus behaving exactly
 * like the react-redux connect() function.
 *
 * Note: the main reason for this method is that the react-redux connect() allows one to easily create a prop
 * that depends on the state of the redux-store (via mapStateToProps()), or on the dispatch
 * method of the store (via mapDispatchToProps), but not both; nor does it allow a prop to
 * attach to the store itself.
 * Our store operators usually need access to the store itself (so they can always query it as to its most
 * recent state, without the overhead of subscribing to it).
 *
 * @param  {object} [storeOperatorsFactories] an object that maps prop names to store operator factories
 * (i.e, functions that receive a store and return a store operator instance that is attached to the store).
 * The mapStateToProps method will recieve a third parameter with the following structure:
 *     for each property of this parameter object there will be a correponding key in this parameter
 *     whose value will be an instance of the corresponding store operator class.
 * @param  {function} [mapStateToProps]                like the same parameter in react-redux connect()
 *                                                     except that it receives a third parameter as described above.
 * @param  {object|function} [mapDispatchToProps]      see the same parameter in react-redux connect()
 * @param  {function} [mergeProps]                     see the same parameter in react-redux connect()
 * @param  {object} [options]                          see the same parameter in react-redux connect()
 * @return A higher-order React component class that passes state and action creators into your component
 * derived from the supplied arguments.
 */
// this method works by monkey-patching the componentWillMount() method of the class returned by the react-redux connect().
// it assumes that connect() expects a reference to the redux store inside a 'store' key of the context.
export function connectPlusStoreOperators (storeOperatorsFactories, mapStateToProps, mapDispatchToProps, mergeProps, options) {
  let storeOperatorsProps = Object.create(null);
  let _store = null;

  // if user passed a function as first parameter then assume he wants the regular react-redux connect()
  // (and all parameter names are actually wrong and should be shifted left)
  if (typeof storeOperatorsFactories === 'function') {
    options = mergeProps;
    mergeProps = mapDispatchToProps;
    mapDispatchToProps = mapStateToProps;
    mapStateToProps = storeOperatorsFactories;
    storeOperatorsFactories = null;
  }

  function getDisplayName (WrappedComponent) {
    let wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    return `${DISPLAY_NAME_PREFIX}(${wrappedName})`;
  }

  return function enhancedConnect (WrappedComponent) {
    // if no operators to inject, behave like connect(), but patch the displayName to be of this component
    if (!storeOperatorsFactories) {
      let ConnectedClass = connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(WrappedComponent);
      ConnectedClass.displayName = getDisplayName(WrappedComponent);
      return ConnectedClass;
    } else {
      // use connect but with our _mergeProps as a base
      let ConnectedClass = connect(_mapStateToProps, mapDispatchToProps, mergeProps, options)(WrappedComponent);
      // make EnhancedConnectedClass a class whose constructor initializes storeOperatorsProps
      // and then invokes the constructor of ConnectedClass
      let EnhancedConnectedClass = function (props, context) {
        _store = context[STORE_KEY];
        // storeOperatorsProps = getStoreOperatorsProps(props[STORE_KEY] || context[STORE_KEY]);
        storeOperatorsProps = getStoreOperatorsProps();
        ConnectedClass.call(this, props, context);
        return this;
      };
      // Copy all the enumerable own properties of ConnectedClass to EnhancedConnectedClass.
      // (this makes the static class properties of EnhancedConnectedClass be the ones of ConnectedClass)
      Object.assign(EnhancedConnectedClass, ConnectedClass);
      // the prototype is not copied by Object.assign above (since it is inherited, and not an `own property')
      EnhancedConnectedClass.prototype = ConnectedClass.prototype;
      // Make the function EnhancedConnectedClass have the same prototype function as ConnectedClass
      // (this makes EnhancedConnectedClass have all the instance methods and fields ConnectedClass has)
      Object.setPrototypeOf(EnhancedConnectedClass, Object.getPrototypeOf(ConnectedClass));

      // patch the display name (we want this to be different than the one that ConnectedClass has)
      EnhancedConnectedClass.displayName = getDisplayName(WrappedComponent);

      // patch componentWillReceiveProps to update storeOperatorsProps if context[STORE_KEY] changes (for hot-reloading)
      let cwrp = EnhancedConnectedClass.prototype.componentWillReceiveProps;
      EnhancedConnectedClass.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
        if (_store !== nextContext[STORE_KEY]) {
          _store = nextContext[STORE_KEY];
          storeOperatorsProps = getStoreOperatorsProps();
        }
        // call the original (unpatched) componentWillReceiveProps
        cwrp.call(this, nextProps, nextContext);
      };

      return EnhancedConnectedClass;
    }
  };

  function getStoreOperatorsProps () {
    let result = Object.create(null);
    for (let key of Object.keys(storeOperatorsFactories)) {
      result[key] = storeOperatorsFactories[key](_store);
    }
    return result;
  }

  function _mapStateToProps (state, ownProps) {
    if (typeof mapStateToProps === 'function') {
      return mapStateToProps(state, ownProps, storeOperatorsProps);
    } else {
      return {storeOperators: storeOperatorsProps};
    }
  }
}
