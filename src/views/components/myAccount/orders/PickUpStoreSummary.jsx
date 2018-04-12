/**
 * @module PickUpStoreSummary
 * Show the summary of a store where the order needs to be, or has been, picked
 * up.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {VendorHyperLink} from 'views/components/common/routing/VendorHyperLink.js';
import {VENDOR_PAGES} from 'routing/routes/vendorPages.js';
import formatTime from 'util/formatTime.js';
import {STORE_SUMMARY_PROP_TYPES} from 'views/components/common/propTypes/storesPropTypes';
import {parseDate} from 'util/parseDate.js';

export class PickUpStoreSummary extends React.Component {
  static propTypes = {
    /** Store information */
    store: PropTypes.shape({
      ...STORE_SUMMARY_PROP_TYPES,
      /** pick up alternative person details */
      pickUpAlternative: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        emailAddress: PropTypes.string.isRequired
      })
    })
  }

  render () {
    let {store: {basicInfo, hours, distance}} = this.props;
    let {addressLine1, city, state, zipCode} = basicInfo.address;

    let today;
    if (hours) {
      let now = new Date();
      today = hours.regularHours.find((day) => {
        let openingHour = parseDate(day.openIntervals[0].fromHour);
        return now.getDay() === openingHour.getDay();
      });
    }

    return (
      <div className="store-info-data" itemScope itemType="http://schema.org/ClothingStore">
        <h3 className="store-name" itemProp="name">{basicInfo.storeName}</h3>

        <address className="store-address">
          {basicInfo.address.addressLine1}<br />
          {basicInfo.address.city}, {basicInfo.address.state}, {basicInfo.address.zipCode}
        </address>
        {distance && `${distance} away from you.`}
        {today && <p className="distance-and-open-information"><strong className="today-schedule">Open today: {today.openIntervals.map((interval, idx) => [(idx || null) && ', ', (idx || null) && <br />, formatTime(interval.fromHour) + ' - ' + formatTime(interval.toHour)])}</strong></p>}
        <p className="store-phone-number">Phone: {basicInfo.phone}</p>

        <div className="buttons-actions">
          <VendorHyperLink page={VENDOR_PAGES.getDirectionsGoogleMap} target="_blank"
            params={[addressLine1, city, state, zipCode]} className="button-get-directions">
            Get Directions
          </VendorHyperLink>
        </div>
      </div>
    );
  }
}
