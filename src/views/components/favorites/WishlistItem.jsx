/**
* @module WishlistItem
* @summary It renders a wishlist item of many.
* @author Gabriel Gomez
* @author Florencia <facosta@minutentag.com>
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart';
import {STATUS} from 'reduxStore/storeReducersAndActions/favorites/favorites.js';
import {ProductMainImage, ProductSKUInfo, ProductTitle,
  ProductPricesSection, ProductPurchaseSection, ProductStatus, ProductWishlistIcon, ProductCartIcon,
  ProductRemoveSection} from 'views/components/product/ProductItemComponents.jsx';
import {MoveItemContainer} from 'views/components/favorites/MoveItemContainer.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {WISHLIST_ITEM_PROP_TYPE, WISHLIST_SUMMARIES_PROP_TYPE} from 'views/components/common/propTypes/favoritesPropTypes';
import {QuickViewCardProductCustomizeFormContainer} from 'views/components/productListingPages/QuickViewCardProductCustomizeFormContainer';
import {ButtonWithSpinner} from 'views/components/common/ButtonWithSpinner.jsx';
import {getSkuId} from 'util/viewUtil/productsCommonUtils';
import {ProductAltImages} from 'views/components/product/ProductAltImages.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';

if (DESKTOP) { // eslint-disable-line
  require('./_d.wishlist-item.scss');
} else {
  require('./_m.wishlist-item.scss');
}

const QUICK_VIEW_CARD_TYPES = {
  bag: 'bag',
  edit: 'edit'
};

export class WishlistItem extends React.Component {

  static propTypes = {
    isMobile: PropTypes.bool,

    /* indicates the user opened from an email link */
    isReadOnly: PropTypes.bool.isRequired,

    /** sku item props, specifically */
    wishlistItem: WISHLIST_ITEM_PROP_TYPE.isRequired,

    wishListsSummaries: WISHLIST_SUMMARIES_PROP_TYPE.isRequired,

    /** indicates monies symbol to represent the product's currency */
    currencySymbol: PropTypes.string.isRequired,

    /** callback to remove item from the wishlist */
    onRemoveItem: PropTypes.func.isRequired,
    /** callback to edit wishlist item  */
    onEditItem: PropTypes.func.isRequired,
    /** callback to add item to bag */
    onAddItemToBag: PropTypes.func.isRequired,
    /** callback to add item to bag */
    onAddItemToBagSuccess: PropTypes.func.isRequired,

    /** flags whether to show the quickview card */
    isShowQuickView: PropTypes.bool.isRequired,
    /** callback for clicks on quickView CTAs. Accepts a generalProductId, colorProductId, itemId */
    onQuickViewOpenClick: PropTypes.func.isRequired
    /** callback for clicks on quickView CTAs. Accepts a generalProductId, itemId, initialValues:{color,fit,size,quantity} */
//    onQuickBopisOpenClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      isOpenMoveList: !!props.isOpenMoveList,
      isCreateNewList: false,
      error: null
    };

    this.handleRemoveItem = this.handleRemoveItem.bind(this);

//    this.handleQuickBopisOpenClick = this.handleQuickBopisOpenClick.bind(this);
    this.handleAddToBagClick = this.handleAddToBagClick.bind(this);
    this.handleOpenEditQuickViewClick = this.handleOpenEditQuickViewClick.bind(this);

    this.handleSubmitAddItemToBag = this.handleSubmitAddItemToBag.bind(this);
    this.handleSubmitEditItem = this.handleSubmitEditItem.bind(this);
    this.setError = getSetErrorInStateMethod(this);
  }

  handleAddToBagClick () {
    let {wishlistItem,
      wishlistItem: {skuInfo: {skuId, size},
      productInfo: {generalProductId},
      itemInfo: {itemId}
    }} = this.props;

    if (skuId && size) {
      return this.props.onAddItemToBag(wishlistItem, {wishlistItemId: itemId})
      .then((res) => this.props.onAddItemToBagSuccess(res))
      .catch((err) => this.setError(err));
    } else {
      this.setState({quickViewCardType: QUICK_VIEW_CARD_TYPES.bag});
      return this.props.onQuickViewOpenClick(generalProductId, generalProductId, itemId)
      .catch((err) => this.setError(err));
    }
  }

  handleOpenEditQuickViewClick (event) {
    event.preventDefault();
    event.stopPropagation();

    let {wishlistItem: {
      productInfo: {generalProductId},
      itemInfo: {itemId}
    }} = this.props;

    this.setState({quickViewCardType: QUICK_VIEW_CARD_TYPES.edit});
    return this.props.onQuickViewOpenClick(generalProductId, generalProductId, itemId);
  }

  handleRemoveItem () {
    this.props.onRemoveItem({
      itemId: this.props.wishlistItem.itemInfo.itemId
    }).catch((err) => this.setError(err));
  }

  handleSubmitAddItemToBag (productInfo, formData) {
    let {wishlistItem: {itemInfo: {itemId}}} = this.props;
    return this.props.onAddItemToBag(productInfo, {...formData, wishlistItemId: itemId})
    .catch((err) => this.setError(err));
  }

  handleSubmitEditItem (productInfo, formData) {
    let {wishlistItem: {itemInfo: {itemId}}} = this.props;
    let {color, fit, size, quantity} = formData;

    let newSkuId = getSkuId(productInfo.colorFitsSizesMap, color, fit, size);
    return this.props.onEditItem({itemId, newSkuId, quantity});
  }

  /*
   * DT-31295
   * Need to pass onSubmitSuccess to QuickViewCardProductCustomizeFormContainer
   * or quickViewOperator.openAddedToBagNotification will be called by default
   * Calling quickViewOperator.openAddedToBagNotification when no item has been added to the bag
   * throws an error and prevents the Modal from properly closing on mobile
   */
  handleSubmitEditItemSuccess () {
    // Handle submission success here in future?
    // For now it's empty to fix DT-31295
  }

  renderQuickViewCardOrLink () {
    return this.props.isShowQuickView && this.state.quickViewCardType === QUICK_VIEW_CARD_TYPES.bag
      ? <QuickViewCardProductCustomizeFormContainer initialValues={this.getCustomizationValues()} onSubmit={this.handleSubmitAddItemToBag} />
      : <ProductCartIcon isMobile={this.props.isMobile} onClick={this.handleAddToBagClick} />;
  }

  renderEditQuickViewCardOrLink () {
    if (this.props.isReadOnly) {
      return null;
    }

    return this.props.isShowQuickView && this.state.quickViewCardType === QUICK_VIEW_CARD_TYPES.edit
      ? <QuickViewCardProductCustomizeFormContainer initialValues={this.getCustomizationValues()} onSubmit={this.handleSubmitEditItem}
        submitButtonText="Save Product Details" onSubmitSuccess={this.handleSubmitEditItemSuccess} />
      : !(this.props.wishlistItem.itemInfo.availability === AVAILABILITY.SOLDOUT)
        ? <ButtonWithSpinner spinnerClassName="edit-icon-spinner" type="button" className="button-edit"
          onClick={this.handleOpenEditQuickViewClick}>Edit</ButtonWithSpinner>
        : null;
  }

  render () {
    let {
      isMobile, currencySymbol, isReadOnly,
      wishlistItem: {
        skuInfo: {color, fit, size},
        productInfo: {name, pdpUrl, offerPrice, listPrice},
        itemInfo: {itemId, quantity, availability},
//        miscInfo: {isBopisEligible},
        imagesByColor,
        quantityPurchased
      },
      wishListsSummaries
    } = this.props;

    let {error} = this.state;
    let itemClassName = cssClassName(
      'item-container product-item-container ',
      {'item-read-only-container ': isReadOnly, 'sold-out-item ': availability === AVAILABILITY.SOLDOUT}
    );

    let imageUrls = imagesByColor[color.name].extraImages.map((imageEntry) => imageEntry.regularSizeImageUrl);

    return (
      <li className={itemClassName} key={itemId}>
        <div className="item-button-container">
          {!isReadOnly && <ProductWishlistIcon onClick={this.handleRemoveItem} isDisabled={availability === AVAILABILITY.SOLDOUT} isRemove isMobile={isMobile}/>}
          {!isMobile && availability !== AVAILABILITY.SOLDOUT && this.renderQuickViewCardOrLink()}
          {/* !isMobile && availability !== AVAILABILITY.SOLDOUT && isBopisEligible && <ProductPickupIcon isMobile={isMobile} onClick={this.handleQuickBopisOpenClick} /> */}
        </div>

        <ProductStatus status={(quantityPurchased > 0 && STATUS.PURCHASED) || availability} />

        {isMobile || imageUrls.length < 2
          ? <ProductMainImage pdpUrl={pdpUrl} imageUrl={imageUrls[0]} productName={name} isMobile={isMobile}/>
          : <ProductAltImages pdpUrl={pdpUrl} imageUrls={imageUrls} productName={name} />
        }

        {error && <ErrorMessage error={error} />}

        {this.renderEditQuickViewCardOrLink()}

        <ProductSKUInfo color={color} size={size} fit={fit} />
        <ProductTitle name={name} pdpUrl={pdpUrl} />

        {(availability === AVAILABILITY.SOLDOUT)
          ? <ProductRemoveSection onClick={this.handleRemoveItem} itemId={itemId} />
          : <ProductPricesSection currencySymbol={currencySymbol} listPrice={listPrice} offerPrice={offerPrice} />
        }

        {isMobile && (availability !== AVAILABILITY.SOLDOUT) &&
          <div className="item-button-container">
            {this.renderQuickViewCardOrLink()}
            {/* isBopisEligible && <ProductPickupIcon isMobile={isMobile} onClick={this.handleQuickBopisOpenClick} /> */}
          </div>
        }

        {availability !== AVAILABILITY.SOLDOUT && <div className="purchased-and-move-dropdown-container">
          <ProductPurchaseSection key="purchased-section" purchased={quantityPurchased} quantity={quantity} />
          {!isReadOnly && <MoveItemContainer key="move-item-select" wishlistItemId={itemId} favoriteList={wishListsSummaries} />}
        </div>}
      </li>
    );
  }

  getCustomizationValues () {
    let {wishlistItem: {skuInfo: {color, fit, size}, itemInfo: {quantity}}} = this.props;
    let values = {
      color: color.name,
      fit,
      quantity
    }

    /*
     * DT-31676
     * For wishlist items that DO NOT have a selected size, size is being passed as null
     * This means the default size calculated in quickViewStoreView.getQuickViewFormInitialValues() is being overwritten
     * Therefore we only want to pass the size value if it is not null
     */
    if (size) {
      values.size = size;
    }

    return values;
  }
}
