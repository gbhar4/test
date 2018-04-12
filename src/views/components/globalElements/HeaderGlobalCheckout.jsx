/**
 * @module HeaderGlobalCheckout
 * @author Agu
 * Global header for desktop checkout
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {HomeButton} from './header/HomeButton.jsx';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.header-global.scss');
  require('./_d.overlay.scss');
  require('./_d.checkout-header.scss');
}

export class HeaderGlobalCheckout extends React.Component {
  static propTypes = {
    /** Flags if to render the express checkout form */
    isExpressCheckout: PropTypes.bool.isRequired
  }

  render () {
    let {isExpressCheckout} = this.props;

    return (
      <header className="header-global">
        <div className="container-global-navigation viewport-container">
          <HomeButton />

          <div className="checkout-header">
            <h1 className="header-title-checkout">{isExpressCheckout && 'Express '}Checkout</h1>

            <HyperLink destination={PAGES.cart} className="return-to-bag-link">Return to bag</HyperLink>
          </div>
        </div>
      </header>
    );
  }

}
