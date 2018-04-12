/** @module CartItem
 * @summary a presentational component that renders a single product in a shopping cart.
 *
 * @Author Florencia Acosta
 * @Author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CartItemBopisDetails} from './CartItemBopisDetails.jsx';
import {CartItemEditableDataFormContainer} from './CartItemEditableDataFormContainer.jsx';
import {CartItemEditableDetailsDisplay} from './CartItemEditableDetailsDisplay.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {Notification} from 'views/components/common/Notification.jsx';
import {AVAILABILITY} from 'reduxStore/storeViews/cartStoreView';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import {BASIC_CART_ITEM_PROP_TYPE} from 'views/components/common/propTypes/cartItemPropTypes';
import {Spinner} from 'views/components/common/Spinner.jsx';

if (DESKTOP) {      // eslint-disable-line
  require('./_d.cart-items.scss');
} else {
  require('./_m.cart-items.scss');
}

// extends PureComponent so we do not render if props did not change
export class CartItem extends React.PureComponent {

  static propTypes = {
    /** Flags if to use condensed version for mini-bag use */
    isCondense: PropTypes.bool,

    /** When flase, flags that BOPIS is globaly disabled */
    isBopisEnabled: PropTypes.bool,
    /** This is a backend kill switch to enable/disable BOPIS for clearance items */
    isBopisClearanceProductEnabled: PropTypes.bool,
    /** callback for clicks on BOPIS CTAs. Accepts: generalProductId, initialValues, colorProductId. Required if isBopisEnabled prop is true. */
    onQuickBopisOpenClick: PropTypes.func,

    ...BASIC_CART_ITEM_PROP_TYPE,

    /** Information on how to render this item */
    itemStatus: PropTypes.shape({
      /** Flags if we need to show a spinner while waiting for the backend to complete an update of this item */
      isUpdating: PropTypes.bool,
      /** Flags that the item shuold display the form that allows the user to change the color, size, etc. */
      isEditable: PropTypes.bool
    }).isRequired,

    /** a callback to delete item. It should accept a single parameter that is the itemId */
    onDeleteItem: PropTypes.func.isRequired,

    onSetShipToHome: PropTypes.func,

    /** a callback to move item to wishlist. It should accept a single parameter that is the itemId */
    onMoveItemToWishlist: PropTypes.func.isRequired,
    /** a callback to change the item status from read-only to editable (and vice versa); accepts: itemId */
    onSetIsItemEditable: PropTypes.func.isRequired,

    /** flags if the user is allowed to try and edit this item */
    isEditAllowed: PropTypes.bool.isRequired,

    // the following are for test purposes only
    _testHoverWishlist: PropTypes.bool,
    _testHoverRemove: PropTypes.bool,

    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    /** Flags if is Mobile */
    isMobile: PropTypes.bool
  }

  constructor (props) {
    super(props);

    // indicates that BOPIS modal is open: used to prevent opening it again
    this.state = {
      isBopisModalOpen: false,
      error: null
    };

    this.handleSetItemEditable = this.handleSetItemEditable.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleMoveItemToWishlist = this.handleMoveItemToWishlist.bind(this);
    this.handleShipToSHome = this.handleShipToSHome.bind(this);
    this.handleBopisOpenRequest = this.handleBopisOpenRequest.bind(this);
    this.setError = getSetErrorInStateMethod(this);
  }

  handleDeleteItem () {
    return this.props.onDeleteItem(this.props.itemInfo.itemId)
      .catch((err) => this.setError(err));      // note that we do not setError() on success since this component gets unmounted on success
  }

  handleMoveItemToWishlist () {
    return this.props.onMoveItemToWishlist(this.props.itemInfo.itemId)
    .catch((err) => this.setError(err));      // note that we do not setError() on success since this component gets unmounted on success
  }

  handleSetItemEditable () {
    this.setError();
    this.props.onSetIsItemEditable(this.props.itemInfo.itemId).catch((err) => this.setError(err));
  }

  handleShipToSHome () {
    this.setError();
    let {itemInfo: {itemId}} = this.props;
    return this.props.onSetShipToHome(itemId).catch((err) => this.setError(err));
  }

  handleBopisOpenRequest () {
    let {productInfo, itemInfo, onQuickBopisOpenClick} = this.props;

    onQuickBopisOpenClick(
      productInfo.generalProductId,
      {
        color: productInfo.color.name,
        fit: productInfo.fit,
        size: productInfo.size,
        quantity: itemInfo.quantity
      },
      productInfo.generalProductId,
      itemInfo.itemId);
  }

  render () {
    let {
      isCondense, isBopisEnabled, currencySymbol, isBopisClearanceProductEnabled,
      productInfo, itemInfo,
      miscInfo: {isOnlineOnly, clearanceItem, store, availability, isBopisEligible},
      itemStatus: {isUpdating, isEditable},
      isEditAllowed, isMobile,
      _testHoverWishlist, _testHoverRemove
    } = this.props;
    let {error} = this.state;
    let {generalProductId, /* skuId, */ name, imagePath, upc, color, fit, size, pdpUrl, isGiftCard, colorFitSizeDisplayNames} = productInfo;
    let {quantity, itemId, listPrice, offerPrice} = itemInfo;

    let productState = (availability === AVAILABILITY.SOLDOUT)
      ? ' sold-out'
      : (availability === AVAILABILITY.UNAVAILABLE) && ' unavailable';

    isBopisEnabled = isBopisEnabled && !isGiftCard;
    // item is not editable if prop says so, or if it is a BOPIS item and we are in the minibag, or if sold-out
    isEditAllowed = isEditAllowed && !(store && isCondense) && availability !== AVAILABILITY.SOLDOUT;

    return (
      <div className={cssClassName('item-product', productState)}>
        {error && <ErrorMessage error={error} />}
        {isUpdating && <Spinner className="cart-item-loading-container" />}

        <figure>
          {(!isEditable) &&
            <div className="container-button-remove">
              <button className={cssClassName('button-remove', {' hover-remove': _testHoverRemove})}
                title={'Remove Product: ' + name} onClick={this.handleDeleteItem}></button>
              <span className={cssClassName('flag-remove-product', {' showThis': _testHoverRemove})}>REMOVE FROM BAG</span>
            </div>
          }

          <div className="product-title">
            <h4><a href={pdpUrl} className="department-name" title={name}>{name}</a></h4>
            <h4 className="upc-number">Upc: {upc}</h4>
          </div>

          <div className="container-image">
            <a href={pdpUrl} title={name}><img src={imagePath} alt={'Image for product ' + name} /></a>
          </div>

          <figcaption className="product-description">
            {isEditable
              ? <CartItemEditableDataFormContainer isCondense={isCondense} itemId={itemId} generalProductId={generalProductId}
                productName={name} initialColor={color} colorFitSizeDisplayNames={colorFitSizeDisplayNames}
                initialFit={fit} initialSize={size} initialQuantity={quantity} isShowZeroInventoryColors />
              : <CartItemEditableDetailsDisplay isCondense={isCondense} productName={name} color={color} isEditAllowed={isEditAllowed}
                colorFitSizeDisplayNames={colorFitSizeDisplayNames}
                fit={fit} size={size} quantity={quantity} itemId={itemId} setItemEditable={!store ? this.handleSetItemEditable : this.handleBopisOpenRequest} />
            }
            {/* This code is misleading - the listPrice and offerPrice values returned by backend are not the actual list/offer prices
              * Backend returns the same value for both listPrice and offerPrice UNLESS an explicit promotion is applied
              * Enhancement needed - Backend should return the actual prices and frontend should determine which values to display */}
            <div className="container-price">
              {(listPrice !== offerPrice) && <span className="text-price product-list-price">{currencySymbol + (listPrice).toFixed(2)}</span>}
              <span className="text-price product-offer-price">{currencySymbol + (offerPrice).toFixed(2)}</span>
            </div>

            {(store && isCondense) && <Notification message={`I'll pick up in store at ${store}`} />}

            {!isCondense && (isBopisEnabled || store) &&
              <CartItemBopisDetails productInfo={productInfo} itemInfo={itemInfo} isOnlineOnly={isOnlineOnly} pickUpStore={store}
                clearanceItem={clearanceItem} onQuickBopisOpenClick={this.handleBopisOpenRequest}
                onSetShipToHome={this.handleShipToSHome} isBopisModalOpen={this.state.isBopisModalOpen}
                isBopisEligible={isBopisEligible} isBopisClearanceProductEnabled={isBopisClearanceProductEnabled}
                isMobile={isMobile} isEcomSoldout={availability === AVAILABILITY.SOLDOUT}/>
            }

            {(!!store && !isBopisEligible)
              ? <div className="notification">
                <div className="notification-inline notification-unavailable">
                  <p>Sorry, pick up in store is unavailable outside the US. Please ship the items instead or remove them from your bag.</p>
                </div>
              </div>
              : (availability === AVAILABILITY.UNAVAILABLE) && <div className="notification">
                <div className="notification-inline notification-unavailable">
                  <p>Sorry, this item is now unavailable. Please select a different color, size, quantity or fit.</p>
                </div>
              </div>
            }
          </figcaption>

          {!isEditable && !isGiftCard &&
            <div className="container-button-wishlist">
              {/* REVIEW */}
              {availability === AVAILABILITY.OK
                ? <button className={cssClassName('button-add-to-wishlist ', {'hover-wishlist': _testHoverWishlist})}
                  title="Move to Favorites" onClick={this.handleMoveItemToWishlist}></button>
                : <button disabled className={cssClassName('button-add-to-wishlist disabled ', {'hover-wishlist': _testHoverWishlist})}
                  title="Move to Favorites"></button>}
              <span className={cssClassName('flag-wishlist-product', {' showThis': _testHoverWishlist})}>MOVE TO FAVORITES</span>
            </div>
          }
        </figure>
      </div>
    );
  }

}
