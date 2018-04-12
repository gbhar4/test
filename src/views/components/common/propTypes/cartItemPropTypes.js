// FIXME: consider folding into and merging with productsAndItemsPropTypes
/** @module cartItemPropTypes
 * @summary basic propTypes used for items in the shopping bag
 *
 * @author Ben
 */
import {PropTypes} from 'prop-types';
import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart';

export const BASIC_CART_ITEM_PROP_TYPE = {
  /** Information regarding the product that this cart item refers to.
   * Essentially, the cart item is just some quantity of the product.
   */
  productInfo: PropTypes.shape({
    /** optional displayNames of the color fit and size (e.g., for gift cards it is {color: 'Design, size: 'Value']) */
    colorFitSizeDisplayNames: PropTypes.shape({ color: PropTypes.string, fit: PropTypes.string, size: PropTypes.string }),
    /** This identifies the product regardless of color/fit/size (i.e., changing size/fit/color does not change this value) */
    generalProductId: PropTypes.string.isRequired,
    /** This identifies the product with a given color fit and size combination */
    skuId: PropTypes.string.isRequired,
    /** The name of the product to be displayed to the user */
    name: PropTypes.string.isRequired,
    /** the url of the image of the product */
    imagePath: PropTypes.string.isRequired,
    /** the UPC of the product */
    upc: PropTypes.string,
    /** The color/pattern */
    color: PropTypes.shape({ // not required for gift cards
      /** The color's name (e.g. 'Clay') */
      name: PropTypes.string.isRequired,
      /** The url to an image displaying this color/pattern */
      imagePath: PropTypes.string.isRequired
    }),
    /** The fit (e.g. 'slim') */
    fit: PropTypes.string, // not required for gift cards
    /** The size (e.g. '5S') */
    size: PropTypes.string, // not required for gift cards
    /** SEO Friendly URL required to have the image and title linkable */
    pdpUrl: PropTypes.string.isRequired
  }).isRequired,

  /** Information about this cart item that is not a function of the product */
  itemInfo: PropTypes.shape({
    /** This cart item is made up of quantity many copies of the product */
    quantity: PropTypes.number.isRequired,
    /** the id of this item in the cart */
    itemId: PropTypes.string.isRequired,
    /** the list price of this item (i.e., before any discounts) */
    listPrice: PropTypes.number.isRequired,
    /** the actual price the user has to pay for this item */
    offerPrice: PropTypes.number.isRequired
  }).isRequired,

  /** item availability and pickup information */
  miscInfo: PropTypes.shape({
    /** Flags if this item is only available online */
    isOnlineOnly: PropTypes.bool,

    /** Flags if this item is eligible for bopis - there are cases where item is NOT eligible but selected as bopis,
    so we need to show an error message */
    isBopisEligible: PropTypes.bool,

    /** Flags if this item is a clearance item */
    clearanceItem: PropTypes.bool,
    /** If falsy (i.e., null, undefined, etc.) this item is to be shipped;
     * otherwise, it is the name of the store from which it is to be picked up
     */
    store: PropTypes.string,

    /** zipcode for edit modal */
    storeZipCode: PropTypes.string,

    /**
     * if <code>OK</code>, the item is available;
     * if <code>UNAVAILABLE</code> this item is unavailable (but is available in another color/size/fit)
     * if <code>SOLDOUT</code> this item is sold out (i.e., not avialable in any color/size/fit)
     */
    availability: PropTypes.oneOf([
      AVAILABILITY.OK,
      AVAILABILITY.UNAVAILABLE,
      AVAILABILITY.SOLDOUT
    ]).isRequired,

    /** this is an id needed for some 3rd party APIs such as Adobe Recs */
    vendorColorDisplayId: PropTypes.string
  }).isRequired
};
