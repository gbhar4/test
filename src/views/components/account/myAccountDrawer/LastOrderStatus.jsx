/** @module LastOrderStatus
 * Shows a resumed status of the last order entered by the user.
 *
 * @author Oliver Ramirez
 * @author Miguel Alvarez Igarzábal
 * @author Ben
 * @author DaMIaN
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Notification} from 'views/components/common/Notification.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {ORDER_STATUS} from 'reduxStore/storeReducersAndActions/user/orders/reducer.js';
import moment from 'moment';

// FIXME: move this map to the status options (in the prop-types) outside
let statusMessageMap = [
  {'key': ORDER_STATUS.ORDER_RECEIVED, 'value': 'Your order was received!'},
  {'key': ORDER_STATUS.ORDER_PROCESSING, 'value': 'Your order is processing'},
  {'key': ORDER_STATUS.ORDER_SHIPPED, 'value': 'Your order has shipped!'},
  {'key': ORDER_STATUS.ORDER_PARTIALLY_SHIPPED, 'value': 'Part of your order has shipped!'},
  {'key': ORDER_STATUS.ORDER_CANCELED, 'value': 'Your order was canceled.'},
  {'key': ORDER_STATUS.ITEMS_RECEIVED, 'value': 'Your order was received!'},
  {'key': ORDER_STATUS.ITEMS_READY_FOR_PICKUP, 'value': 'Your order is ready for pickup!'},
  {'key': ORDER_STATUS.ITEMS_PICKED_UP, 'value': 'Your order was picked up!'},
  {'key': ORDER_STATUS.ORDER_EXPIRED, 'value': 'Your order was not picked up in the allotted time frame and has been canceled.'},
  {'key': ORDER_STATUS.ORDER_USER_CALL_NEEDED, 'value': 'Your order was received!'}
];

let getMessageByStatus = function (status) {
  for (let mapIndex = 0; mapIndex < statusMessageMap.length; mapIndex++) {
    if (statusMessageMap[mapIndex].key === status) {
      return statusMessageMap[mapIndex].value;
    }
  }
};

export class LastOrderStatus extends React.Component {
  static propTypes = {
    order: PropTypes.shape({
      /** Current status of the order. */
      orderStatus: PropTypes.oneOf([
        ORDER_STATUS.ORDER_RECEIVED,
        ORDER_STATUS.ORDER_PROCESSING,         // fallback for 'other status'
        ORDER_STATUS.ORDER_SHIPPED,            // Ship-to-home orders
        ORDER_STATUS.ORDER_PARTIALLY_SHIPPED,  // Ship-to-home orders
        ORDER_STATUS.ORDER_CANCELED,          // Any king of orders
        ORDER_STATUS.ITEMS_RECEIVED,
        ORDER_STATUS.ITEMS_READY_FOR_PICKUP,   // BOPIS orders
        ORDER_STATUS.ORDER_EXPIRED,             // BOPIS orders
        ORDER_STATUS.ITEMS_PICKED_UP
      ]).isRequired,

      /** Number of the order. */
      orderNumber: PropTypes.string.isRequired,

      /** Tracking number of the order (not required, as tracking details might not be available). */
      orderTracking: PropTypes.string,
      /** defines how many days an oder´s notification will be displayed */
      limitOfDaysToDisplayNotification: PropTypes.string,
      /* defines if will be displayed from a drawer */
      isDrawer: PropTypes.bool,
      /* Function that close the drawer */
      onCloseDrawer: PropTypes.func
    })
  }
  constructor (props) {
    super(props);
    this.validateDiffInDaysNotification = this.validateDiffInDaysNotification.bind(this);
    this.handleDrawer = this.handleDrawer.bind(this);
  }

  validateDiffInDaysNotification (orderDate, limitOfDaysToDisplayNotification) {
    orderDate = moment(orderDate, 'MMM DD, YYYY');
    if (moment().diff(orderDate, 'days') <= limitOfDaysToDisplayNotification) {
      return true;
    }
  }

  handleDrawer () {
    this.props.onCloseDrawer && this.props.onCloseDrawer();
  }

  render () {
    if (!this.props.order) {
      return null;
    }

    let {isMobile, isDrawer, limitOfDaysToDisplayNotification, order: {
          orderStatus,
          orderNumber,
          orderTracking,
          orderTrackingUrl,
          orderDate
        }} = this.props;

    if (!this.validateDiffInDaysNotification(orderDate, limitOfDaysToDisplayNotification)) {
      return null;
    }

    let statusMessage = getMessageByStatus(orderStatus.toLowerCase());
    let body = <div className="order-status">
      <p>
        {statusMessage}
        {!isMobile && !isDrawer && <span>
          <HyperLink destination={MY_ACCOUNT_SECTIONS.orders.subSections.orderDetails}
            pathSuffix={orderNumber} className="order-number">View Order Details</HyperLink>
        </span>
        }
      </p>

      {!isMobile && !isDrawer
        ? <span>Order #: {orderNumber}</span>
        : <HyperLink destination={MY_ACCOUNT_SECTIONS.orders.subSections.orderDetails}
          pathSuffix={orderNumber} className="order-number" onClick={this.handleDrawer}>Order #: {orderNumber}</HyperLink>
      }

      {orderTracking && <span>
        {orderTrackingUrl === 'N/A'
          ? `Tracking # : ${orderTracking}`
          : <a href={orderTrackingUrl}> Tracking # : {orderTracking} </a>}
      </span>
      }

      {!isMobile && <span className="date-order"> {orderDate} </span>}
    </div>;

    return <Notification children={body} className="notification-summary notification-ship-to-home" />;
  }
}
