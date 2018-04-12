/**
* @module DefaultStore
* @summary Module to show the default store of user.
*
* @author Florencia Acosta <facosta@minutentag.com>
* @author Miguel <malvarez@minutentag.com>
* @author Ben
*
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {StoreSummaryCondensed} from 'views/components/store/detail/StoreSummaryCondensed.jsx';
import {STORE_SUMMARY_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/storesPropTypes';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages.js';

class DefaultStore extends React.Component {
  static propTypes = {
    /** Flags if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,

    store: STORE_SUMMARY_PROP_TYPES_SHAPE
  }

  render () {
    let {store, isMobile} = this.props;

    return (
      <section className="default-store-container">
        <strong className="default-store-title">My Favorite Store</strong>
        {store
          ? <div>
            <StoreSummaryCondensed key={store.basicInfo.id} store={store} isShowCtas={false} isStoreNameLink isMobile={isMobile} />
            <HyperLink destination={PAGES.storeLocator} className="button-primary button-update" aria-label="Update default store">
              <span>Update</span>
            </HyperLink>
          </div>
          : <div>
            <span className="empty-favorite-store-title">You don't have a favorite Store set!</span>
            <p className="empty-favorite-store-message">Setting a favorite store allows you to easily see hours, as well as in store pickup availability of all your favorite products!</p>
            <HyperLink destination={PAGES.storeLocator} className="button-primary button-update" aria-label="Find stores">
              <span>Find Stores</span>
            </HyperLink>
          </div>}
      </section>
    );
  }
}

export {DefaultStore};
