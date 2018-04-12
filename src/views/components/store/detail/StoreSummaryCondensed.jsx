/**
 * @module StoreSummaryCondensed
 * Show the summary of a store, including name, address, phone, type.
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {
  StoreTitle,
  StoreAddress,
  StorePhone,
  DistanceFromMe,
  ViewStoreDetailsButton
} from './StoreSummaryComponents.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {STORE_SUMMARY_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/storesPropTypes';

export class StoreSummaryCondensed extends React.Component {
  static propTypes = {
    /* Flags if we are in mobile */
    isShowCtas: PropTypes.bool.isRequired,

    /** meta Store Summary inherited prop see StoreSummaryComponents for more info */
    store: STORE_SUMMARY_PROP_TYPES_SHAPE,

    /**
     * Flags if the name of the store should be a HyperLink to the store's page.
     */
    isStoreNameLink: PropTypes.bool,

    /** Whether to render for mobile. */
    isMobile: PropTypes.bool.isRequired
  };

  render () {
    let { store: {basicInfo}, isShowCtas, isSelectedClass, isStoreNameLink, isMobile } = this.props;
    let storeSelectedClass = cssClassName('store-info-data-condensed', { ' selected': isSelectedClass });

    return (
      <div className={storeSelectedClass} itemScope itemType="http://schema.org/ClothingStore">
        <StoreTitle basicInfo={basicInfo} isStoreNameLink={isStoreNameLink} isShowCtas={isShowCtas} isMobile={isMobile} />
        {isShowCtas && <DistanceFromMe />}
        <StoreAddress basicInfo={basicInfo} />
        <StorePhone basicInfo={basicInfo} />
        {isShowCtas && <div className="buttons-actions"><ViewStoreDetailsButton basicInfo={basicInfo} /></div>}
      </div>
    );
  }
}
