/**
 * @module ProductItemComponents
 * Container of smaller function that will be renderer as Component to create a ProductItem.
 *
 * @author Florencia <facosta@minutentag.com>
 */

import React from 'react'; // eslint-disable-line no-unused-vars
import cssClassName from 'util/viewUtil/cssClassName.js';
import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart';
import {STATUS} from 'reduxStore/storeReducersAndActions/favorites/favorites.js';
import {WishlistSuggestedItemContainer} from 'views/components/favorites/WishlistSuggestedItemContainer.js';
import {ButtonWithSpinner} from 'views/components/common/ButtonWithSpinner.jsx';
import {isTouchClient} from 'routing/routingHelper';
import {ServerToClientRenderPatch} from 'util/ServerToClientRenderPatch';
import LazyLoad from 'react-lazy-load';

require('./_cart-fav-pickup-button.scss');

export function ProductMainImage (props) {
  let {imageUrl, productName, pdpUrl, isMobile} = props;
  let offset = isMobile ? 4000 : 2000;

  return (
    <figure className="product-image-container" itemScope itemType="http://schema.org/ImageObject">
      <a href={pdpUrl} title={productName}>
        <LazyLoad offsetVertical={offset} debounce="false" throttle="100">
          <img className="product-image-content img-item" src={imageUrl} alt={productName} itemProp="contentUrl" />
        </LazyLoad>
      </a>
    </figure>
  );
}

export function ProductSKUInfo (props) {
  let {color, size, fit} = props;

  if (!color && !size && !fit) {
    return null;
  }

  return (
    <div className="product-sku-info-container">
      {color && <img src={color.imagePath} alt={color.name} className="img-color" />}
      {size && <span className="size-container">Size {size}</span>}
      {(size && fit) && <i className="separator-bar-icon">|</i>}
      {fit && <span className="fit-container">{fit}</span>}
    </div>
  );
}

export function ProductTitle (props) {
  let {name, pdpUrl, children} = props;

  return (
    <div className="product-title-container">
      <h3><a href={pdpUrl} className="product-title-content name-item">{name}</a></h3>
      {children}
    </div>
  );
}

/* NOTE: This issue (DT-28867) added isMobile condition. */
/* NOTE: As per DT-29548, isMobile condition is not valid. "Offer" price should be shown below "List" price (always) */
/* NOTE: DT-27216, if offerPrice and listPrice are the same, just offerPrice should be shown (and will be black) */
export function ProductPricesSection (props) {
  let {currencySymbol, listPrice, offerPrice} = props;
  let offerPriceClass = cssClassName('text-price ', 'offer-price ', {'offer-price-only': (offerPrice === listPrice)});
  let listPriceClass = cssClassName('text-price ', 'list-price ');
  return (
    <div className="container-price">
      {offerPrice && <span className={offerPriceClass}>{currencySymbol + (offerPrice).toFixed(2)}</span>}
      {(offerPrice && (offerPrice !== listPrice)) && <span className={listPriceClass}>Was: {currencySymbol + (listPrice).toFixed(2)}</span>}
    </div>
  );
}

export function ProductPurchaseSection (props) {
  let {purchased, quantity} = props;
  purchased = !purchased ? 0 : purchased;
  quantity = parseInt(quantity);
  return (
    <div className="purchased-status-container count-purchase">
      <span className="purchased-status-content">{purchased}/{quantity}</span>
      <span className="purchased-status-flag"> Purchased</span>
    </div>
  );
}

export function ProductStatus (props) {
  let {status} = props;
  let notification;

  switch (status) {
    case STATUS.PURCHASED:
      notification = 'Purchased';
      break;
    case STATUS.SUGGESTED:
      notification = 'Suggested';
      break;
    case AVAILABILITY.SOLDOUT:
      notification = 'Sold out';
      break;
    case AVAILABILITY.OK:
      return null;
    default:
      return null;
  }

  return <span className="notification-item">{notification}</span>;
}

export function ProductCartIcon (props) {
  let {isMobile, onClick, className} = props;
  className = isMobile
    ? cssClassName('bag-button-container ', className)
    : cssClassName('bag-icon-container ', {'hover-button-enabled ': !isTouchClient()}, className);

  let spinnerClassName = cssClassName(isMobile ? 'bag-button-icon-spinner ' : 'bag-icon-spinner inline-spinner-item ');

  return (
    <ButtonWithSpinner spinnerClassName={spinnerClassName} type="button" aria-label="" className={className} onClick={onClick}>
      <span className={cssClassName({'message-icon ': !isMobile})}>Add to bag</span>
    </ButtonWithSpinner>
  );
}

export function ProductPickupIcon (props) {
  let {isMobile, onClick, className} = props;
  className = isMobile
    ? cssClassName('pickup-button-container ', className)
    : cssClassName('pickup-icon-container ', {'hover-button-enabled ': !isTouchClient()}, className);

  let spinnerClassName = cssClassName(isMobile ? 'pickup-button-icon-spinner ' : 'pickup-icon-spinner inline-spinner-item ');

  return (
    <ButtonWithSpinner spinnerClassName={spinnerClassName} type="button" className={className} onClick={onClick}>
      <span className={cssClassName({'message-icon ': !isMobile})}>Pick up in store</span>
    </ButtonWithSpinner>
  );
}

export class ProductWishlistIcon extends ServerToClientRenderPatch {
  render () {
    let { onClick, className, activeButton, isRemove, isDisabled, isMobile } = this.props;
    let { isTouchClient } = this.state;
    let removeTextHeader = (isMobile)
      ? 'Tap to Remove'
      : 'Click to Remove';
    let removeTxtDesc = (isMobile)
      ? 'Remove this item from your Favorites List by tapping the heart icon again.'
      : 'Remove this item from your Favorites List by clicking the heart icon again.';
    className = cssClassName(
      { 'favorite-icon-active ': activeButton || isRemove },
      { 'hover-button-enabled ': !isTouchClient },
      'favorite-icon-container ',
      className
    );

    return (
      <button type="button" className={className} onClick={onClick} disabled={isDisabled}>
        Favorites
      {isRemove
          ? <div className="information-remove">
            <p className="information-remove-message">
              <strong className="remove-title">{removeTextHeader}</strong>
              <br />
              {removeTxtDesc}
            </p>
          </div>
          : <span className="message-icon">Add to favorites</span>}
      </button>
    );
  }
}

export function ProductRemoveSection (props) {
  let {onClick, itemId} = props;

  return (
    <div className="remove-buttons-container">
      <button type="button" className="button-remove" onClick={onClick}>Remove</button>
      <WishlistSuggestedItemContainer itemId={itemId} />
    </div>
  );
}

export function BadgeItem (props) {
  let {text, className} = props;
  let containerClassName = cssClassName('badge-item-container ', className);

  if (!text || text === null) {
    return null;
  }

  return (
    <div className={containerClassName}>
      <p>{text}</p>
    </div>
  );
}

// export function BagButtons (props) {
//   let {onClickOpenQuickView, onClickOpenBopis} = props;
//
//   return (
//     <div className="bag-button-container">
//       <button type="button" className="button-quaternary button-add-to-bag" onClick={onClickOpenQuickView}>Add to bag</button>
//       <button type="button" className="button-quaternary button-pick-up" onClick={onClickOpenBopis}>Pick up in store</button>
//     </div>
//   );
// }
