/** @module TrackOrderOpener
 * @summary a non-visual component (i.e., renders null) that on mount (and prop-change) opens the track order modal
 *
 *  @author Agu
 */
import React from 'react';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

class _CountrySelectorOpener extends React.Component {
  componentWillMount () {
    this.props.openCountrySelectorModal();
  }

  render () {
    return null;
  }
}

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    openCountrySelectorModal: storeOperators.globalSignalsOperator.openCountrySelectorModal
  };
}

let CountrySelectorOpener = connectPlusStoreOperators(
  {globalSignalsOperator: getGlobalSignalsOperator}, mapStateToProps
)(_CountrySelectorOpener);

export {CountrySelectorOpener};
