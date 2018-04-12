/** @module storeWrappedPage
* @summary exports methods for rendering the root react component on the server side.
 *
 * @author Agu
 * @author Ben
 */
import React from 'react';
import {Provider} from 'react-redux';
import {Router} from 'views/components/common/routing/Router';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

let render = function (store, UiRootComponent, extraProps) {
  let history = routingInfoStoreView.getHistory(store.getState());
  let ServerRouter = (props) => React.createElement(Router, {history: history}, props.children);
  return (
    <Provider store={store}>
      <ServerRouter>
        <UiRootComponent {...extraProps} />
      </ServerRouter>
    </Provider>
  );
};

export {render};
