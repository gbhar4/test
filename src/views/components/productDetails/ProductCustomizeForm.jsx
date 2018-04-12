/** @module ProductCustomizeForm
 *
 * @summary A form allowing to add products to the cart by selecing color, fit,
 * size, and quantity.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod, GENERAL_ERROR_FIELD_NAME} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ProductCustomizeFormPart, SIZE_CHART_LINK_POSITIONS} from 'views/components/product/formDetails/ProductCustomizeFormPart.jsx';
import {COLOR_FITS_SIZES_MAP_PROP_TYPE, PRODUCT_INFO_PROP_TYPES} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-details-form.scss');
  require('./_d.pdp-overlay-add-to-bag.scss');
  require('views/components/product/formDetails/_d.size-fit-chips-selector.scss');
} else {
  require('./_m.product-details-form.scss');
  require('./_m.pdp-overlay-add-to-bag.scss');
  require('views/components/product/formDetails/_m.size-fit-chips-selector.scss');
}

export const COLOR_FIELD_NAME = 'color';

class _ProductCustomizeForm extends React.Component {
  static propsTypes = {
    /** The text to display in the submit button for this form. defaults to "Add to Bag" */
    submitButtonText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /**
     * The available color fit and size options for this product
     * Organized in a three level nesting with L1 being the color,
     * L2 being the fit, and L3 being the size
     */
    colorFitsSizesMap: COLOR_FITS_SIZES_MAP_PROP_TYPE.isRequired,

    /** optional displayNames of the color fit and size (e.g., for gift cards it is {color: 'Design', size: 'Value') */
    colorFitSizeDisplayNames: PRODUCT_INFO_PROP_TYPES.colorFitSizeDisplayNames,

    /**
     * Callback for updating the item.
     * Accepts: skuId (of the selected colr/fit/size combination), quantity
     */
    onSubmit: PropTypes.func.isRequired,

    /** callback for change in the selected color (accepts: colorProductId) and returns a promise */
    onColorChange: PropTypes.func,

    /** Flags if the button to open the Size Chart modal (espot) should be visible. */
    isSizeChartVisible: PropTypes.bool,

    /** Flags if the quantity selection field should be visible. Defaults to 1 */
    isQuantityVisible: PropTypes.bool,

    /**
     * Flags whether to show the selected value for each field in their
     * corresponding labels. Defaults to true.
     */
    isSelectedValuesVisibleInLabels: PropTypes.bool,

    /** Props passed by the redux-form Form HOC. */
    ...reduxFormPropTypes
  }

  static defaultProps = {
    isQuantityVisible: true,
    isSelectedValuesVisibleInLabels: true,
    submitButtonText: 'Add to Bag'
  }

  render () {
    let {submitting, handleSubmit, error, isSizeChartVisible, colorFitsSizesMap, onColorChange, submitButtonText,
      colorFitSizeDisplayNames, isQuantityVisible, isSelectedValuesVisibleInLabels, change, touch} = this.props;

    let fieldTitleValueSeparator = isSelectedValuesVisibleInLabels ? ': ' : '';
    colorFitSizeDisplayNames = {color: 'Color', fit: 'Fit', size: 'Size', ...colorFitSizeDisplayNames};

    let fieldsAttributes = {
      sizeChartLinkVisibility: isSizeChartVisible ? SIZE_CHART_LINK_POSITIONS.AFTER_SIZE : null,
      colorFieldAttributes: {
        title: `Select a ${colorFitSizeDisplayNames.color}${fieldTitleValueSeparator}`,
        isShowZeroInventoryItems: true,
        useChips: true
      },
      fitFieldAttributes: {
        className: 'size-and-fit-detail',
        title: `Select a ${colorFitSizeDisplayNames.fit}${fieldTitleValueSeparator}`,
        isShowZeroInventoryItems: true,
        useChips: true,
        isShowSelectedValueInChipsLabel: isSelectedValuesVisibleInLabels
      },
      sizeFieldAttributes: {
        className: 'size-and-fit-detail',
        title: `Select a ${colorFitSizeDisplayNames.size}${fieldTitleValueSeparator}`,
        isShowZeroInventoryItems: true,
        useChips: true,
        isShowSelectedValueInChipsLabel: isSelectedValuesVisibleInLabels
      },
      quantityFieldAttributes: {
        className: 'select-qty',
        title: <span className="qty-details-section-title"><strong className="qty-details-title">Select a Quantity</strong>Quantity: </span>,
        isNotVisible: !isQuantityVisible
      }
    };

    return (
      <form className="product-details-form-container" onSubmit={handleSubmit}>
        <div className="product-details-form-content">
          <ProductCustomizeFormPart colorFitsSizesMap={colorFitsSizesMap} {...fieldsAttributes}
            onColorChange={onColorChange} change={change} touch={touch} error={error} />
        </div>

        <button type="submit" className="button-add-to-bag" disabled={submitting}>{submitButtonText}</button>
      </form>
    );
  }

}

let validateMethod = createValidateMethod(getStandardConfig(
  [
    {[GENERAL_ERROR_FIELD_NAME]: 'productInventoryForAddToBag'},
    {'color': 'productColor'},
    {'fit': 'productFit'},
    {'size': 'productSize'},
    {'quantity': 'productQuantity'}
  ],
  {stopOnFirstError: true}
));

export let ProductCustomizeForm = reduxForm({
  // Observe that we do not provide here a name for the form. Since the name depends on the product being
  // edited, it is not known at design time, and thus passed dynamically as a prop by the parent component.
  ...validateMethod,
  enableReinitialize: true      // allows color changes outside this form to re-initialize it
})(_ProductCustomizeForm);
