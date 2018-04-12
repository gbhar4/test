/** @module OutfitProductForm
 *
 * @summary Yet another form for adding a product to the cart by selecing color, fit, size, and quantity.
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
  require('../_d.product-details-form.scss');
  require('../_d.pdp-overlay-add-to-bag.scss');
  require('views/components/product/formDetails/_d.size-fit-chips-selector.scss');
} else {
  require('../_m.product-details-form.scss');
  require('../_m.pdp-overlay-add-to-bag.scss');
  require('views/components/product/formDetails/_m.size-fit-chips-selector.scss');
}

class _OutfitProductForm extends React.Component {
  static propsTypes = {
    /**
    * The available color fit and size options for this product
    * Organized in a three level nesting with L1 being the color,
    * L2 being the fit, and L3 being the size
    */
    colorFitsSizesMap: COLOR_FITS_SIZES_MAP_PROP_TYPE.isRequired,
    /** optional displayNames of the color fit and size (e.g., for gift cards it is {color: 'Design', size: 'Value') */
    colorFitSizeDisplayNames: PRODUCT_INFO_PROP_TYPES.colorFitSizeDisplayNames,

    /** Flags if the button to open the Size Chart modal (espot) should be visible. */
    isSizeChartVisible: PropTypes.bool.isRequired,

    /**
    * Callback for updating the item.
    * Accepts: skuId (of the selected colr/fit/size combination), quantity
    */
    onSubmit: PropTypes.func.isRequired,

    /** callback for change in the selected color (accepts: colorProductId) and returns a promise */
    onColorChange: PropTypes.func,

    /** Props passed by the redux-form Form HOC. */
    ...reduxFormPropTypes
  }

  componentDidMount () {
    let { initialized, initialValues, change, dispatch } = this.props;

    /* This is to handle server side rendering, this form is already initialized with wrong feilds on node due to us not knowing
     * inventory at that point in time. We can do it this way or just not render this component until it is on the client and the inventory gets back.
    */
    if (initialized && initialValues) {
      dispatch(change('fit', this.props.initialValues.fit));
      dispatch(change('size', this.props.initialValues.size));
      dispatch(change('quantity', this.props.initialValues.quantity));
    }

  }

  render () {
    let {submitting, handleSubmit, error, colorFitsSizesMap, colorFitSizeDisplayNames,
      isSizeChartVisible, onColorChange, change, touch} = this.props;

    colorFitSizeDisplayNames = {color: 'Color', fit: 'Fit', size: 'Size', ...colorFitSizeDisplayNames};

    let fieldsAttributes = {
      sizeChartLinkVisibility: isSizeChartVisible ? SIZE_CHART_LINK_POSITIONS.AFTER_QUANTITY : null,
      colorFieldAttributes: {
        title: `Select a ${colorFitSizeDisplayNames.color}: `,
        isShowZeroInventoryItems: true,
        useChips: true
      },
      fitFieldAttributes: {
        // className: 'size-and-fit-detail',
        title: (colorFitSizeDisplayNames.fit || 'Fit') + ':',
        isShowZeroInventoryItems: true
      },
      sizeFieldAttributes: {
        // className: 'size-and-fit-detail',
        title: (colorFitSizeDisplayNames.size || 'Size') + ':',
        isShowZeroInventoryItems: true
      },
      quantityFieldAttributes: {
        className: 'select-qty',
        title: 'Qty:'
      }
    };

    return (
     <form className="product-details-form-container" onSubmit={handleSubmit}>
       <ProductCustomizeFormPart className="product-details-form-content" colorFitsSizesMap={colorFitsSizesMap}
         {...fieldsAttributes} change={change} touch={touch} error={error} onColorChange={onColorChange} />
       <button type="submit" className="button-add-to-bag" disabled={submitting}>Add to Bag</button>
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

export let OutfitProductForm = reduxForm({
  // Observe that we do not provide here a name for the form. Since the name depends on the product being
  // edited, it is not known at design time, and thus passed dynamically as a prop by the parent component.
  ...validateMethod
})(_OutfitProductForm);
