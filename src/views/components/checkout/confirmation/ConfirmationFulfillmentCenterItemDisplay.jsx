/**
* @module ConfirmationFulfillmentCenterItemDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Order confirmation page
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {ConfirmationOrderNumberDisplay} from './ConfirmationOrderNumberDisplay.jsx';
import {ButtonTooltip} from 'views/components/tooltip/ButtonTooltip.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.confirmation-fullfillment-item.scss');
} else {
  require('./_m.confirmation-fullfillment-item.scss');
}

class ConfirmationFulfillmentCenterItemDisplay extends React.Component {
  static propTypes = {
    center: PropTypes.oneOfType([PropTypes.shape({
      storeName: PropTypes.string.isRequired,
      storeLink: PropTypes.string.isRequired,
      address: PropTypes.object.isRequired, // FIXME: address proptype
      productsCount: PropTypes.number.isRequired,

      todayOpenRange: PropTypes.string.isRequired,
      tomorrowOpenRange: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,

      orderDate: PropTypes.instanceOf(Date).isRequired,
      orderNumber: PropTypes.string.isRequired,
      orderLink: PropTypes.string.isRequired,
      orderTotal: PropTypes.string.isRequired,

      /**
       * Email address of the person who will pick up items. Only required for
       * guest checkout.
       */
      emailAddress: PropTypes.string
    }), PropTypes.shape({
      shippingFullname: PropTypes.string.isRequired,
      productsCount: PropTypes.number.isRequired,

      orderDate: PropTypes.string.isRequired,
      orderNumber: PropTypes.string.isRequired,
      orderLink: PropTypes.string.isRequired,
      orderTotal: PropTypes.string.isRequired,

      /** Email address of the user. Only required for guest checkout. */
      emailAddress: PropTypes.string
    })]).isRequired,
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired
  }

  render () {
    let {center: {
        storeName, storeLink, address, shippingFullname, productsCount, orderDate,
        orderNumber, orderLink, orderTotal, todayOpenRange, tomorrowOpenRange,
        phoneNumber, emailAddress
      },
      isGuest} = this.props;

    return (
      <div className="confirmation-fullfillmentlist-item">
        <h2 className="confirmation-fullfillment-type">{shippingFullname ? 'Shipping' : 'Pickup'} ({productsCount} item{productsCount !== 1 ? 's' : ''})</h2>
        <div className="confirmation-fullfillment-details">
          {shippingFullname}
          {storeName && <div>
            <a className="confirmation-fullfillment-store" href={storeLink} title={storeName}>{storeName}</a>
            <ButtonTooltip className="tooltip-store" type="info" title={storeName} direction="top">
              <p>
                {address.addressLine1}<br />
                {address.addressLine2 && [address.addressLine2, <br />]}
                {[address.city, ', ', address.state, ' ', address.zipCode]}<br /><br />
                <em>Today:</em> {todayOpenRange}<br />
                <em>Tomorrow:</em> {tomorrowOpenRange}<br />
                <em>Phone:</em> {phoneNumber}
              </p>
            </ButtonTooltip>
          </div>}
        </div>
        <ConfirmationOrderNumberDisplay orderDate={orderDate} orderNumber={orderNumber} orderLink={orderLink}
          orderTotal={orderTotal} isGuest={isGuest} guestUserEmail={emailAddress} />
      </div>
    );
  }
}

export {ConfirmationFulfillmentCenterItemDisplay};
