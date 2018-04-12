/** @module OutfitDetails
 * @summary content section of PDP of an outfit.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {OutfitProduct} from './OutfitProduct.jsx';
import {ProductOrOutfitRecommendations} from '../ProductOrOutfitRecommendations.jsx';

if (DESKTOP) {      // eslint-disable-line
  require('./_d.outfiting-section.scss');
} else {
  require('./_m.outfiting-section.scss');
}

export class OutfitDetails extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,

    /* The session currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    outfit: PropTypes.shape({
      /** the url of the image of the outfit */
      outfitImageUrl: PropTypes.string.isRequired,
      /** the list of products in this outfit */
      products: PropTypes.arrayOf(OutfitProduct.propTypes.productInfo).isRequired
    }).isRequired,

    /** Callback for adding an item to bag. Accepts two params: productInfo, formData.
     * The productInfo is like the prop of this object, and form data contains the keys: color, fit, size, quantity.
     */
    onAddItemToBag: PropTypes.func.isRequired,

    /** Function to call when the color has changed. Accepts: generalProductId, colorProductId */
    onColorChange: PropTypes.func.isRequired,
    /** Flag to know if outfit was added to bag. If it is success, section should show Add to Bag Notification (modal) */
    onSubmitSuccess: PropTypes.func.isRequired
  }

  render () {
    let {isMobile, currencySymbol, onGoBack, outfit: {outfitImageUrl, products, unavailableCount},
      onAddItemToBag, onSubmitSuccess, onColorChange} = this.props;
    let outfitSectionClassName = cssClassName(
      'main-section-container outfiting-section-container ', {'viewport-container ': !isMobile}
    );

    return (
      <main className={outfitSectionClassName}>
        <div className="go-back-container">
          <button type="button" onClick={onGoBack} className="button-go-back">Back</button>
        </div>

        <div className="outfiting-section-content">

          <div className="outfiting-information">
            <figure className="outfiting-figure-container">
              <img className="outfiting-main-image" src={outfitImageUrl} />
            </figure>
          </div>

          <div className={cssClassName('list-and-notification-container ', {'enabled-notifications ': (unavailableCount > 0)})}>
            <ul className="outfiting-list-container">
              {products.map((product) =>
                <li key={product.generalProductId} className="outfiting-product-item">
                  <OutfitProduct onSubmitSuccess={onSubmitSuccess} productInfo={product} currencySymbol={currencySymbol}
                  onAddItemToBag={onAddItemToBag} isMobile={isMobile} onColorChange={onColorChange} />
                </li>
              )}
            </ul>

            {unavailableCount > 0 &&
              <h3 className="outfit-unavailable-notification">{unavailableCount} item(s) in this outfit are currently unavailable</h3>}
          </div>
        </div>

        <ProductOrOutfitRecommendations isMobile={isMobile} recommendationsListTitle="Other Ways To Wear It" />
      </main>
    );
  }
}
