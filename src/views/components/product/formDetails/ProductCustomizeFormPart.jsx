/** @module ProductCustomizeFormPart
 * @summary A form part rendering a partial cart item editing from.
 *
 * Provides fields with the following names:
 *   color, fit, size, quantity.
 *
 * Provide a static defaultValidation property that is an object that can be passed to
 *  util/formsValidation/createValidateMethod.
 *
 *  This component extends redux-form's FormSection component.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {GENERAL_ERROR_FIELD_NAME} from 'util/formsValidation/createValidateMethod';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {ProductColorDropdownSelector} from './ProductColorDropdownSelector.jsx';
import {ProductColorChipsSelector} from './ProductColorChipsSelector.jsx';
import {ProductFitSelector} from './ProductFitSelector.jsx';
import {ProductSizeSelector} from './ProductSizeSelector.jsx';
import {SizeChartLink} from './SizeChartLink.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {AdaptiveField} from 'reduxStore/util/AdaptiveField';
import {FormValuesChangeTrigger} from 'reduxStore/util/FormValuesChangeTrigger.jsx';
import {COLOR_FITS_SIZES_MAP_PROP_TYPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {getMapSliceForColor, getMapSliceForFit} from 'util/viewUtil/productsCommonUtils';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import cssClassName from 'util/viewUtil/cssClassName.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.cart-item-editable-data-form.scss');
} else {
  require('./_m.cart-item-editable-data-form.scss');
}

export const SIZE_CHART_LINK_POSITIONS = {
  AFTER_SIZE: 2,
  AFTER_QUANTITY: 3
};

const EMPTY_MAP = [];
const MAX_QUANTITY = 15;

let ErrorMessageFormPart = getAdaptiveFormPart((props) => {
  return (props.error
    ? <ErrorMessage error={props.error} />
    // TODO: when upgrading to React16 test this again returning a boolean (as it was before this update)
    // to make sure the new version gives better support for retuning booleans instead of null.
    : props.inventoryError && props.isDisableZeroInventoryItems
      ? <ErrorMessage error="We're sorry, this item is out of stock." />
      : null
  );
});

/**
 * @summary the form component.
 *
 * This has to be wrapped in a redux-form, as well as by a connect that provides it with access to the current values of the
 * color and fit dropdowns.
 */
// note that we are extending\ InstrumentedFormSection (and not React.Component) just so that we can provide a default
// 'name' prop.
export class ProductCustomizeFormPart extends React.Component {
  static propTypes = {
    /** The CSS class to use for the containing fieldset element */
    className: PropTypes.string,

    /** indicates where to render a link that triggers the size-chart modal (if undefined then not rendered at all) */
    sizeChartLinkVisibility: PropTypes.oneOf(Object.keys(SIZE_CHART_LINK_POSITIONS).map((key) => SIZE_CHART_LINK_POSITIONS[key])),

    /**
     * The available color fit and size options for this product
     * Organized in a three level nesting (similar to a site navigation) with L1 being the color,
     * L2 being the fit, and L3 being the size
     */
    colorFitsSizesMap: COLOR_FITS_SIZES_MAP_PROP_TYPE.isRequired,

    /**
     * An optional array of fitNames that should be disabled
     * For instance, BOPIS form should not enable husky or slim
     */
    disabledFits: PropTypes.arrayOf(PropTypes.string),

    /**
     * An optional message to display when some fits
     * are not displayed / disabled based of disabledFits
     */
    disabledFitsMessage: PropTypes.string,

    /**
     * flags if sizes with zero inventory are disabled
     * meaningful only if isShowZeroInventoryItems is true on colorFieldAttributes, fitFieldAttributes or sizeFieldAttributes
     */
    isDisableZeroInventoryItems: PropTypes.bool,

    /** optional customization of the color field */
    colorFieldAttributes: PropTypes.shape({
      className: PropTypes.string,               // css class name to use for this field
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),    // the title (lable, prompt) for this field
      isShowZeroInventoryItems: PropTypes.bool,   // Flags if colors with zero inventory are displayed
      useChips: PropTypes.bool                    // flags to use chips instead of a dropdown for selecting the color
    }),

    fitFieldAttributes: PropTypes.shape({
      className: PropTypes.string,               // css class name to use for this field
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),    // the title (lable, prompt) for this field
      isShowZeroInventoryItems: PropTypes.bool,   // flags if fits with zero inventory are displayed
      useChips: PropTypes.bool,                   // flags to use chips instead of a dropdown for selecting the fit
      isShowSelectedValueInChipsLabel: PropTypes.bool  // flags if to show the currently selected value in the label (relevant only if using chips)
    }),

    sizeFieldAttributes: PropTypes.shape({
      className: PropTypes.string,               // css class name to use for this field
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),    // the title (lable, prompt) for this field
      isShowZeroInventoryItems: PropTypes.bool,   // flags if sizes with zero inventory are displayed
      useChips: PropTypes.bool,                   // flags to use chips instead of a dropdown for selecting the size
      isShowSelectedValueInChipsLabel: PropTypes.bool  // flags if to show the currently selected value in the label (relevant only if using chips),
    }),

    quantityFieldAttributes: PropTypes.shape({
      className: PropTypes.string,               // css class name to use for this field
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),    // the title (lable, prompt) for this field
      isNotVisible: PropTypes.bool                // flags to not show the quantity field
    }),

    /** callback for change in the selected color (accepts: colorProductId) and returns a promise
     *  This component disables fit/zise selection until the promise resolves/rejects.
     */
    onColorChange: PropTypes.func,

    /** flags to show a link to the size-chart modal */
    showSizeChartLink: PropTypes.bool,

    /** a callback allowing one to change values of form fields
     * (usually comes from the redux-form injected form prop called 'change') */
    change: PropTypes.func.isRequired,

    /** a callback allowing one to mark form fields as touched
     * (usually comes from the redux-form injected form prop called 'touch') */
    touch: PropTypes.func.isRequired
  }

  static defaultProps = {
    colorFieldAttributes: {title: 'Color:'},
    fitFieldAttributes: {title: 'Fit:'},
    sizeFieldAttributes: {title: 'Size:'},
    quantityFieldAttributes: {title: 'Qty:', className: 'select-quantity mini-dropdown'},
    disabledFits: [],
    isDisableZeroInventoryItems: true,
    onColorChange: () => Promise.resolve()
  }

  static defaultValidation = getStandardConfig([
    {[GENERAL_ERROR_FIELD_NAME]: 'productInventory'},
    {'color': 'productColor'},
    {'fit': 'productFit'},
    {'size': 'productSize'},
    {'quantity': 'productQuantity'}
  ], {stopOnFirstError: true})

  constructor (props, context) {
    super(props, context);

    this.state = {
      isColorUpdating: false
    };

    this.handleColorChange = this.handleColorChange.bind(this);
    this.mapValuesToSizeProps = this.mapValuesToSizeProps.bind(this);
    this.mapValuesToFitProps = this.mapValuesToFitProps.bind(this);
    this.handleSkuValuesChange = this.handleSkuValuesChange.bind(this);
    this.mapValuesToErrorMessageProps = this.mapValuesToErrorMessageProps.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.colorFitsSizesMap !== nextProps.colorFitsSizesMap) {
      let currentColorInfo = getMapSliceForColor(nextProps.colorFitsSizesMap, this.colorName);
      if (!currentColorInfo) {
        // current color is not found in the new map -> deselect color fit and size
        // (unless already de-selected - this prevents wiered race conditions between user selections and this
        // auto-selection that may cause user selections to be overriden)
        this.colorName !== '' && this.props.change('color', '');
        this.fitName !== '' && this.props.change('fit', '');
        this.sizeName !== '' && this.props.change('size', '');
      } else {
        if (!currentColorInfo.hasFits || currentColorInfo.fits.findIndex((fit) => fit.fitName === this.fitName) < 0) {
          // current fit is not found in the new map -> deselect it unless already de-selected
          // (note that we do not deselect if the availability is zero, as we want validation to fail instead)
          this.fitName !== '' && this.props.change('fit', '');
        }
        let currentFitInfo = getMapSliceForFit(nextProps.colorFitsSizesMap, this.colorName, this.fitName);
        if (!currentFitInfo || currentFitInfo.sizes.findIndex((size) => size.sizeName === this.sizeName) < 0) {
          // current size is not found in the new map -> deselect it unless already de-selected
          // (note that we do not deselect if the availability is zero, as we want validation to fail instead)
          this.sizeName !== '' && this.props.change('size', '');
        }
      }

      // by changing the meaningless _ignoreMe_ form value, we trigger synchronous validation. This is needed in case the code
      // above did not trigger any changes (e.g., if only inventory was updated) this will validate the current color size and
      // fit against the new colorFitsSizesMap
      this.props.change('_ignoreMe_', Math.random().toString());
    }
  }

  mapValuesToFitProps (values) {
    let currentColorInfo = getMapSliceForColor(this.props.colorFitsSizesMap, values.color);
    if (currentColorInfo && currentColorInfo.fits.findIndex((fit) => fit.fitName === values._myValue) < 0) {
      // current fit is not found in the new color selected -> deselect fit (note that we do not deselect if the availability
      // is zero, as we want validation to fail instead)
      return {_newValue: ''};
    }
  }

  mapValuesToErrorMessageProps (values) {
    let currentFitInfo = getMapSliceForFit(this.props.colorFitsSizesMap, values.color, values.fit);

    return {
      inventoryError: currentFitInfo && !currentFitInfo.sizes.find((size) => size.maxAvailable !== 0)
    };
  }

  mapValuesToSizeProps (values) {
    let currentFitInfo = getMapSliceForFit(this.props.colorFitsSizesMap, values.color, values.fit);

    if (!currentFitInfo) { return; } // this should never happen
    if (currentFitInfo.sizes.findIndex((size) => size.sizeName === values._myValue) < 0) {
      // current size is not found in the new color/fit combination selected -> deselect size (note that we do not deselect if
      // the availabiulity is zero, as we want validation to fail instead)
      return {_newValue: ''};
    }
  }

  handleSkuValuesChange (values) {
    this.colorName = values.color;
    this.fitName = values.fit;
    this.sizeName = values.size;
    this.forceUpdate();
  }

  handleColorChange (event, newValue) {
    this.setState({isColorUpdating: true});
    this.props.onColorChange(getMapSliceForColor(this.props.colorFitsSizesMap, newValue).colorProductId).then(() => {
      this.setState({isColorUpdating: false});
    }).catch(() => {
      this.setState({isColorUpdating: false});
    });
  }

  render () {
    let {className, colorFitsSizesMap, sizeChartLinkVisibility, disabledFits, disabledFitsMessage,
    colorFieldAttributes, fitFieldAttributes, sizeFieldAttributes, quantityFieldAttributes} = this.props;

    let currentColorEntry = getMapSliceForColor(colorFitsSizesMap, this.colorName);
    let currentFitEntry = getMapSliceForFit(colorFitsSizesMap, this.colorName, this.fitName);
    let showFitDropdown = currentColorEntry && currentColorEntry.hasFits;

    let ColorComponent = colorFieldAttributes.useChips ? ProductColorChipsSelector : ProductColorDropdownSelector;

    let colorExtraProps = {
      className: colorFieldAttributes.className,
      title: colorFieldAttributes.title,
      isShowZeroInventoryEntries: colorFieldAttributes.isShowZeroInventoryItems,
      isDisableZeroInventoryEntries: this.props.isDisableZeroInventoryItems
    };

    let fitsMap = EMPTY_MAP;
    let isShowDisabledFitsMessage = false;
    if (currentColorEntry && currentColorEntry.hasFits) {
      fitsMap = currentColorEntry.fits;
      if (disabledFits.length) {
        fitsMap = fitsMap.filter((fit) => disabledFits.indexOf(fit.fitName) < 0);
        isShowDisabledFitsMessage = fitsMap.length !== currentColorEntry.fits.length;
      }
    }

    let fitExtraProps = {
      fitsMap: fitsMap,
      disabled: this.state.isColorUpdating || currentColorEntry && currentColorEntry.maxInventory <= 0,
      className: colorFieldAttributes.className,
      title: fitFieldAttributes.title,
      isShowZeroInventoryEntries: fitFieldAttributes.isShowZeroInventoryItems,
      isDisableZeroInventoryEntries: this.props.isDisableZeroInventoryItems,
      isRenderChips: fitFieldAttributes.useChips
    };
    if (fitFieldAttributes.useChips) fitExtraProps.isShowSelectedValueInLabel = fitFieldAttributes.isShowSelectedValueInChipsLabel;

    let sizeExtraProps = {
      sizesMap: currentFitEntry ? currentFitEntry.sizes : EMPTY_MAP,
      disabled: this.state.isColorUpdating || currentFitEntry && currentFitEntry.maxInventory <= 0,
      className: colorFieldAttributes.className,
      title: sizeFieldAttributes.title,
      isShowZeroInventoryEntries: sizeFieldAttributes.isShowZeroInventoryItems,
      isDisableZeroInventoryEntries: this.props.isDisableZeroInventoryItems,
      isRenderChips: sizeFieldAttributes.useChips
    };
    if (sizeFieldAttributes.useChips) sizeExtraProps.isShowSelectedValueInLabel = sizeFieldAttributes.isShowSelectedValueInChipsLabel;

    let quantityExtraProps = {
      optionsMap: getQuantityMap(MAX_QUANTITY),
      disabled: currentColorEntry && currentColorEntry.maxInventory <= 0,
      className: quantityFieldAttributes.className,
      title: quantityFieldAttributes.title
    };

    let fieldSetClassName = cssClassName(className, {' fit-dropdown-visible': showFitDropdown});
    let fieldSetProps = {className: fieldSetClassName};

    return (
      <fieldset {...fieldSetProps}>
        {/* Listen to _ignoreMe_ to force initial validation for out of stock products */}
        <ErrorMessageFormPart adaptTo="color,fit,_ignoreMe_" mapValuesToProps={this.mapValuesToErrorMessageProps} isDisableZeroInventoryItems={this.props.isDisableZeroInventoryItems} error={this.props.error} />

        <FormValuesChangeTrigger adaptTo={'color,fit,size'} onChange={this.handleSkuValuesChange} />

        {isShowDisabledFitsMessage && disabledFitsMessage && <p className="disabled-fits-message">{disabledFitsMessage}</p>}

        <Field name="color" component={ColorComponent} onChange={this.handleColorChange} colorFitsSizesMap={colorFitsSizesMap} {...colorExtraProps} />

        <AdaptiveField name="fit" component={ProductFitSelector} {...fitExtraProps}
          adaptTo="color" mapValuesToProps={this.mapValuesToFitProps} isHideIfEmptyOptionsMap={!showFitDropdown} />

        <AdaptiveField name="size" component={ProductSizeSelector} {...sizeExtraProps}
          adaptTo="color,fit" mapValuesToProps={this.mapValuesToSizeProps} />

        {sizeChartLinkVisibility === SIZE_CHART_LINK_POSITIONS.AFTER_SIZE && <SizeChartLink />}

        {!quantityFieldAttributes.isNotVisible &&
          <Field name="quantity" component={LabeledSelect} {...quantityExtraProps} format={formatQuantity} parse={parseQuantity} />
        }

        {sizeChartLinkVisibility === SIZE_CHART_LINK_POSITIONS.AFTER_QUANTITY && <SizeChartLink />}
      </fieldset>
    );
  }

}

/**
 * @return the optionsMap to be used by the quantity dropdown
 */
function getQuantityMap (maxNum) {
  let result = [];
  for (let i = 1; i <= maxNum; i++) {
    let numAsStr = i.toString();
    result.push({id: numAsStr, displayName: numAsStr});
  }
  return result;
}

function parseQuantity (quantityAsStr) {
  return parseInt(quantityAsStr);
}

function formatQuantity (quantity) {
  if (quantity) {
    return quantity.toString();
  }
}

// mapValuesToQuantityProps (values) {
//   let maxQuantity = MAX_QUANTITY;
//   if (values.size) {
//     let currentFitEntry = getMapSliceForFit(this.props.colorFitsSizesMap, values.color, values.fit);
//     let currentSizeEntry = currentFitEntry.sizes.find((entry) => entry.sizeName === values.size);
//     if (currentSizeEntry) {
//       maxQuantity = currentSizeEntry.maxAvailable;
//     }
//   } else if (values.fit) {
//     let currentFitEntry = getMapSliceForFit(this.props.colorFitsSizesMap, values.color, values.fit);
//     maxQuantity = currentFitEntry.maxAvailable;
//   } else {
//     let currentColorInfo = getMapSliceForColor(this.props.colorFitsSizesMap, values.color);
//     maxQuantity = currentColorInfo.maxAvailable;
//   }
//   maxQuantity = Math.min(maxQuantity, MAX_QUANTITY);
//   return {
//     optionsMap: this.getQuantityMap(maxQuantity)
//   };
// }
