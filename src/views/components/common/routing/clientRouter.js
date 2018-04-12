/** @module createClientRouter
 * @summary A factory method for creating a Router componnet (see react-router) for use on the client (browser).
 *
 * Note: this method creates a BrowserHistory object for use by the Router, and inserts that
 * history into the redux-store.
 *
 * @author Ben
 */

import React from 'react';
import {createBrowserHistory} from 'history';
import {Router} from 'views/components/common/routing/Router';
import {routingConfirmation} from 'routing/routingConfirmation';
import {isClient} from 'routing/routingHelper';
import invariant from 'invariant';
import {getSetHistoryActn} from 'reduxStore/storeReducersAndActions/mutable/mutable';

export function createClientRouter (store) {
  invariant(isClient(), 'getClienRouter: this method should only be called on the client (i.e., not on the server)');

  let history = createBrowserHistory({getUserConfirmation: routingConfirmation});
  store.dispatch(getSetHistoryActn(history));
  return (props) => React.createElement(Router, {history: history}, props.children);
}
