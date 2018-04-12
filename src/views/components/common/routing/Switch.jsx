/** @module Switch
 * @summary A replacement for Route in react-router.
 *
 * Note: never use the react-router Switch component! Use this component instead.
 * See the <code>Route</code> component in this folder for more info on why we need this.
 *
 * Note: the <code>render</code> method is copied from the source of Switch in react-router, and only slightly modified
 *
 * @author Ben
 */
import React from 'react';
import {Switch as SleepingSwitch} from 'react-router';
import {PropTypes} from 'prop-types';
import {matchPath} from 'react-router';
import {getLocationListener, CONTEXT_ROUTER_SHAPE} from './locationListener';

class _Switch extends SleepingSwitch {
  static contextTypes = {
    router: CONTEXT_ROUTER_SHAPE
  }

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  }

  render () {
    const {getAncestorRoute} = this.context.router;
    const {children} = this.props;
    const location = this.props.location || getAncestorRoute().location;

    let match, child;
    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;

      const { path: pathProp, exact, strict, from } = element.props;
      const path = pathProp || from;

      if (match == null) {
        child = element;
        match = path ? matchPath(location.pathname, { path, exact, strict }) : getAncestorRoute().match;
      }
    });

    return match ? React.cloneElement(child, { location, computedMatch: match }) : null;
  }
}

let Switch = getLocationListener(_Switch, 'Switch');
export {Switch};
