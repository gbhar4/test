/** @module WishlistSuggestedItem
 *
 * @summary This component will render either as a CTA to see the suggested item
 *  for a wishlist item, o as a card showing such suggested product inviting the
 *  user to add it to the wishlist in place of the current wishlist item.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ProductStatus} from 'views/components/product/ProductItemComponents.jsx';
import {ProductRecommendation} from 'views/components/recommendations/ProductRecommendation.jsx';
import {RECOMMENDED_PRODUCT_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {STATUS} from 'reduxStore/storeReducersAndActions/favorites/favorites.js';

export class WishlistSuggestedItem extends React.Component {
  static propTypes = {
    /** Flags if we're in mobile */
    isMobile: PropTypes.bool.isRequired,
    /** id of the wishlist item for which to show a suggestion */
    itemId: PropTypes.string.isRequired,

    /** Flags if the suggested product card should is open. Else, the cta to open it will be rendered */
    isOpen: PropTypes.bool.isRequired,
    /** Suggested product information. Required if the isOpen prop is true */
    product: RECOMMENDED_PRODUCT_PROP_TYPE_SHAPE,

    /** Function to call to show the suggested product */
    onOpen: PropTypes.func.isRequired,
    /** Function to call when the close button of this form has been clicked */
    onClose: PropTypes.func.isRequired,
    /** Function to call to place the suggested product in the wishlist in place of the wishlist item */
    onReplaceWishlistItem: PropTypes.func.isRequired,
    /** Flags to show the BOPIS CTA */
    isShowBopisButton: PropTypes.bool,
    /** indicates monies symbol to represent the product's currency */
    currencySymbol: PropTypes.string.isRequired
  }

  state = {
    submitting: false
  }

  constructor (props, context) {
    super(props, context);
    this.handleOpenClick = this.handleOpenClick.bind(this);
    this.handleAddToWishlist = this.handleAddToWishlist.bind(this);
  }

  handleOpenClick () {
    this.props.onOpen(this.props.itemId);
  }

  handleAddToWishlist () {
    let {onReplaceWishlistItem, itemId, product: {generalProductId}, onClose} = this.props;
    this.setState({submitting: true});
    onReplaceWishlistItem(itemId, generalProductId)
      .then(() => {
        this.setState({submitting: false});
        onClose();
      })
      .catch(() => this.setState({submitting: false}));
  }

  render () {
    let {isOpen, product, isMobile, onClose, isShowBopisButton, currencySymbol} = this.props;
    let {submitting} = this.state;
    return isOpen ? (
      <div className="quickview-container wishlist-suggested-container">
        <ProductStatus status={STATUS.SUGGESTED} />
        <ProductRecommendation currencySymbol={currencySymbol} productOrOutfit={product} isMobile={isMobile}
          isBundledProducts={false} isHideQuickCtas isWrapPriceInPdpLink={false} isShowBopisButton={isShowBopisButton} />
        <button type="button" className="button-close" onClick={onClose}>Close</button>
        <button type="button" className="button-add-to-favorites" onClick={this.handleAddToWishlist}
          disabled={submitting}>Add to Favorites</button>
        <button type="button" className="button-dismiss-suggestion" onClick={onClose}>Dismiss</button>
      </div>
    ) : (
      <button className="button-suggested" onClick={this.handleOpenClick}>See suggested item</button>)
    ;
  }
}
