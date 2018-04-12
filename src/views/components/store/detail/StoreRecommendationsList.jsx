/**
 * @module StoreRecommendationsList
 * Shows a list of recommended stores.
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {StoreSummaryCondensed} from './StoreSummaryCondensed.jsx';
import {STORE_SUMMARY_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/storesPropTypes';

export class StoreRecommendationsList extends React.Component {
  static propTypes = {
    /** Array of recommended stores to show */
    storeRecommendations: PropTypes.arrayOf(STORE_SUMMARY_PROP_TYPES_SHAPE).isRequired
  }

  render () {
    let {storeRecommendations, isMobile} = this.props;
    // NOTE: creative will get back to us. On mobile it may be 3 and desktop 4 (storeRecommendations.slice(0, isMobile ? 3 : 4) )
    let NumberOfRecommendations = isMobile ? 3 : 4;
    let limitedStoreRecommendations = storeRecommendations.slice(0, NumberOfRecommendations);
    return (
      <div className="stores-info">
        {limitedStoreRecommendations.map((store) => {
          return (<StoreSummaryCondensed key={store.basicInfo.id} isShowCtas store={store} isMobile={isMobile} isStoreNameLink />);
        })}
      </div>
    );
  }
}
