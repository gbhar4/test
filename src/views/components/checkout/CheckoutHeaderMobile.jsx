import React from 'react';
import {PropTypes} from 'prop-types';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

export class CheckoutHeaderMobile extends React.Component {

  static propTypes = {
    /** Flags if to render the express checkout form */
    isExpressCheckout: PropTypes.bool.isRequired
  }

  render () {
    return (
      <header className="header-global header-checkout">
        <HyperLink destination={PAGES.cart} className="button-exit-checkout" aria-label="Exit checkout"></HyperLink>

        <HyperLink destination={PAGES.homePage} className="logo">
          <img src="/wcsstore/static/images/TCP-Logo.svg" alt="The Children's Place"
            srcSet="/wcsstore/static/images/TCP-Logo-1x.png 1x, /wcsstore/static/images/TCP-Logo-2x.png 2x, /wcsstore/static/images/TCP-Logo-3x.png 3x" />
        </HyperLink>

        {this.props.isExpressCheckout
        ? <h3 className="title-checkout">Express Check out</h3>
        : <h3 className="title-checkout">Check out</h3>}
      </header>
    );
  }

}
