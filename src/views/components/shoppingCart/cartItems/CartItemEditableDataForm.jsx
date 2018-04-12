/** @module CartItemEditableDataForm
 *
 * @summary A form allowing modifying the editable details of a cart item: color, fit, size, and quantity.
 * The form has fields with the following names: <code>'color', 'fit', 'size', 'quantity'</code>
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {ProductCustomizeFormPart} from 'views/components/product/formDetails/ProductCustomizeFormPart.jsx';
import {getSkuId} from 'util/viewUtil/productsCommonUtils';

if (DESKTOP) {      // eslint-disable-line
  require('./_d.cart-item-editable-data-form.scss');
} else {
  require('./_m.cart-item-editable-data-form.scss');
}

/**
 * @protected
 * @summary the form component.
 *
 * This has to be wrapped in a redux-form, as well as by a connect that provides it with access to the current values of the
 * color and fit dropdowns.
 */
class _CartItemEditableDataForm extends React.Component {
  static propTypes = {
    /** Flags if to use condensed version for mini-bag use */
    isCondense: PropTypes.bool.isRequired,

    /** The CSS class to use for the containing form element */
    className: PropTypes.string,

    /** the id of this item in the cart */
    itemId: PropTypes.string.isRequired,

    /** The name of the item (e.g. 'Boys Five-Pocket Skinny Corduroy Pants') */
    productName: PropTypes.string.isRequired,

    /**
     * The available color fit and size options for this product
     * Organized in a three level nesting (similar to a site navigation) with L1 being the color,
     * L2 being the fit, and L3 being the size
     */
    colorFitsSizesMap: ProductCustomizeFormPart.propTypes.colorFitsSizesMap,
    /** optional displayNames of the color fit and size (e.g., for gift cards it is {color: 'Design', size: 'Value') */
    colorFitSizeDisplayNames: PropTypes.shape({ color: PropTypes.string, fit: PropTypes.string, size: PropTypes.string }),

    /**
     * Callback for updating the item.
     * Accepts: itemId, skuId (of the selected colr/fit/size combination), quantity
     */
    onSubmit: PropTypes.func.isRequired,

    /** callback for clicks on the cancel button of this form (accepts: itemId, click-event) */
    onCancelClick: PropTypes.func.isRequired,

    /** callback for change in the selected color (accepts: itemId, colorProductId) and returns a promise
     *  This component disables fit/zise selection until the promise resolves/rejects.
     */
    onColorChange: PropTypes.func.isRequired,

    /**
     * Flags if colors with zero inventory are displayed and disabled
     * in dropdowns (when truthy) or not displayed at all (when falsy).
     */
    isShowZeroInventoryColors: PropTypes.bool,

    /**
     * Flags if fits or sizes with zero inventory are displayed and disabled
     * in dropdowns (when truthy) or not displayed at all (when falsy).
     */
    isShowZeroInventoryFitSize: PropTypes.bool,

    /** Props passed by the redux-form Form HOC. */
    ...reduxFormPropTypes
  }

  constructor (props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  // TODO: document why we need this
  componentWillMount () {
    this.props.touch('color');
    this.props.touch('size');
    this.props.touch('fit');
  }

  onSubmit (formData) {
    let newSkuId = getSkuId(this.props.colorFitsSizesMap, formData.color, formData.fit, formData.size);
    return this.props.onSubmit(this.props.itemId, newSkuId, formData.quantity);
  }

  handleCancelClick (event) {
    this.props.onCancelClick(this.props.itemId, event);
  }

  // DT-33077 reset cart item edit mode before unmount so it will display correct data in bag.
  componentWillUnmount () {
    this.props.onCancelClick(this.props.itemId);
  }

  handleColorChange (colorProductId) {
    return this.props.onColorChange(this.props.itemId, colorProductId);
  }

  render () {
    let {colorFitsSizesMap, colorFitSizeDisplayNames, isShowZeroInventoryColors, isShowZeroInventoryFitSize,
      isCondense, className, productName, submitting, handleSubmit, error, change, touch} = this.props;

    let fieldsAttributes = {
      colorFieldAttributes: {title: (colorFitSizeDisplayNames.color || 'Color') + ':', isShowZeroInventoryItems: isShowZeroInventoryColors},
      fitFieldAttributes: {title: (colorFitSizeDisplayNames.fit || 'Fit') + ':', isShowZeroInventoryItems: isShowZeroInventoryFitSize},
      sizeFieldAttributes: {title: (colorFitSizeDisplayNames.size || 'Size') + ':', isShowZeroInventoryItems: isShowZeroInventoryFitSize}
    };

    return (
      <form className={className} onSubmit={handleSubmit(this.onSubmit)}>
        <ProductCustomizeFormPart className="container-selects" colorFitsSizesMap={colorFitsSizesMap} {...fieldsAttributes}
          onColorChange={this.handleColorChange} change={change} touch={touch} error={error} />

        <div className="buttons-editables">
          <button className={isCondense ? 'button-update' : 'button-global-update'} title={'Update ' + productName} aria-label={'Update ' + productName}
            type="submit" disabled={submitting}>Update</button>
          <button type="button" className="button-cancel" title="Cancel" aria-label="Cancel" onClick={this.handleCancelClick}>Cancel</button>
        </div>
      </form>
    );
  }

}

let validateMethod = createValidateMethod(ProductCustomizeFormPart.defaultValidation);

let CartItemEditableDataForm = reduxForm({
  // Observe that we do not provide here a name for the form. Since the name depends on the itemId of the cart item being
  // edited, it is not known at design time, and thus passed dynamically as a prop by the parent component.
  ...validateMethod,
  touchOnChange: true   // to show validation error messageas even if user did not touch the fields
})(_CartItemEditableDataForm);
CartItemEditableDataForm.displayName = 'CartItemEditableDataForm';
CartItemEditableDataForm.propTypes = _CartItemEditableDataForm.defaultPropsTypes;

export {CartItemEditableDataForm};
