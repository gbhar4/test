/** @module OrdersList
 * @summary Table with the history of orders for the user.
 *
 * @author Oliver Ramirez
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {PropTypes} from 'prop-types';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.order-list.scss');
} else {
  require('./_m.order-list.scss');
}

class OrdersList extends React.Component {
  static propTypes = {
    /** array of orders for the current list page */
    ordersList: PropTypes.arrayOf(PropTypes.shape({
      /** Date of the order. */
      orderDate: PropTypes.string.isRequired,
      /** Number of the order. */
      orderNumber: PropTypes.string.isRequired,
      /** where the purchase was made */
      isEcomOrder: PropTypes.bool.isRequired,
      /** Current status of the order. */
      orderStatus: PropTypes.string.isRequired,
      /** Total purchase */
      orderTotal: PropTypes.number.isRequired,
      /** Currency symbol used in the order */
      currencySymbol: PropTypes.string.isRequired
    })),
    /** flag indicating if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired
  }

  static defaultProps = {
    ordersList: []
  }

  render () {
    let {ordersList, isMobile} = this.props;

    return (
      <table className={cssClassName('order-or-reservation-list', {' table-orders': isMobile})}>
        {!isMobile &&
          <thead>
            <tr className="table-orders-title">
              <th>Order Date</th>
              <th>Order #</th>
              <th>Order Type</th>
              <th>Status</th>
              <th className="order-or-reservation-total">Total</th>
            </tr>
          </thead>
        }

        <tbody>
        {ordersList.map((order) =>
          <tr key={order.orderNumber}>
            <td className="order-date-container">{order.orderDate}</td>
            {/* TODO: I'm using an <a> element below because with routing implemented, maybe a target URL is enough */}
            <td className="order-number-container">
              <HyperLink destination={MY_ACCOUNT_SECTIONS.orders.subSections.orderDetails}
                pathSuffix={order.orderNumber} className="order-number">{order.orderNumber}</HyperLink>
            </td>
            {isMobile && <td className="total-container">{order.currencySymbol}{order.orderTotal.toFixed(2)}</td>}
            <td className="purchase-container">{order.isEcomOrder ? 'Online' : 'Pick-up Instore'}</td>
            <td className="status-container">{order.orderStatus}</td>
            {!isMobile && <td className="order-or-reservation-total total-container">{order.currencySymbol}{order.orderTotal.toFixed(2)}</td>}
          </tr>
        )}
        </tbody>
      </table>
    );
  }
}

export {OrdersList};
