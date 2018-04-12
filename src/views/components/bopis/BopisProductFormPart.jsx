/** @module BopisProductFormPart
 *
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ProductCustomizeFormPart} from 'views/components/product/formDetails/ProductCustomizeFormPart.jsx';
import {PRICING_PROP_TYPES, COLOR_FITS_SIZES_MAP_PROP_TYPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

if (DESKTOP) {      // eslint-disable-line
  require('views/components/product/formDetails/_d.cart-item-editable-data-form.scss');
} else {
  require('views/components/product/formDetails/_m.cart-item-editable-data-form.scss');
}

export const BOPIS_PRODUCT_INFO_PROP_TYPES = {
  /** The name of the item (e.g. 'Boys Five-Pocket Skinny Corduroy Pants') */
  name: PropTypes.string.isRequired,
  /** Standard pricing attr */
  ...PRICING_PROP_TYPES,
  /** the url of the image of the product */
  imagePath: PropTypes.string.isRequired,
  /**
   * The available color fit and size options for this product
   * Organized in a three level nesting (similar to a site navigation) with L1 being the color,
   * L2 being the fit, and L3 being the size
   */
  colorFitsSizesMap: COLOR_FITS_SIZES_MAP_PROP_TYPE
};

export class BopisProductFormPart extends React.Component {
  static propTypes = {
    /** the whole product detail to have it engaged on BOPIS form */
    ...BOPIS_PRODUCT_INFO_PROP_TYPES,
    /** a list of fits to disable */
    disabledFits: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,
    /** a callback allowing one to change values of form fields
     * (usually comes from the redux-form injected form prop called 'change') */
    change: PropTypes.func.isRequired,
    touch: PropTypes.func.isRequired,

    /** indicates the 'extended' sizes not available for bopis notification needs to show
     * (only when user attempted to select it)
     */
    isShowExtendedSizesNotification: PropTypes.bool.isRequired,

    /* this flag indicates when the Availability button has to be displayed */
    isShowSubmitButton: PropTypes.bool,

    /* this flag indicates when the Availability button is disabled */
    isDisabledSubmitButton: PropTypes.bool,

    /**
     * indicates the modal is shown because of an error trying to add to the preferred store
     * (required only in PDP)
     */
    isPreferredStoreError: PropTypes.bool
  }

  static defaultValidation = getStandardConfig([
    {'color': 'bopisSearchColor'},
    {'fit': 'bopisSearchFit'},
    {'size': 'bopisSearchSize'},
    {'quantity': 'bopisSearchQuantity'},
    {'addressLocation': 'addressLine1'},
    {'distance': 'distance'}
  ], {stopOnFirstError: true});

  constructor (props) {
    super(props);

    this.colorFitsSizesMap = getColorFitsSizesMap(props);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.colorFitsSizesMap !== nextProps.colorFitsSizesMap) {
      this.colorFitsSizesMap = getColorFitsSizesMap(nextProps);
    }
  }

  render () {
    let {currencySymbol, listPrice, offerPrice, name, imagePath, change, touch, disabledFits,
      isShowExtendedSizesNotification, isShowSubmitButton, isDisabledSubmitButton, isPreferredStoreError} = this.props;

    let fieldsAttributes = {
      sizeFieldAttributes: {
        ...ProductCustomizeFormPart.defaultProps.sizeFieldAttributes,
        isShowZeroInventoryItems: true
      },
      fitFieldAttributes: {
        ...ProductCustomizeFormPart.defaultProps.fitFieldAttributes,
        isShowZeroInventoryItems: true
      },
      colorFieldAttributes: {
        ...ProductCustomizeFormPart.defaultProps.colorFieldAttributes,
        isShowZeroInventoryItems: true
      }
    };

    return (
      <div className="item-product-container">

        <h4 className="product-title">{name}</h4>

        <div className="container-image">
          <img src={imagePath} alt={'Image for product ' + name} />
        </div>

        {isPreferredStoreError && <p className="preferred-store-message">The color and size selected are not available in your favorite store. Please search for another store or try a different color and/or size.</p>}

        <ProductCustomizeFormPart disabledFits={disabledFits}
          isDisableZeroInventoryItems={false}
          disabledFitsMessage={isShowExtendedSizesNotification ? getDisabledFitsMessage(disabledFits) : null}
          className="container-selects" colorFitsSizesMap={this.colorFitsSizesMap} change={change} touch={touch}
          {...fieldsAttributes} />

        <div className="container-price">
          {(listPrice !== offerPrice) && <span className="text-price product-list-price">{currencySymbol + (listPrice).toFixed(2)}</span>}
          <span className="text-price product-offer-price">{currencySymbol + (offerPrice).toFixed(2)}</span>
        </div>

        {isShowSubmitButton && <button type="submit" title="check availability" className="button-search-bopis button-search-bopis-limited" disabled={isDisabledSubmitButton}>Check Availability</button>}
      </div>
    );
  }

}

function getColorFitsSizesMap (props) {
  return props.colorFitsSizesMap.filter((colorEntry) => colorEntry.miscInfo && colorEntry.miscInfo.isBopisEligible);
}

function getDisabledFitsMessage (disabledFits = []) {
  let len = disabledFits.length;
  if (len === 0) {
    return '';
  } else if (len === 1) {
    return `Sorry, ${disabledFits[0]} size is not available in stores.`;
  } else {
    return `Sorry, ${disabledFits.slice(0, len - 1).join(', ')} and ${disabledFits[len - 1]} sizes are not available in stores.`;
  }
}
