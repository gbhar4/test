/** @module ProductDetails
 * @summary content section of PDP.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {FixedBreadCrumbs} from 'views/components/common/routing/FixedBreadCrumbs.jsx';
import {Accordion} from 'views/components/accordion/Accordion.jsx';
import {ProductDescription} from 'views/components/productDetails/productDescription/ProductDescription.jsx';
import {ProductOrOutfitRecommendations} from './ProductOrOutfitRecommendations.jsx';
import {ProductContainer} from 'views/components/productDetails/ProductContainer';
import {isClient} from 'routing/routingHelper';
import {ProductReviewsContainer} from 'views/components/productReviews/ProductReviewsContainer.js';
import {PRODUCT_INFO_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {getMapSliceForColorProductId} from 'util/viewUtil/productsCommonUtils.js';

if (DESKTOP) { // eslint-disable-line
  require('views/components/productDetails/_d.product-details-section.scss');
} else {
  require('views/components/productDetails/_m.product-details-section.scss');
}

export class ProductDetails extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,
    /** Information of the product */
    productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,
    /** the id of the currently active customization of this product at the color level */
    currentColorProductId: PropTypes.string.isRequired,
    /** the breadcrumbs for navigation */
    breadcrumbs: FixedBreadCrumbs.propTypes.crumbs,
    /** Flags whether to show a "go back" button */
    isShowGoBack: PropTypes.bool.isRequired,
    /** a callback for clicks on the "go back" button. Required if isShowGoBack is true. */
    onGoBack: PropTypes.func
  }

  /* NOTE: MOBILE or DESKTOP render */
  renderProductDescription () {
    let {isMobile, productInfo, currentColorProductId} = this.props;
    let colorProduct = getMapSliceForColorProductId(productInfo.colorFitsSizesMap, currentColorProductId);

    return (
      isMobile
        ? <Accordion title="Product description">
          <ProductDescription isMobile
            itemPartNumber={colorProduct.colorDisplayId}
            shortDescription={productInfo.shortDescription}
            longDescription={productInfo.longDescription} />
        </Accordion>
        : <ProductDescription
          itemPartNumber={colorProduct.colorDisplayId}
          shortDescription={productInfo.shortDescription}
          longDescription={productInfo.longDescription} shrinkedSize={2} />
    );
  }

  /* NOTE: MOBILE or DESKTOP render */
  renderRatingAndReview () {
    let {isMobile, productInfo} = this.props;

    return <ProductReviewsContainer isMobile={isMobile} expanded={!isMobile} ratingsProductId={productInfo.ratingsProductId} isClient={isClient()} />;
  }

  render () {
    let {isMobile, breadcrumbs, productInfo, currentColorProductId, isShowGoBack, onGoBack} = this.props;
    let {isGiftCard} = productInfo;

    return (
      <main className={cssClassName('main-section-container product-details-container ', {'giftcard-details-container ': isGiftCard, 'viewport-container ': !isMobile})}>
        {isShowGoBack
          ? <div className="go-back-container">
            <button type="button" onClick={onGoBack} className="button-go-back"> Back to Results</button>
          </div>
          : !isGiftCard && <FixedBreadCrumbs crumbs={breadcrumbs} separationChar=">" />
        }

        <ContentSlot contentSlotName="pdp_global_promo_header" className="product-details-header-promo-text-area" />

        <ProductContainer colorProductId={currentColorProductId} isMobile={isMobile} productInfo={productInfo} />

        {!isGiftCard && <ProductOrOutfitRecommendations isMobile={isMobile} recommendationsListTitle="Complete The Look" />}
        {!isGiftCard && this.renderProductDescription()}
        {!isGiftCard && this.renderRatingAndReview()}
      </main>
    );
  }
}
