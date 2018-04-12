/** @module productsAndItemsPropTypes
 * @summary basic propTypes used for coupons
 *
 * @author Ben
 */
import {PropTypes} from 'prop-types';
import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart';

/** describes a color or a pattern of a product/SKU */
export const COLOR_PROP_TYPE = PropTypes.shape({
  /** the id as well as the display name of the color */
  name: PropTypes.string.isRequired,
  /** the url of an image of this color/pattern */
  imagePath: PropTypes.string.isRequired
});

/** describes pricing information for a product/SKU */
export const PRICING_PROP_TYPES = {
  /** price before any discounts */
  listPrice: PropTypes.number.isRequired,
  /** price after discount */
  offerPrice: PropTypes.number.isRequired
};

/** describes pricing information for a product/SKU */
export const OPTIONAL_PRICING_PROP_TYPES = {
  /** price before any discounts */
  listPrice: PropTypes.number,
  /** price after discount */
  offerPrice: PropTypes.number
};

/** availability and pickup information for a product/SKU */
export const MISC_INFO_PROP_TYPES = {

  /** Flags if this SKU/product is eligible for bopis - there are cases where item is NOT eligible but selected as bopis,
  so we need to show an error message */
  isBopisEligible: PropTypes.bool,

  /** Flags if this SKU/product is a clearance item (used e.g., in wishlist sorting) */
  clearanceItem: PropTypes.bool,

  /** Flags if this SKU/product is a new arrival (used e.g., in wishlist sorting) */
  newArrivalItem: PropTypes.bool,

 /** optional badges (such as "Online Only") to show */
  badge1: PropTypes.string,
  badge2: PropTypes.string,
  badge3: PropTypes.string,

  isInDefaultWishlist: PropTypes.bool,

  ...OPTIONAL_PRICING_PROP_TYPES
};
export const MISC_INFO_PROP_TYPES_SHAPE = PropTypes.shape(MISC_INFO_PROP_TYPES);

export const COLOR_FITS_SIZES_MAP_PROP_TYPE = PropTypes.arrayOf(PropTypes.shape({
  color: COLOR_PROP_TYPE.isRequired,
  colorProductId: PropTypes.string.isRequired,     // the id of this product in this color
  colorDisplayId: PropTypes.string,                // the id of this product in this color to display and send to recommendations API
  miscInfo: MISC_INFO_PROP_TYPES_SHAPE,
  favoritedCount: PropTypes.number,                // the number of times other users put an item with this colorProductId in thier wishlists
  maxAvailable: PropTypes.number.isRequired,       // the maximum value of any nested maxAvailable value
  hasFits: PropTypes.bool.isRequired,              // indicates if this product has fits associated with it (if false, the fits array should have a single element)
  fits: PropTypes.arrayOf(PropTypes.shape({
    fitName: PropTypes.string,                     // ignored if the hasFits flag is false
    isDefault: PropTypes.bool,                     // indicates that this fit is the default fit for this color
    maxAvailable: PropTypes.number.isRequired,     // the maximum value of any nested maxAvailable value
    sizes: PropTypes.arrayOf(PropTypes.shape({
      sizeName: PropTypes.string.isRequired,
      skuId: PropTypes.string.isRequired,          // the id of the SKU for the product in this color, fit and size
      maxAvailable: PropTypes.number.isRequired,   // the maximum number of available items for sale of this SKU
      ...OPTIONAL_PRICING_PROP_TYPES               // the pricing info associated with this sku (optionlaly overriding the pricing at higher levels)
    })).isRequired
  })).isRequired
}));

/**
 *  Describes a general product, not yet specialized by chosing a color, size, etc.
 *  For example, a product shown in reccomendations, or PDP.
 */
export const PRODUCT_INFO_PROP_TYPES = {
  /* this identifies a product for Bazaarvoice (reviews and ratings component) */
  ratingsProductId: PropTypes.string,

  /** This identifies the product regardless of color/fit/size (i.e., changing size/fit/color does not change this value) */
  generalProductId: PropTypes.string.isRequired,
  /** The name of the product to be displayed to the user */
  name: PropTypes.string.isRequired,
  /** Images for this product in different colors.
   * This is an object of key-vale pairs. the key is the color name, and the value has thew shape described below.
   */
  imagesByColor: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.shape({
      extraImages: PropTypes.arrayOf(PropTypes.shape({
        iconSizeImageUrl: PropTypes.string.isRequired,
        regularSizeImageUrl: PropTypes.string.isRequired,
        bigSizeImageUrl: PropTypes.string.isRequired,
        superSizeImageUrl: PropTypes.string.isRequired
      }))
    })),
    PropTypes.objectOf(PropTypes.shape({
      basicImageUrl: PropTypes.string.isRequired
    }))
  ]),
  /** optional displayNames of the color fit and size (e.g., for gift cards it is {color: 'Design, size: 'Value']) */
  colorFitSizeDisplayNames: PropTypes.shape({ color: PropTypes.string, fit: PropTypes.string, size: PropTypes.string }),
  /**
   * The available color fit and size options for this product
   * Organized in a three level nesting (similar to a site navigation) with L1 being the color,
   * L2 being the fit, and L3 being the size
   */
  colorFitsSizesMap: COLOR_FITS_SIZES_MAP_PROP_TYPE,

  /** SEO Friendly URL required to have the image and title linkable */
  pdpUrl: PropTypes.string.isRequired,

  /* Short description of the product. */
  shortDescription: PropTypes.string,

  /* Long description of the product that may include HTML. */
  longDescription: PropTypes.string,

  /** Flags if this SKU/product is a Gift-Card */
  isGiftCard: PropTypes.bool,

  /** Product price, which may be overriden by sku-level price */
  ...PRICING_PROP_TYPES
};
export const PRODUCT_INFO_PROP_TYPE_SHAPE = PropTypes.shape(PRODUCT_INFO_PROP_TYPES);

/**
 *  Extra information (to add to product_info)  that describes a specific SKU (Stock Keeping Unit),
 *  i.e., a product with a specific size, color, etc.
 *  This represents a physical thing that a client can hold in its hand.
 */
export const SKU_INFO_PROP_TYPES = {
  /** This identifies the product with a given color fit and size combination */
  skuId: PropTypes.string.isRequired,
  /** the UPC of the product */
  upc: PropTypes.string,
  /** the url of the image of the product */
  imageUrl: PropTypes.string.isRequired,
  /** The color/pattern (not always required -- e.g. gift cards) */
  color: COLOR_PROP_TYPE,
  /** The fit (e.g. 'slim') */
  fit: PropTypes.string, // not required for gift cards
  /** The size (e.g. '5S') */
  size: PropTypes.string, // not required for gift cards
  /** optional sku-level price */
  ...OPTIONAL_PRICING_PROP_TYPES
};
export const SKU_INFO_PROP_TYPE_SHAPE = PropTypes.shape(SKU_INFO_PROP_TYPES);

/**
 *  Extra information (to add to product_info and sku_info) to describe an item in a cart or wihslist.
 */
export const ITEM_INFO_PROP_TYPES = {
  /** the id of this item */
  itemId: PropTypes.string.isRequired,
  /** This cart/wihslist item is made up of quantity many copies of some SKU */
  quantity: PropTypes.number.isRequired,
  /** If falsy (i.e., null, undefined, etc.) this item is to be shipped;
   * otherwise, it is the name of the store from which it is to be picked up
   */
  store: PropTypes.string,      // FIXME: allow full store information -- look in myAccount orders.
  /** FIXME: why is this here? zipcode for edit modal */
  storeZipCode: PropTypes.string,
  /**
   * if <code>OK</code>, the item is available (in required quantity);
   * if <code>UNAVAILABLE</code> this item is unavailable at required quantity (but may be available in another color/size/fit)
   * if <code>SOLDOUT</code> this SKU is sold out (i.e., not available in any color/size/fit)
   */
  availability: PropTypes.oneOf([
    AVAILABILITY.OK,
    AVAILABILITY.UNAVAILABLE,
    AVAILABILITY.SOLDOUT
  ]).isRequired
};
export const ITEM_INFO_PROP_TYPE_SHAPE = PropTypes.shape(ITEM_INFO_PROP_TYPES);

/**
 * Information about a recommended product
 */
export const RECOMMENDED_PRODUCT_PROP_TYPES = {
  generalProductId: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  department: PropTypes.string,
  ...PRICING_PROP_TYPES,
  pdpUrl: PropTypes.string.isRequired
};
export const RECOMMENDED_PRODUCT_PROP_TYPE_SHAPE = PropTypes.shape(RECOMMENDED_PRODUCT_PROP_TYPES);

/**
 * Information about a recommended outfit
 */
export const RECOMMENDED_OUTFIT_PROP_TYPES = {
  generalProductId: PropTypes.string.isRequired, // the id of the outfit
  name: PropTypes.string,                        // the name of the outfit - outfits don't have names, removing isRequired to prevent propType error
  imagePath: PropTypes.string.isRequired,        // the image of the outfit
  productIds: PropTypes.string.isRequired        // the ids of the products in this outfit
};
export const RECOMMENDED_OUTFIT_PROP_TYPE_SHAPE = PropTypes.shape(RECOMMENDED_OUTFIT_PROP_TYPES);
