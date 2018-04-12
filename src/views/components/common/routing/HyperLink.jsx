/** @module HyperLink
 * @summary A React component rendering an anchor with an href, or a react-router Link element.
 *
 * The choice of whether to use an anchor or a Link element is based on whether the destination
 * is different than the current page (or if the prop page.locallyServeNested is false).
 *
 * Any extra props (i.e., other than <code>page, section, queryValues, hash, state, className, activeClassName</code> or <code>to</code>),
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
import {Link} from 'react-router-dom';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView';
import {createPath} from 'history';
import {Route} from 'views/components/common/routing/Route.jsx';

const REDUX_STORE_SHAPE = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

const PAGE_SHAPE = PropTypes.shape({
  /** a unique name for the page */
  id: PropTypes.string.isRequired,
  /** the portion of the url/location path correponding to this page */
  pathPart: PropTypes.string.isRequired,
  /** a key into LOCATION_CREATE_METHODS_TABLE */
  locationCreateMethodKey: PropTypes.string.isRequired,
  /** flags if paths corresponding to this page are served on the client without going back to the server */
  locallyServeNested: PropTypes.bool.isRequired
});

const SECTION_SHAPE = PropTypes.shape({
  /** the page object of the containing page */
  page: PAGE_SHAPE,
  /** a unique name for the section within the page */
  id: PropTypes.string.isRequired,
  /** the section portion of the path in the resulting url */
  pathPart: PropTypes.string.isRequired
});

export class HyperLink extends React.Component {

  static propTypes = {
    /** the class name to use for this element */
    className: PropTypes.string,
    /** Optional class name to add when the current url matches the destination of this HyperLink.
     * Note: DO NOT use this prop unless needed, since this prop also serves as a flag to render the
     * hyperlink inside a Route component to test for this match, which increases overhead.
     */
    activeClassName: PropTypes.string,
    /** Flags if to use the activeClassName only when the current url matches the destination root (i.e., not a subsection) */
    useActiveClassNameOnlyForRoot: PropTypes.bool,

    /** A description of a (non-legacy) page, or section within a page, to link to */
    destination: PropTypes.oneOfType([PAGE_SHAPE, SECTION_SHAPE]).isRequired,

    /** optional suffix for the url's path (used for example to concatenate a skuId, etc.) */
    pathSuffix: PropTypes.string,
    /** Optional simple object of key-value pairs that will be appended to the query string of the url */
    queryValues: PropTypes.object,
    /** optional hash to be added to url */
    hash: PropTypes.string,
    /** optional state part for the url (see window.location docs).
     * Observe that this is ignored if the page is not the same as the current page (as this is not preseved
     * when going back to the server).
     */
    state: PropTypes.object,

    /** flags whether the hyperlink should refresh regardless of whether the section already loaded or not */
    forceRefresh: PropTypes.bool
  }

  static contextTypes = {
    store: REDUX_STORE_SHAPE
  }

  constructor (props, context) {
    super(props, context);
    invariant(context.store,
      'HyperLink: the Redux store is not available. Make sure it is provided by some Provider.'
    );

    let {forceRefresh, destination, pathSuffix, queryValues, hash, state} = props;

      // destination is a page if it has no 'page' field, otherwise it is a section
    let page = destination.page || destination;
    let section = destination.page ? destination : undefined;

    let storeState = context.store.getState();
    this.isLinkAlreadyLoaded = !forceRefresh && routingStoreView.isLinkAlreadyLoaded(storeState, page);
    let location = routingStoreView.getLocationFromPageInfo(storeState, {page, section, pathSuffix, queryValues, hash, state});
    this.to = this.isLinkAlreadyLoaded ? location : createPath(location);
  }

  render () {
    let {destination, pathSuffix, queryValues, hash, state, forceRefresh,      // eslint-disable-line no-unused-vars
      className, activeClassName, useActiveClassNameOnlyForRoot, ...otherProps} = this.props;

    if (this.isLinkAlreadyLoaded) {         // if link is to a section in the current page (i.e., no need to go to server)
      if (activeClassName) {
        return createElement(        // render the link inside a route so we can keep track whether the current url matches the link and change the css class
          Route,
          {exact: useActiveClassNameOnlyForRoot, path: useActiveClassNameOnlyForRoot ? destination.rootPathPattern || destination.pathPattern : destination.pathPattern},
          (pprops) => createElement(Link, {...otherProps, to: this.to, className: pprops.match ? (className + ' ' + activeClassName) : className})
        );
      } else {
        return createElement(Link, {...otherProps, to: this.to, className: activeClassName ? (className + ' ' + activeClassName) : className});
      }
    } else {
      let {match, location, history, staticContext, ...aOtherProps} = otherProps;
      return createElement('a', {...aOtherProps, href: this.to, className: activeClassName ? (className + ' ' + activeClassName) : className});
    }
  }
}
