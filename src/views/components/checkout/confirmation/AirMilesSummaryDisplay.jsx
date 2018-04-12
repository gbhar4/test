/**
* @module AirMilesSummaryDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Airmiles details for order confirmation page
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {ConfirmationItemDisplay} from './ConfirmationItemDisplay.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.air-miles-summary-display.scss');
} else {
  require('./_m.air-miles-summary-display.scss');
}

class AirMilesSummaryDisplay extends React.Component {
  static propTypes: {
    accountNumber: PropTypes.string.isRequired,
    promoId: PropTypes.string.isRequired
  }

  render () {
    let {accountNumber, promoId} = this.props;

    return (<section className="airmiles-thanks-container">
      <div className="airmiles-logo-container logo-airmiles-fpo">
        <img src="#" />
        {/* This tag will be hidden until we get the AirMiles logo. Reference to invision in the index for more details. Florencia */}
      </div>
      <h1>Air Miles Rewards Program</h1>
      <p className="airmiles-thanks-note">
        Thank you for participating in our Air Miles Rewards Program!
        You'll be receiving airmiles for your purchase.
      </p>

      <div className="confirmation-item-container">
        <ConfirmationItemDisplay title="Air Miles Collector #">
          {accountNumber}
        </ConfirmationItemDisplay>

        <ConfirmationItemDisplay title="Promo Id">
          {promoId}
        </ConfirmationItemDisplay>
      </div>
    </section>);
  }
}

export {AirMilesSummaryDisplay};
