/**
 * @module OrdersHistory
 * Shows a list of orders with pagination in my account.
 *
 * @author Miguel <malvarez@minutentag.com>
 *
 * @author Florencia <facosta@minutentag.com>
 * @NOTE Canadian, US and International order links was added.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {SiteOrdersHistoryContainer} from './SiteOrdersHistoryContainer';
import {VENDOR_PAGES} from 'routing/routes/vendorPages.js';
import {VendorHyperLink} from 'views/components/common/routing/VendorHyperLink.js';

class OrdersHistory extends React.Component {
  static propTypes = {
    /** flag indicating if we're in Canada */
    isCanada: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      isCanadaSiteSelected: props.isCanada
    };
    this.toggleCanadaSiteSelected = this.toggleCanadaSiteSelected.bind(this);
  }

  toggleCanadaSiteSelected () {
    this.setState({isCanadaSiteSelected: !this.state.isCanadaSiteSelected});
  }

  render () {
    let isCanadaSiteSelected = this.state.isCanadaSiteSelected;

    return (
      <section className="orders orders-section">
        <SiteOrdersHistoryContainer isCanadaOrdersHistory={isCanadaSiteSelected} />

        <div className="show-orders-container">
          <button className="button-show-order" onClick={this.toggleCanadaSiteSelected}>
            {isCanadaSiteSelected ? 'Show US Orders' : 'Show Canadian Orders'}
          </button>
          <VendorHyperLink page={VENDOR_PAGES.internationalOrdersHistory} target="_blank"
            title="Show International Orders" className="button-show-international-order">
            Show International Orders
          </VendorHyperLink>
        </div>
      </section>
    );
  }
}

export {OrdersHistory};
