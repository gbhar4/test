/**
* @module ConfirmationOrderNumbersByFulfillmentList
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Order confirmation page
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {ConfirmationFulfillmentCenterItemDisplay} from './ConfirmationFulfillmentCenterItemDisplay.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.confirmation-order-fulfillment-list.scss');
} else {
  require('./_m.confirmation-order-fulfillment-list.scss');
}

class ConfirmationOrderNumbersByFulfillmentList extends React.Component {
  static dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  static propTypes = {
    holdDate: PropTypes.instanceOf(Date).isRequired,
    fullfillmentCenterMap: PropTypes.arrayOf(ConfirmationFulfillmentCenterItemDisplay.propTypes.center),
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired
  }

  render () {
    let {holdDate, fullfillmentCenterMap, isGuest} = this.props;

    return (fullfillmentCenterMap
      ? <div className="confirmation-fullfillmentlist">
        {fullfillmentCenterMap.map((center) => (
          <ConfirmationFulfillmentCenterItemDisplay key={center.orderNumber} center={center} isGuest={isGuest} />
        ))}
        <div className="confirmation-next-steps">
          <h3 className="confirmation-steps-title">What's next?</h3>
          <p>
            Check your email for your order confirmation. We'll also let you know when your order is ready for pickup.
            You will receive separate credit card charges for online and pickup orders.
          </p>

          {/* <h3 className="confirmation-steps-title">How long do I have?</h3>
          <p>
            We'll hold your items until the end of the business day on <strong>{holdDate.toLocaleDateString('en-US', ConfirmationOrderNumbersByFulfillmentList.dateOptions)}</strong>.
          </p> */}
        </div>
      </div>
      : null
    );
  }
}

export {ConfirmationOrderNumbersByFulfillmentList};
