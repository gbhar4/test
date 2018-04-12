/**
* @module ConfirmationOrderNumberDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Order confirmation page
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {ConfirmationItemDisplay} from './ConfirmationItemDisplay.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.confirmation-order-number-display.scss');
} else {
  require('./_m.confirmation-order-number-display.scss');
}

class ConfirmationOrderNumberDisplay extends React.Component {
  static dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  static propTypes = {
    orderDate: PropTypes.instanceOf(Date).isRequired,
    orderNumber: PropTypes.string.isRequired,
    // orderLink: PropTypes.string.isRequired,
    orderTotal: PropTypes.number,
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,
    /** email address of the guest user */
    guestUserEmail: PropTypes.string
  }

  render () {
    let {orderDate, orderNumber, /* orderLink , */ orderTotal, isGuest,
      guestUserEmail} = this.props;

    return (
      <div className="confirmation-item-container">
        <ConfirmationItemDisplay title="Order #" className="confirmation-order">
          {isGuest
            ? <HyperLink destination={PAGES.guestOrderDetails}
              pathSuffix={`${orderNumber}/${guestUserEmail}`}>{orderNumber}</HyperLink>
            : <HyperLink destination={MY_ACCOUNT_SECTIONS.orders.subSections.orderDetails}
              pathSuffix={orderNumber}>{orderNumber}</HyperLink>
          }

        </ConfirmationItemDisplay>

        <ConfirmationItemDisplay title="Order Date" className="confirmation-date">
          {orderDate.toLocaleDateString('en-US', ConfirmationOrderNumberDisplay.dateOptions)}
        </ConfirmationItemDisplay>

        {orderTotal && <ConfirmationItemDisplay title="Order Total" className="confirmation-total">
          ${orderTotal.toFixed(2)}
        </ConfirmationItemDisplay>}
      </div>
    );
  }
}

export {ConfirmationOrderNumberDisplay};
