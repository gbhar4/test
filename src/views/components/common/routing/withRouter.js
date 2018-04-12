/** @module withRouter
 * @summary a replacement for withRouter of react-router.
 *
 * Never use the react-router withRouter component! Use this component instead.
 * See the <code>Route</code> component in this folder for more info on why we need this.
 *
 * Note: this component is completely identical to withRouter in react-router, except that it uses our Route
 *  component instead of theirs (and that it lints using our standards).
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import {Route} from './Route.jsx';

/**
 * A public higher-order component to access the imperative API
 */
const withRouter = (Component) => {
  const C = (props) => {
    const { wrappedComponentRef, ...remainingProps } = props;
    return (
      <Route render={(routeComponentProps) => (
        <Component {...remainingProps} {...routeComponentProps} ref={wrappedComponentRef} />
      )} />
    );
  };

  C.displayName = `withRouter(${Component.displayName || Component.name})`;
  C.WrappedComponent = Component;
  C.propTypes = {
    wrappedComponentRef: PropTypes.func
  };

  return hoistStatics(C, Component);
};

export {withRouter};
