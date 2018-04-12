/**
 * @author Agu
 * server side render for checkout page (any of them, store would indicate the active step)
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CheckoutHeaderMobile} from 'views/components/checkout/CheckoutHeaderMobile.jsx';
import {HeaderGlobalCheckout} from 'views/components/globalElements/HeaderGlobalCheckout.jsx';
import {expressCheckoutConnect} from 'views/components/globalElements/expressCheckoutConnect.js';
import {CheckoutProgressIndicatorContainer} from 'views/components/checkout/checkoutProgressIndicator/CheckoutProgressIndicatorContainer.jsx';
import {CheckoutWizardContainer} from 'views/components/checkout/CheckoutWizardContainer';
import {NavigationConfirmation} from 'views/components/globalElements/NavigationConfirmation.jsx';
import {PAGES} from 'routing/routes/pages';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {CheckoutConfirmationSectionContainer} from 'views/components/checkout/confirmation/CheckoutConfirmationSectionContainer.jsx';
import {LocationChangeTrigger} from 'views/components/common/routing/LocationChangeTrigger.jsx';
import {Route} from 'views/components/common/routing/Route.jsx';
import {AuthModalContainer} from 'views/components/login/AuthModalContainer.js';
import {ContentSlotModalsRendererContainer} from 'views/components/common/contentSlot/ContentSlotModalsRendererContainer';

import {RoutingWindowRefresherContainer} from 'views/components/common/routing/RoutingWindowRefresherContainer';
import {CHECKOUT_SECTIONS} from 'routing/routes/checkoutRoutes';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {CheckoutNotificationContainer} from '../components/checkout/notificaiton/CheckoutNotificationContainer';

if (DESKTOP) { // eslint-disable-line
  require('../components/checkout/_d.checkout-section.scss');
} else {
  require('../components/checkout/_m.checkout-section.scss');
}

const HeaderGlobalCheckoutContainer = expressCheckoutConnect(HeaderGlobalCheckout);
const CheckoutHeaderMobileContainer = expressCheckoutConnect(CheckoutHeaderMobile);

export class CheckoutPage extends React.Component {

  static propTypes = {
    /** indicates device (mobile vs desktop) */
    isMobile: PropTypes.bool.isRequired,
    /** flags that the shopping bag is empty */
    isBagEmpty: PropTypes.bool.isRequired,
    /** the method that is used to navigate to other pages */
    gotoPage: PropTypes.func.isRequired,
    /** indicates if the active step in the checkout is confirmation */
    isConfirmation: PropTypes.bool.isRequired,
    /** a callback for routing location change requests */
    onLocationChange: PropTypes.func.isRequired,
    /** Flags if the checkout form data is still being retrieved from the server */
    isLoading: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);

    this.gotoCart = () => this.props.gotoPage(PAGES.cart);
    this.handleLocationChange = (match) => this.props.onLocationChange(match.params.stage, false);
  }

  renderConfirmation () {
    let {isMobile} = this.props;
    return (
      <div>
        <Route path={PAGES.checkout.pathPattern}>
          <LocationChangeTrigger onLocationChange={this.handleLocationChange} triggerOnMount />
        </Route>

        <RoutingWindowRefresherContainer sections={CHECKOUT_SECTIONS} /> {/* scrolls window up whenever stage changes */}

        <HeaderGlobalSticky isMobile={isMobile} />

        <main className="main-section-container checkout-container">
          <CheckoutConfirmationSectionContainer />
        </main>

        <FooterGlobalContainer isMobile={isMobile} />
      </div>
    );
  }

  renderNonConfirmation () {
    let {isMobile, isBagEmpty} = this.props;

    return (
      <div>
        <Route path={PAGES.checkout.pathPattern}>
          <LocationChangeTrigger onLocationChange={this.handleLocationChange} triggerOnMount />
        </Route>

        <RoutingWindowRefresherContainer sections={CHECKOUT_SECTIONS} /> {/* scrolls window up whenever stage changes */}

        {isMobile
          ? <CheckoutHeaderMobileContainer />
          : <HeaderGlobalCheckoutContainer />
        }

        {!isBagEmpty && <CheckoutProgressIndicatorContainer />}

        <main className="checkout-container">
          <CheckoutNotificationContainer />
          <CheckoutWizardContainer />
        </main>

        <NavigationConfirmation message="Are you sure you want to return to your Shopping Bag?"
          confirm="Return to bag" cancel="Stay in checkout" onConfirmClick={this.gotoCart} />

        <ContentSlotModalsRendererContainer />
        <AuthModalContainer />
      </div>
    );
  }

  render () {
    let {isMobile, isLoading, isConfirmation} = this.props;

    if (isLoading) {
      return (<div>
        {isConfirmation
          ? <HeaderGlobalSticky isMobile={isMobile} />
          : isMobile
            ? <CheckoutHeaderMobileContainer />
            : <HeaderGlobalCheckoutContainer />
        }

        <main className="checkout-container">
          <Spinner />
        </main>
      </div>);
    } else {
      return isConfirmation ? this.renderConfirmation() : this.renderNonConfirmation();
    }
  }

}
