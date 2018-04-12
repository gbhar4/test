/**
 * @module OrderItem
 * Shows a list of items in a submitted purchase order.
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

class OrderItem extends React.Component {
  static propTypes = {
    /** item to show in the list */
    item: PropTypes.shape({
      /**
       * Information regarding the product that this order item refers to.
       * Essentially, the order item is just some quantity of the product
       */
      productInfo: PropTypes.shape({
        /** The name of the product to be displayed to the user */
        name: PropTypes.string.isRequired,
        /** the url of the image of the product */
        imagePath: PropTypes.string.isRequired,
        /** The color/pattern */
        color: PropTypes.shape({
          /** The color's name (e.g. 'Clay') */
          name: PropTypes.string.isRequired
        }),
        /** The fit (e.g. 'slim') */
        fit: PropTypes.string,
        /** The size (e.g. '5S') */
        size: PropTypes.string.isRequired,
        /** The universal product code of the product */
        upc: PropTypes.string.isRequired,
        /** Path to the product details page */
        pdpUrl: PropTypes.string.isRequired
      }).isRequired,

      /** Information about this order item that is not a function of the product */
      itemInfo: PropTypes.shape({
        /** This order item is made up of quantity many copies of the product */
        quantity: PropTypes.number.isRequired,
        /** the list price of this item (i.e., before any discounts) */
        listPrice: PropTypes.number.isRequired,
        /** the actual price the user has to pay for this item */
        offerPrice: PropTypes.number.isRequired,
        /** number of canceled items for this item */
        quantityCanceled: PropTypes.number.isRequired
      }).isRequired

    }).isRequired,
    /** this is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,
    /** flags whether to show the Write a Review link or not */
    isShowWriteReview: PropTypes.bool.isRequired,
    /** flags if the item is being included in a canceled items list */
    isCanceledList: PropTypes.bool
  }

  renderDesktop () {
    let {item: {
      productInfo: {name, imagePath, color, fit, size, upc, pdpUrl},
      itemInfo: {linePrice, quantity, quantityCanceled, listPrice, offerPrice}
    }, currencySymbol, isCanceledList, isShowWriteReview} = this.props;

    let idemListAndOfferPrice = listPrice === offerPrice;

    return (
      <tr className="item-shopping-cart">
        <td>
          <div className="container-image">
            <img src={imagePath} alt={`Image for product ${name}`} />
          </div>
          <figcaption className="product-description">
            <h4 className="product-title-in-table">{name}</h4>
            <span className="text-upc">UPC: {upc}</span>
          </figcaption>
          <div className="container-description-view">
            <span className="text-color">Color: {color.name}</span>
            {fit && <span className="text-fit">Fit: {fit}</span>}
            <span className="text-size">Size: {size}</span>
          </div>
        </td>
        <td className={cssClassName('text-price', ' product-list-price', {' product-price-within-offer': idemListAndOfferPrice})}>{currencySymbol}{listPrice.toFixed(2)}</td>
        <td className="text-price product-offer-price">{currencySymbol}{offerPrice.toFixed(2)}</td>
        <td className="text-qty">{isCanceledList ? quantityCanceled : quantity}</td>
        <td className="subtotal">{currencySymbol}{(linePrice || 0).toFixed(2)}</td>

        {isShowWriteReview &&
          <td className="button-write-review-container">
            <a href={pdpUrl} className="button-write-review">Write a Review</a>
          </td>
        }
      </tr>
    );
  }

  renderMobile () {
    let {item: {
      productInfo: {name, imagePath, color, fit, size, upc, pdpUrl},
      itemInfo: {linePrice, quantity, quantityCanceled, listPrice, offerPrice}
    }, currencySymbol, isShowWriteReview, isCanceledList} = this.props;

    let idemListAndOfferPrice = listPrice === offerPrice;

    return (
      <li className="item-shopping-cart">
        <div className="information-principal">
          <div className="container-image">
            <img src={imagePath} alt={'Image for product ' + name} />
          </div>

          <figcaption className="product-description">
            <h4 className="product-title-in-table">{name}</h4>

            <div className="container-description-view">
              <span className="text-color">Color: {color.name}</span>
              {fit && <span className="text-fit">Fit: {fit}</span>}
              <span className="text-size">Size: {size}</span>
              <span className="text-upc">UPC: {upc}</span>
              <span className="text-qty">Qty: {isCanceledList ? quantityCanceled : quantity}</span>

              <span className="product-list-table">
                <strong className={cssClassName('product-list-price', {' product-price-within-offer': idemListAndOfferPrice})}>{currencySymbol}{listPrice.toFixed(2)}</strong>
                <strong className="product-offer-price">{currencySymbol}{offerPrice.toFixed(2)}</strong>
              </span>
              {isShowWriteReview && <span className="button-write-review-container">
                <a href={pdpUrl} className="button-write-review">Write a Review</a>
              </span>
              }
            </div>
          </figcaption>

        </div>
        <div className="subtotal-table subtotal">{currencySymbol}{(linePrice || 0).toFixed(2)}</div>
      </li>
    );
  }

  render () {
    let {isMobile} = this.props;

    return (
      isMobile
        ? this.renderMobile()
        : this.renderDesktop()
    );
  }
}

export {OrderItem};
