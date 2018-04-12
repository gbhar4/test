/** @module ProductColorDropdownSelector
 * @summary renders a CustomSelect for selecting the color for a product.
 *
 * Any extra props other than <code>colorFitsSizesMap, isShowZeroInventoryEntries, className</code>),
 * e.g., <code>title, disabled</code>, passed to this component will be passed along to the rendered <code>CustomSelect</code> element.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import {COLOR_FITS_SIZES_MAP_PROP_TYPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';

export class ProductColorDropdownSelector extends React.Component {
  static propTypes = {
    /**
     * The available color fit and size options for the product to select a color for
     * Organized in a three level nesting (similar to a site navigation) with L1 being the color,
     * L2 being the fit, and L3 being the size
     */
    colorFitsSizesMap: COLOR_FITS_SIZES_MAP_PROP_TYPE.isRequired,

    /** flags if to show colors with zero inventory in all fits and sizes */
    isShowZeroInventoryEntries: PropTypes.bool,

    /** flags if to disable sizes with zero inventory. Defaults to true. */
    isDisableZeroInventoryEntries: PropTypes.bool
  }

  static defaultProps = {
    isDisableZeroInventoryEntries: true
  }

  render () {
    let {colorFitsSizesMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries, ...otherProps} = this.props;
    let optionsMap = getOptionsMap(colorFitsSizesMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries);
    return (
      <CustomSelect optionsMap={optionsMap} {...otherProps} className="bag-item-color-select" />
    );
  }
}

function CartItemColorOption (props) {
  let {color, ...otherProps} = props;
  return (
    <span {...otherProps}><img src={color.imagePath} /> {color.name} </span>
  );
}

function getOptionsMap (colorFitsSizesMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries) {
  let currentColorsMap = isShowZeroInventoryEntries
    ? colorFitsSizesMap
    : colorFitsSizesMap.filter((colorEntry) => colorEntry.maxAvailable > 0);
  return currentColorsMap.map((colorEntry) => {
    let ColorElement = <CartItemColorOption color={colorEntry.color}/>;
    return {
      value: colorEntry.color.name,
      content: ColorElement,
      title: ColorElement,
      disabled: isDisableZeroInventoryEntries && colorEntry.maxAvailable <= 0
    };
  });
}
