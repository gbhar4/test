/**
 * @summary A module providing a high order component that is used in static testing as a place-holder for a react-redux connected
 * container component.
 *
 * Some React presentational components are wrapped by a high-order component (HOC) that connects them to a Redux store and feeds
 * the wrapped component with some prop values obtained from the store. This is usually accomplished by using the {@linkcode module:react-redux.connect()}
 * method to obtain the HOC. One passes to this method a <code>mapStateToProps()</code> function that accepts the
 * state of the store and returns an object containing the desired props to be passed on to the wrapped component
 * (together with the props passed to the wrapping HOC).
 *
 * During static testing, before integration with Redux, one can use the {@linkcode connectStatic()} function exported by this module instead.
 * This method accepts a <code>mapStaticToProps()</code> function that returns an object containing a static example of
 * the props that would eventually be dynamically calculated from the rewdux store.
 *
 * Apart from the <code>mapStaticToProps()</code>function, the connectStatic()} method also accepts an optional {@linkcode mergeProps} function
 * that can allow one to control how the props of the HOC, and the props returned from <code>mapStaticToProps()</code> are merged to obtain the
 * final props that will be passed to the wrapped component.
 *
 * The functions <code>connectStatic, mapStaticToProps, mergeProps</code> are fashioned after the function {@linkcode module:react-redux.connect()},
 * and its parameters functions <code>mapStateToProps, mergeProps</code>.
 *
 * @module reduxStore/util/multipleActionsDispatch
 *
 * @example <caption>How to define a static container component</caption>
 * import {connectStatic} from 'testHelpers/react-static/connectStatic';
 *
 * const mapStaticToProps = function () {
 *   return {
 *     subtotalPrice: 200,
 *     itemsCount: 5
 *   };
 * };
 *
 * let MiniCartFooterContainer = connectStatic(mapStaticToProps)(MiniCartFooter);
 * export default MiniCartFooterContainer;
 *
 * @example <caption>How to use a static container component</caption>
 *  render () {
 *     return (
 *       <div>
 *       <MiniCartProductsListContainer onChangeProductQuantity={this.handleProductQuantityChange} />
 *       <MiniCartFooterContainer className="minicartClassName" />
 *       </div>
 *     );
 *   }
 *
 *
 * @author Ben
 */

import { Component, createElement } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import shallowEqual from 'util/shallowEqual';

const DISPLAY_NAME_PREFIX = 'staticContainer';
const defaultMapStaticToProps = () => {};
const defaultMergeProps = function (staticProps, ownProps) {
  return {...ownProps, ...staticProps};
};

let getDisplayName = function (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

// Helps track hot reloading.
let nextVersion = 0;

/**
 * @callback mapStaticToProps
 * @param  {object} [ownProps] if used, its value will be the props passed to this (wrapping) component, and mapStaticToProps will be
 *  re-invoked whenever the component receives new props (e.g. if props received from a parent component have shallowly changed,
 * and you use the ownProps argument, mapStaticToProps is re-evaluated).
 */

 /**
 * @callback mergeProps
 * @param  {object} staticProps  the result of calling <code>mapStaticToProps</code>.
 * @param  {object} ownProps    the props passed to this (wrapping) component.
 * @return {object} the final props that will be passed to the wrapped component.
 */

 /**
 * Returns a HOC wrapping a react component and injecting statically simulated props to it.
 * Use as a place-holder for {@linkcode module:react-redux.connect()} during static development testing before
 * integrating with a redux store.
 * @param  {mapStaticToProps} [mapStaticToProps] if used, returns a plain object whoes properties will be merged to the wrapped component's props.
 * @param  {mapStaticToProps} [mapStaticToProps] if used, returns a plain object that will be passed as the props to the wrapped component.
 * For example, you may specify this function to remove some of your own props that are for test purposes only and should not be passed
 * down to the wrapped component. If you omit this parameter, Object.assign({}, ownProps, staticProps) is used by default.
 * @param  {Object} options={}    if specified, further customizes the behavior of the HOC. {@see module:react-redux.connect()}.
 * @return {function}  a function that accepts a component class to wrap, and returns a the wrapping component class.
 */
let connectStatic = function (mapStaticToProps, mergeProps, options = {}) {
  // Helps track hot reloading.
  const version = nextVersion++;

  mapStaticToProps = mapStaticToProps || defaultMapStaticToProps;
  mergeProps = mergeProps || defaultMergeProps;
  const {
    pure = true, withRef = false
  } = options;

  return function wrapWithInjector (WrappedComponent) {
    const connectDisplayName = `${DISPLAY_NAME_PREFIX}(${getDisplayName(WrappedComponent)})`;

    class StaticInjector extends Component {

      shouldComponentUpdate () {
        return (!pure || this.haveOwnPropsChanged);
      }

      constructor (props, context) {
        super(props, context);

        this.clearCache();
        this.propsToPassDown = mergeProps(mapStaticToProps(props), props);

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

        let staticCreatedProps = mapStaticToProps(this.props);
        for (let key in this.staticCreatedProps) {
          invariant(!(key in this.props),
            `${DISPLAY_NAME_PREFIX}: the property name ${key} is passed to this container object as well as generated by it. ` +
            'Please use only one of the two.'
          );
        }
        this.propsToPassDown = mergeProps(staticCreatedProps, this.props);

        if (withRef) {
          this.propsToPassDown.ref = instance => { this.refs.wrappedInstance = instance; };
        }
        return createElement(WrappedComponent, this.propsToPassDown);
      }

      clearCache () {
        this.haveOwnPropsChanged = true;
        this.renderedElement = null;
        this.propsToPassDown = null;
      }

      getWrappedInstance () {
        invariant(withRef,
          'To access the wrapped instance, you need to specify { withRef: true } as the second argument of the connectStatic() call'
        );
        return this.refs.wrappedInstance;
      }
    }

    StaticInjector.displayName = connectDisplayName;
    StaticInjector.WrappedComponent = WrappedComponent;

    // Helps track hot reloading.
    if (process.env.NODE_ENV !== 'production') {
      StaticInjector.prototype.componentWillUpdate = function componentWillUpdate () {
        if (this.version === version) {
          return;
        }

        // hot reloading
        this.version = version;
        this.clearCache();
      };
    }

    return hoistStatics(StaticInjector, WrappedComponent);
  };
};

export default connectStatic;
