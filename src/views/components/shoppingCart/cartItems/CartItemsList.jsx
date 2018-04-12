/** @module CartItemsList
 * @summary a presentational component for rendering the list of items in a shopping cart.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CartItem} from 'views/components/shoppingCart/cartItems/CartItem.jsx';
import {CartGhostItem} from 'views/components/shoppingCart/cartItems/CartGhostItem.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {BopisModalContainerQuick} from 'views/components/bopis/BopisModalContainerQuick';

export class CartItemsList extends React.Component {

  static propTypes = {
     /** Flags if is Mobile */
    isMobile: PropTypes.bool,

    /** Flags if to use condensed version for mini-bag use */
    isCondense: PropTypes.bool,

    /** Flags if BOPIS is enabled. */
    items: PropTypes.arrayOf(PropTypes.shape({
      /** Information regarding the product that this cart item refers to.
       * Essentially, the cart item is just some quantity of the product.
       */
      productInfo: CartItem.propTypes.productInfo,

      /** Information about this cart item that is not a function of the product */
      itemInfo: CartItem.propTypes.itemInfo,

      /** item availability and pickup information */
      miscInfo: CartItem.propTypes.miscInfo,

      /** Information on how to render this item */
      itemStatus: PropTypes.shape({
        /** Flags if the item has been deleted from the cart (the item may be visible for a few seconds after being deleted) */
        isDeleted: PropTypes.bool,
        // FIXME: remove unused props and rendering code related to nex two props
        /** Flags if the item has been moved to a wishlist (the item may be visible for a few seconds after being moved) */
        isWishlist: PropTypes.bool,
        /** Flags if we need to show a spinner while waiting for the backend to complete an update of this item */
        isUpdating: PropTypes.bool,
        /** Flags that the item shuold display the form that allows the user to change the color, size, etc. */
        isEditable: PropTypes.bool
      }).isRequired
    })).isRequired,

    /** callback to handle request to start editing a cart item */
    onEnterEditItem: PropTypes.func.isRequired,

    /** callback to handle request to delete a cart item */
    onDeleteItem: PropTypes.func.isRequired,

    /** callback to handle request to start editing a cart item */
    onMoveItemToWishlist: PropTypes.func.isRequired,

    onSetShipToHome: PropTypes.func,

    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    /** This is a backend kill switch to enable/disable BOPIS for clearance items */
    isBopisClearanceProductEnabled: PropTypes.bool,
    /** When flase, flags that BOPIS is globaly disabled */
    isBopisEnabled: PropTypes.bool,
    /** Flags whether the BOPIS modal should be visible */
    isShowBopisModal: PropTypes.bool,
    /** callback for clicks on BOPIS CTAs. Accepts: generalProductId, initialValues, colorProductId. Required if isBopisEnabled prop is true. */
    onQuickBopisOpenClick: PropTypes.func,
    /** callback for updating the item in the cart */
    onUpdateBopisItemInCart: PropTypes.func.isRequired
  }

  render () {
    let {isMobile, className, items, isCondense, currencySymbol, isShowBopisModal, isBopisEnabled, isBopisClearanceProductEnabled,
      onEnterEditItem, onDeleteItem, onMoveItemToWishlist, onSetShipToHome, onQuickBopisOpenClick, onUpdateBopisItemInCart} = this.props;

    let isAnItemBeingEdited = items.findIndex((item) => item.itemStatus.isEditable) >= 0;
    let cartItemListClassName = cssClassName('container-list-shopping-cart ', className);

    return (
      <div className={cartItemListClassName}>
        <ol>
          {items.map((item) => { // render each products
            return (
              <li key={item.itemInfo.itemId} className={cssClassName('item-shopping-cart ', {
                'deleted-item': item.itemStatus.isDeleted,
                'wishlist-new-item': item.itemStatus.isWishlist
              })}>
              {item.itemStatus.isDeleted || item.itemStatus.isWishlist
                ? <CartGhostItem productName={item.productInfo.name} ghostReason={item.itemStatus.isDeleted ? 'DELETED' : 'WISHLIST'} isMobile={isMobile} />
                : <CartItem isCondense={isCondense} {...item} isMobile={isMobile}
                  onDeleteItem={onDeleteItem} onMoveItemToWishlist={onMoveItemToWishlist}
                  onSetIsItemEditable={onEnterEditItem} isEditAllowed={!isAnItemBeingEdited}
                  onSetShipToHome={onSetShipToHome} currencySymbol={currencySymbol}
                  isBopisEnabled={isBopisEnabled} isBopisClearanceProductEnabled={isBopisClearanceProductEnabled}
                  onQuickBopisOpenClick={onQuickBopisOpenClick} />
              }
              </li>
            );
          })}
        </ol>
        {isShowBopisModal &&
          <BopisModalContainerQuick isShowAddItemSuccessNotification={false} isShoppingBag onAddItemToCart={onUpdateBopisItemInCart} />
        }
      </div>
    );
  }

}
