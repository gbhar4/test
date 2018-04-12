/** @module ProductSizeSelector
 * @summary renders either a LabeledSelect or a LabeledRadioButtonGroup with radio buttons looking like chips to select the
 * size for a product.
 *
 * Any extra props other than <code>sizesMap, isRenderChips, isShowZeroInventoryEntries, className</code>),
 * e.g., <code>title, disabled</code>, passed to this component will be passed along to the rendered <code>LabeledRadioButtonGroup</code>
 * or <code>LabeledSelect</code> element.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {LabeledRadioButtonGroup} from 'views/components/common/form/LabeledRadioButtonGroup.jsx';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.size-fit-chips-selector.scss');
  require('./_d.cart-item-editable-data-form.scss');
} else {
  require('./_m.size-fit-chips-selector.scss');
  require('./_m.cart-item-editable-data-form.scss');
}

export class ProductSizeSelector extends React.Component {
  static propTypes = {
    /** the sizes to chose from */
    sizesMap: PropTypes.arrayOf(PropTypes.shape({
      sizeName: PropTypes.string.isRequire,
      maxAvailable: PropTypes.number.isRequired     // the maximum value of any nested maxAvailable value
    })).isRequired,

    /** flags to render a LabeledRadioButtonGroup displaying chips instead of a LabeledSelect for size selection */
    isRenderChips: PropTypes.bool,

    /** flags if to show sizes with zero inventory */
    isShowZeroInventoryEntries: PropTypes.bool,

    /** flags if to disable sizes with zero inventory. Defaults to true. */
    isDisableZeroInventoryEntries: PropTypes.bool
  }

  static defaultProps = {
    title: 'Select a Fit: ',
    isDisableZeroInventoryEntries: true
  };

  render () {
    let {
      sizesMap, isRenderChips, isShowZeroInventoryEntries, isDisableZeroInventoryEntries,
      className,      // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    let optionsMap = getSizesOptionsMap(sizesMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries, isRenderChips);

    if (isRenderChips) {
      return <LabeledRadioButtonGroup className="size-and-fit-detail" optionsMap={optionsMap} {...otherProps} />;
    } else {
      return <LabeledSelect className="select-size mini-dropdown" optionsMap={optionsMap} {...otherProps} />;
    }
  }
}

function getSizesOptionsMap (sizesMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries, isRenderChips) {
  let filteredMap = isShowZeroInventoryEntries
    ? sizesMap
    : sizesMap.filter((sizeEntry) => sizeEntry.maxAvailable > 0);

  if (isRenderChips) {
    return sizesMap.map((sizeEntry) => ({
      value: sizeEntry.sizeName,
      title: sizeEntry.sizeName,
      content: <span>{sizeEntry.sizeName}</span>,
      disabled: isDisableZeroInventoryEntries && sizeEntry.maxAvailable <= 0
    }));
  } else {
    return filteredMap.map((sizeEntry) => ({
      id: sizeEntry.sizeName,
      displayName: sizeEntry.sizeName,
      disabled: isDisableZeroInventoryEntries && sizeEntry.maxAvailable <= 0
    }));
  }
}
