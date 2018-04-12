/** @module getLocationListener
 * @summary a factory method returning a HOC that wraps another component and inject to it a 'location' prop
 * that tracks the current location.
 *
 * Note: All props passeds to this component are passed along to the wrapped component.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import invariant from 'invariant';

export const CONTEXT_ROUTER_SHAPE = PropTypes.shape({
  history: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  staticContext: PropTypes.object,
  getAncestorRoute: PropTypes.func.isRequired
});

export function getLocationListener (ComponentToAdapt, displayName = 'LocationListener') {
  class LocationListener extends React.Component {
    static contextTypes = {
      router: CONTEXT_ROUTER_SHAPE
    }

    static displayName = displayName;

    constructor (props, context) {
      super(props, context);
      invariant(this.context.router, `${displayName}: 'router' is not found in the React context!`);

      this.handleLocationChange = this.handleLocationChange.bind(this);
      this.state = {location: this.context.router.history.location};
    }

    componentWillMount () {
      this.unsubscribeFromHistory = this.context.router.history.listen((this.handleLocationChange));
    }

    componentWillUnmount () {
      if (this.unsubscribeFromHistory) {
        this.unsubscribeFromHistory();
      }
    }

    render () {
      return (
        React.createElement(ComponentToAdapt, {...this.props, location: this.state.location})
      );
    }

    handleLocationChange (location) {
      if (this.state.location.key === location.key) return;
      this.setState({location});
    }
  }

  return LocationListener;
}
