/** @module ProductOrOutfitRecommendations
 * @summary renders two recommendations carousels for PDP or outfit PDP pages
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {ProductRecommendationsListContainer} from 'views/components/recommendations/ProductRecommendationsListContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.outfit-recommendations.scss');
}

export function ProductOrOutfitRecommendations (props) {
  let {className, recommendationsListTitle, isMobile} = props;
  className = cssClassName(className, ' recommendations-and-outfit-container');

  return (
    isMobile
      ? <div className={className}>
        <ProductRecommendationsListContainer isBundledProducts isAccordion isAccordionExpanded accordionTitle={recommendationsListTitle} />
        <ProductRecommendationsListContainer isAccordion isAccordionExpanded accordionTitle="You May Also Like" />
      </div>
      : <div className={className}>
          <div className="outfit-recommendation-container-scroll-arrows">
            <ProductRecommendationsListContainer isBundledProducts stepSize={3} maxVisibleProducts={3} recommendationsListTitle={recommendationsListTitle} />
          </div>
        <ProductRecommendationsListContainer />
      </div>
  );
}
