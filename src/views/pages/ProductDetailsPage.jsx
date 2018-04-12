/** @module ProductDetailsPage
 * @summary Product Details Page
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {ProductDetailsContainer} from 'views/components/productDetails/ProductDetailsContainer';
import {OutfitDetailsContainer} from 'views/components/productDetails/outfits/OutfitDetailsContainer';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';

if (DESKTOP) { // eslint-disable-line
  require('views/components/productDetails/_d.product-details-section.scss');
} else {
  require('views/components/productDetails/_m.product-details-section.scss');
}

export class ProductDetailsPage extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,
    /** flags if data is being loaded */
    isLoading: PropTypes.bool,
    /** flags if this is an outfit pdp */
    isOutfitPdp: PropTypes.bool
  }

  render () {
    let {isMobile, isLoading, isOutfitPdp} = this.props;

    if (isLoading) return <HeaderSpinnerFooter isMobile={isMobile} />;

    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />
        {isOutfitPdp
          ? <OutfitDetailsContainer />
          : <ProductDetailsContainer />
        }
        <FooterGlobalContainer isMobile={isMobile} />
      </div>
    );
  }
}
