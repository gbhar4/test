/**
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {InternationalCheckout} from 'views/components/checkout/InternationalCheckout.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {CheckoutHeaderMobile} from 'views/components/checkout/CheckoutHeaderMobile.jsx';
import {HeaderGlobalCheckout} from 'views/components/globalElements/HeaderGlobalCheckout.jsx';
import {expressCheckoutConnect} from 'views/components/globalElements/expressCheckoutConnect.js';
import {NavigationConfirmation} from 'views/components/globalElements/NavigationConfirmation.jsx';
import {AuthModalContainer} from 'views/components/login/AuthModalContainer.js';
import {ContentSlotModalsRendererContainer} from 'views/components/common/contentSlot/ContentSlotModalsRendererContainer';

const HeaderGlobalCheckoutContainer = expressCheckoutConnect(HeaderGlobalCheckout);
const CheckoutHeaderMobileContainer = expressCheckoutConnect(CheckoutHeaderMobile);

export class InternationalCheckoutPage extends React.Component {
  static propTypes = {
    /** indicates device (mobile vs desktop) */
    isMobile: PropTypes.bool.isRequired,

    /** Flags if the checkout form data is still being retrieved from the server */
    isLoading: PropTypes.bool.isRequired,

    /** url of the js file controlling communication between iframe and outside */
    apiUrl: PropTypes.string.isRequired,

    /** url of the communication iframe */
    communicationUrl: PropTypes.string.isRequired,

    /** international checkout iframe url */
    iframeUrl: PropTypes.string.isRequired
  }

  render () {
    let {isLoading, isMobile, apiUrl, communicationUrl, iframeUrl} = this.props;

    return (<div>
      {isMobile
        ? <CheckoutHeaderMobileContainer />
        : <HeaderGlobalCheckoutContainer />
      }

      <main className="checkout-container">
        {isLoading
          ? <Spinner />
          : <InternationalCheckout iframeUrl={iframeUrl} apiUrl={apiUrl} communicationUrl={communicationUrl} iframeUrl={iframeUrl} />
        }
      </main>

      <NavigationConfirmation message="Are you sure you want to return to your Shopping Bag?"
        confirm="Return to bag" cancel="Stay in checkout" onConfirmClick={this.gotoCart} />

      <ContentSlotModalsRendererContainer />
      <AuthModalContainer />
    </div>);
  }
}
