/**
 * @module SiteOrdersHistory
 * Shows a list of orders of a certain country (US or CA) with pagination in my
 * account.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {OrdersList} from './OrdersList.jsx';
import {PagedListNav} from 'views/components/common/PagedListNav.jsx';

class SiteOrdersHistory extends React.Component {
  static propTypes = {
    /** total number of order pages */
    totalNumberOfPages: PropTypes.number.isRequired,
    /**
     * Callback to handle request to view a certain page of the list. It should
     * accept two parameters:
     *  - the site id whose orders are being listed,
     *  - the page number (one-based).
     */
    onGoToPage: PropTypes.func.isRequired,
    /**
     * array with one element for each page. Each element is itself and array
     * of the orders in the page.
     */
    ordersPages: PropTypes.array.isRequired,
    /** site show orders will be shown */
    ordersSite: PropTypes.string.isRequired,
    /** flag indicating if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {currentPage: 1};
    this.handleGoToPage = this.handleGoToPage.bind(this);
  }

  componentDidMount () {
    this.initiallyLoadSiteOrders(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.initiallyLoadSiteOrders(nextProps);
  }

  /**
   * Ensure site orders get loaded, but only if they still weren't.
   */
  initiallyLoadSiteOrders (props) {
    let {currentPage} = this.state;
    if (!props.ordersPages[currentPage - 1]) {
      this.handleGoToPage(currentPage, props);
    }
  }

  handleGoToPage (pageNumber, props) {
    let {onGoToPage, ordersSite} = props || this.props;
    onGoToPage(ordersSite, pageNumber).then(() => {
      this.setState({currentPage: pageNumber});
    });
  }

  render () {
    let {ordersPages, totalNumberOfPages, isMobile} = this.props;
    let {currentPage} = this.state;
    let currentPageOrders = ordersPages[currentPage - 1];

    return (
      <div className="order-list-container">
        {isMobile &&
          <PagedListNav {...{currentPage, totalNumberOfPages}}
            onGoToPage={this.handleGoToPage} />}
        <OrdersList ordersList={currentPageOrders} isMobile={isMobile} />
        <PagedListNav {...{currentPage, totalNumberOfPages}}
          onGoToPage={this.handleGoToPage} />
      </div>
    );
  }
}

export {SiteOrdersHistory};
