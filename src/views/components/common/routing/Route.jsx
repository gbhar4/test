/** @module Route
 * @summary A replacement for Route in react-router.
 *
 * Note: never use the react-router Route component! Use this component instead.
 * This component always updates when the location inside the history changes. The one from react-router
 * does not if it does not get re-rendered. I.e., if any of its ancestors' shouldComponentUpdate returns false.
 * This effectively means that the react-router Route component is unusable if it is nested inside any component that
 * is pure or connected to the redux-store (as these are also pure).
 * @see https://github.com/ReactTraining/react-router/issues/5076
 *
 * Note: the <code>render</code> method is copied from the source of Route in react-router, and only slightly modified
 * (to emphasize this, the linting style of the source is kept).
 *
 * @author Ben
 */
import React from 'react';
import {Route as SleepingRoute, matchPath} from 'react-router';
import {PropTypes} from 'prop-types';
import invariant from 'invariant';
import {getLocationListener, CONTEXT_ROUTER_SHAPE} from './locationListener';

class _RoutePatch extends SleepingRoute {

  static contextTypes = {
    router: CONTEXT_ROUTER_SHAPE
  }

  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context);
    invariant(this.context.router.getAncestorRoute, "Route: 'getAncestorRoute' is not found in the React context.router!\n" + "Maybe you are using the standard react-router 'Router' instead of 'src/views/components/common/routing/Route.jsx'.");
  }

  // ------------- overloaded methods ----------------------

  getChildContext () {
    return {
      router: {
        ...super.getChildContext().router,
        getAncestorRoute: () => ({
          location: this.props.location || this.context.router.history.location,
          match: this.state.match
        })
      }
    };
  }

  computeMatch (props, router) {
    let {computedMatch, location, path, strict, exact} = props;
    let route = router.getAncestorRoute();

    if (computedMatch) { return computedMatch; } // <Switch> already computed the match for us
    let pathname = (location || route.location).pathname;
    return path
      ? matchPath(pathname, {path, strict, exact})
      : route.match;
  }

  render () {
    const {match} = this.state;
    const {children, component, render, componentProps} = this.props;
    const {history, route, staticContext} = this.context.router;
    const location = this.props.location || route.location;
    const props = {
      match,
      location,
      history,
      staticContext
    };

    return (component
      ? ( // component prop gets first priority, only called if there's a match
          match
        ? React.createElement(component, {
          ...componentProps,
          ...props
        })
        : null)
      : render
        ? ( // render prop is next, only called if there's a match
            match
          ? render(props)
          : null)
        : children
          ? ( // children come last, always called
              typeof children === 'function'
            ? (children(props))
            : !Array.isArray(children) || children.length
              ? ( // Preact defaults to empty children array
                  React.Children.only(children))
              : (null))
          : (null));
  }
}

let Route = getLocationListener(_RoutePatch, 'Route');
export {Route};
