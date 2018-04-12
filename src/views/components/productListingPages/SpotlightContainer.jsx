/**
 * @module SpotlightContainer
 * @author Michael Citro
 */
import { connectPlusStoreOperators } from 'reduxStore/util/connectPlusStoreOperators';
import { Spotlights } from './Spotlights';
import { vendorRoutingStoreView } from 'reduxStore/storeViews/routing/vendorRoutingStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    spotlightUrl: vendorRoutingStoreView.getSpotlightReviewsUrl(state)
  };
}

export let SpotlightContainer = connectPlusStoreOperators(mapStateToProps)(Spotlights);
