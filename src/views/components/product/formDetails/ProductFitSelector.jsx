/** @module ProductFitSelector
 * @summary renders either a LabeledSelect or a LabeledRadioButtonGroup with radio buttons looking like chips to select the
 * fit for a product.
 *
 * Any extra props other than <code>fitsMap, isRenderChips, isShowZeroInventoryEntries, className</code>),
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

export class ProductFitSelector extends React.Component {
  static propTypes = {
    /** the fits to choose from */
    fitsMap: PropTypes.arrayOf(PropTypes.shape({
      fitName: PropTypes.string.isRequire,
      maxAvailable: PropTypes.number.isRequired     // the maximum value of any nested maxAvailable value
    })).isRequired,

    /** flags to render a LabeledRadioButtonGroup displaying chips instead of a LabeledSelect for fit selection */
    isRenderChips: PropTypes.bool,

    /** flags if to show fits with zero inventory in all sizes */
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
      fitsMap, isRenderChips, isShowZeroInventoryEntries,
      isDisableZeroInventoryEntries,
      className,      // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    let optionsMap = getFitsOptionsMap(fitsMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries, isRenderChips);

    if (isRenderChips) {
      return <LabeledRadioButtonGroup className="size-and-fit-detail" optionsMap={optionsMap} {...otherProps} />;
    } else {
      return <LabeledSelect className="select-fit mini-dropdown" optionsMap={optionsMap} {...otherProps} />;
    }
  }
}

function getFitsOptionsMap (fitsMap, isShowZeroInventoryEntries, isDisableZeroInventoryEntries, isRenderChips) {
  let filteredMap = isShowZeroInventoryEntries
    ? fitsMap
    : fitsMap.filter((fitEntry) => fitEntry.maxAvailable > 0);

  if (isRenderChips) {
    return filteredMap.map((fitEntry) => ({
      value: fitEntry.fitName,
      title: fitEntry.fitName,
      content: <span>{fitEntry.fitName}</span>,
      disabled: isDisableZeroInventoryEntries && fitEntry.maxAvailable <= 0
    }));
  } else {
    return filteredMap.map((fitEntry) => ({
      id: fitEntry.fitName,
      displayName: fitEntry.fitName,
      disabled: isDisableZeroInventoryEntries && fitEntry.maxAvailable <= 0
    }));
  }
}
