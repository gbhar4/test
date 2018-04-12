/**
 * @module OrderItemsList
 * Shows a list of items in a submitted purchase order.
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Florencia <facosta@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {OrderItem} from './OrderItem.jsx';
import {Accordion} from 'views/components/accordion/Accordion.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';

class OrderItemsList extends React.Component {
  static propTypes = {
    /** flag indicating if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,
    /** array of order items to show in the list */
    items: PropTypes.arrayOf(OrderItem.propTypes.item).isRequired,
    /** this is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,
    /** element to show as the header of the list */
    header: PropTypes.element.isRequired,
    /** element to show as the notification of the list */
    notification: PropTypes.element,
    /** flags whether to show the Write a Review link or not */
    isShowWriteReview: PropTypes.bool.isRequired,
    /** flags if the list is being used to show canceled items */
    isCanceledList: PropTypes.bool
  }

  static defaultProps = {
    isCanceledList: false
  }

  renderDesktop () {
    let {items, currencySymbol, header, notification, className, isCanceledList, isShowWriteReview} = this.props;
    let containerClassName = cssClassName('table-products ', 'orders-products-list ', className);

    return (
      <div className={containerClassName}>
        {header}
        {notification}
        <table className="table-products table-products-list">
          <thead>
            <tr className="container-titles">
              <th>Product</th>
              <th>Original Price</th>
              <th>You Paid</th>
              <th>Qty</th>
              <th>Subtotal</th>
              {isShowWriteReview && <th> </th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <OrderItem key={index} isCanceledList={isCanceledList}
                {...{item, currencySymbol, isShowWriteReview}} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  renderMobile () {
    let {items, currencySymbol, header, notification, className, isCanceledList, isShowWriteReview} = this.props;
    let containerClassName = cssClassName('table-products ', 'accordion-products-list ', className);

    return (
      <Accordion title={header} className={containerClassName}>
        {notification}
        <ul>
          {items.map((item) => (
            <OrderItem isCanceledList={isCanceledList} isMobile key={item.productInfo.upc}
              {...{item, currencySymbol, isShowWriteReview}} />
          ))}
        </ul>
      </Accordion>
    );
  }

  render () {
    let {isMobile} = this.props;

    return (
      isMobile
        ? this.renderMobile()
        : this.renderDesktop()
    );
  }
}

export {OrderItemsList};
