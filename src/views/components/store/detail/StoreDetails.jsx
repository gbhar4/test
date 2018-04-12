/**
 * @module StoreDetails
 * Show the summary, open hours, map and other details of the currently selected
 * store in the store locator.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

import {StoreSummaryDetailed} from './StoreSummaryDetailed.jsx';
import {STORE_SUMMARY_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/storesPropTypes';
import {StoreOpenHours} from './StoreOpenHours.jsx';
import {StoreMap} from 'views/components/store/StoreMap.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.store-details.scss');
} else {
  require('./_m.store-details.scss');
}

class StoreDetails extends React.Component {
  static propTypes = {
    /** id of the store whose details to show */
    storeId: PropTypes.string.isRequired,
    /** function to call to have the store details loaded */
    onLoadStoreDetails: PropTypes.func.isRequired,
    /** The whole information of the store. */
    store: STORE_SUMMARY_PROP_TYPES_SHAPE,
    isMobile: PropTypes.bool.isRequired
  }

  loadingStoreId: null

  componentDidMount () {
    this.loadStoreDetails(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.loadStoreDetails(nextProps);
  }

  loadStoreDetails (props) {
    if (this.loadingStoreId !== props.storeId) {
      this.loadingStoreId = props.storeId;
      this.props.onLoadStoreDetails(props.storeId, true);
    }
  }

  getButton () {
    let getDirections = 'https://maps.google.com/maps?daddr=' + this.props.store.basicInfo.address.addressLine1 + ',%20' + this.props.store.basicInfo.address.city + ',%20' + this.props.store.basicInfo.address.state + ',%20' + this.props.store.basicInfo.address.zipCode;

    return <a className="button-directions" href={getDirections} target="_blank">Get directions</a>;
  }

  render () {
    if (!this.props.store) {
      return null;
    }

    let {store: {features, hours}, store, isMobile} = this.props;

    return (
      <div>
        <div className="store-info-content">
          <StoreSummaryDetailed isShowCtas store={store} />

          {!isMobile && this.getButton()}

          <div className="time-schedules">
            <StoreOpenHours isInitiallyExpanded isSelfExpandable isCardItem={false} title="Store Hours" openHours={hours.regularHours} sectionClassName="regular-time-schedules" isShowDetailedDate />
            {hours.holidayHours.length > 0 && <StoreOpenHours isCardItem={false} title="Holidays Hours" openHours={hours.holidayHours} sectionClassName="regular-time-schedules" isShowDetailedDate />}
          </div>

          <div className="store-type">
            {features.mallType && <p><span className="title-type">Mall Type: </span><span className="name-type">{features.mallType}</span></p>}
            {features.entranceType && <p><span className="title-type">Type of Entrance: </span><span className="name-type">{features.entranceType}</span></p>}
          </div>
        </div>
        <div className="container-map-slot">
          <StoreMap storesList={[store]} className="google-map" />

          {isMobile && this.getButton()}

          <ContentSlot contentSlotName={['<StoreLocatorId>_LOCAL_espot1', '<STATE>_Store_espot1', '<country>_Country_Store_Top', 'global_store_espot1']} className="bottom-map" />
        </div>
      </div>
    );
  }
}

export {StoreDetails};
