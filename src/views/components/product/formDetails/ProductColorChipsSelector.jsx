/** @module ProductColorChipsSelector
 * @summary renders a LabeledRadioButtonGroup with radio buttons looking like images to select the
 * color for a product.
 *
 * Any extra props other than <code>colorFitsSizesMap, isShowZeroInventoryEntries, className</code>),
 * e.g., <code>title, disabled</code>, passed to this component will be passed along to the rendered <code>LabeledRadioButtonGroup</code> element.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {LabeledRadioButtonGroup} from 'views/components/common/form/LabeledRadioButtonGroup.jsx';
import {COLOR_FITS_SIZES_MAP_PROP_TYPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.color-chips-selector.scss');
} else {
  require('./_m.color-chips-selector.scss');
}

export class ProductColorChipsSelector extends React.Component {
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
    title: 'Select a color: ',
    isDisableZeroInventoryEntries: true
  };

  render () {
    let {
      colorFitsSizesMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries,
      className,      // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    let optionsMap = getColorsChipsOptionsMap(colorFitsSizesMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries);

    return (
      <LabeledRadioButtonGroup className="color-chips-selector" optionsMap={optionsMap} {...otherProps} />
    );
  }
}

function getColorsChipsOptionsMap (colorFitsSizesMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries) {
  if (!isShowZeroInventoryEntries) {
    colorFitsSizesMap = colorFitsSizesMap.filter((colorEntry) => colorEntry.maxAvailable > 0);
  }
  return colorFitsSizesMap.map((colorEntry) => {
    let {name, imagePath} = colorEntry.color;
    return {
      value: name,
      title: name,
      content: (
        <span className="color-title-container" title={name}>
          <span className="color-name">{name}</span>
          <img className="color-image" src={imagePath} />
        </span>
      ),
      disabled: isDisableZeroInventoryEntries && colorEntry.maxAvailable <= 0
    };
  });
}
