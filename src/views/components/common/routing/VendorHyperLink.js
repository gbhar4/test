/** @module VendorHyperLink
 * @summary A React component rendering an anchor with an href.
 *
 * Any extra props (i.e., other than <code>page, params</code>),
 * e.g., <code>onClick, disabled, target</code>, passed to this component will be passed along to the rendered Link or anchor element.
 *
 * Note: this component accesses the redux-store in an unconventional way!
 * Instead of being connected to the store using the react-redux connect() method, this component
 * taps directly into the store in the react context when it mounts, and does not observe the store later
 * in its life-cycle (since the current page cannot change).
 *
 * @author Ben
 */
import React, {createElement} from 'react';
import {PropTypes} from 'prop-types';
import invariant from 'invariant';

const REDUX_STORE_SHAPE = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

export class VendorHyperLink extends React.Component {

  static propTypes = {
    page: PropTypes.shape({
      /** A method that returns a url for a legacy page  */
      pathCreateMethod: PropTypes.func.isRequired
    }).isRequired,

    /** optional extra parameters to be passed to pathCreateMethod */
    params: PropTypes.array
  }

  static contextTypes = {
    store: REDUX_STORE_SHAPE
  }

  static defaultProps = {
    params: []
  }

  constructor (props, context) {
    super(props, context);

    invariant(context.store,
      'VendorHyperLink: the Redux store is not available. Make sure it is provided by some Provider.'
    );

    let {page, params} = props;
    let storeState = context.store.getState();
    this.to = page.pathCreateMethod(storeState, ...params);
  }

  render () {
    let {page, params       // eslint-disable-line no-unused-vars
      , ...otherProps} = this.props;
    return createElement('a', {...otherProps, href: this.to});
  }

}
