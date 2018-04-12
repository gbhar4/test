/** @module StoreSummaryDetailed
 * Show the summary of a store, including name, address, phone, type.
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {
  StoreTitle,
  StoreAddress,
  StorePhone,
  DistanceFromMe,
  StoreFeatures
} from './StoreSummaryComponents.jsx';
import {STORE_SUMMARY_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/storesPropTypes';

export class StoreSummaryDetailed extends React.Component {
  static propTypes = {
    /**
     * Flags wheter to show CTAs related to the store, such as "get directions"
     * and "calculate distance".
     */
    isShowCtas: PropTypes.bool.isRequired,
    store: STORE_SUMMARY_PROP_TYPES_SHAPE
  }

  render () {
    let {store: {basicInfo, features, distance}, isShowCtas} = this.props;

    return (
      <div className="store-info-data-detailed-single" itemScope itemType="http://schema.org/ClothingStore">
        <StoreTitle basicInfo={basicInfo} />
        <StoreAddress basicInfo={basicInfo} />
        <StorePhone basicInfo={basicInfo} />
        <DistanceFromMe distance={distance} />
        {isShowCtas && <div className="store-information"><StoreFeatures features={features} /></div>}
      </div>
    );
  }
}
