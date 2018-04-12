/** @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CartPage} from './CartPage.jsx';
import {CheckoutPageContainer} from './CheckoutPageContainer.js';
import {InternationalCheckoutPageContainer} from './InternationalCheckoutPageContainer.js';
import {MyAccountPageContainer} from './MyAccountPageContainer.js';
import {OrderDetailsPage} from './OrderDetailsPage.jsx';
import {ReservationDetailsPageContainer} from './ReservationDetailsPageContainer.js';
import {StoreDetailsPage} from 'views/pages/StoreDetailsPage.jsx';
import {SiteStoresPage} from './SiteStoresPage.jsx';
import {PlccPage} from './PlccPage.jsx';
import {FavoritesPage} from 'views/pages/FavoritesPage.jsx';
import {HelpCenterPage} from './HelpCenterPage.jsx';
import {ProductDetailsPage} from 'views/pages/ProductDetailsPage.jsx';
import {HomePage} from './HomePage.jsx';
import {ContentPage} from './ContentPage.jsx';
import {ProductListingPageContainer} from './ProductListingPageContainer';
import {StoreLocatorPageContainer} from './StoreLocatorPageContainer.js';
import {SiteMapPage} from './SiteMapPage.jsx';
import {PAGES} from 'routing/routes/pages';

const PAGES_MAP = {
  [PAGES.cart.id]: (isMobile, isLoading) => <CartPage isMobile={isMobile} />,
  [PAGES.checkout.id]: (isMobile, isLoading) => <CheckoutPageContainer isMobile={isMobile} />,
  [PAGES.intlCheckout.id]: (isMobile, isLoading) => <InternationalCheckoutPageContainer isMobile={isMobile} />,
  [PAGES.myAccount.id]: (isMobile, isLoading, isRewardsEnabled) => <MyAccountPageContainer isMobile={isMobile} isLoading={isLoading} isRewardsEnabled={isRewardsEnabled} />,
  [PAGES.guestOrderDetails.id]: (isMobile, isLoading) => <OrderDetailsPage isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.guestReservationDetails.id]: (isMobile, isLoading) => <ReservationDetailsPageContainer isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.webInstantCredit.id]: (isMobile, isLoading) => <PlccPage isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.storeDetails.id]: (isMobile, isLoading) => <StoreDetailsPage isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.favorites.id]: (isMobile, isLoading) => <FavoritesPage isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.helpCenter.id]: (isMobile, isLoading) => <HelpCenterPage isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.productDetails.id]: (isMobile, isLoading) => <ProductDetailsPage isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.outfitDetails.id]: (isMobile, isLoading) => <ProductDetailsPage isMobile={isMobile} isLoading={isLoading} isOutfitPdp />,
  [PAGES.homePage.id]: (isMobile, isLoading) => <HomePage isMobile={isMobile} />,
  [PAGES.changePassword.id]: (isMobile, isLoading) => <HomePage isMobile={isMobile} />,
  [PAGES.content.id]: (isMobile, isLoading) => <ContentPage isMobile={isMobile} />,
  [PAGES.productListing.id]: (isMobile, isLoading) => <ProductListingPageContainer isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.search.id]: (isMobile, isLoading) => <ProductListingPageContainer isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.storeLocator.id]: (isMobile, isLoading) => <StoreLocatorPageContainer isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.usAndCaStores.id]: (isMobile, isLoading) => <SiteStoresPage isMobile={isMobile} isLoading={isLoading} />,
  [PAGES.siteMap.id]: (isMobile, isLoading) => <SiteMapPage isMobile={isMobile} isLoading={isLoading} />
};

export class AppRootPage extends React.Component {
  static propTypes = {
    onComponentDidMount: PropTypes.func,
    activePage: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  render () {
    let {activePage, isMobile, isLoading, isRewardsEnabled} = this.props;

    let renderMethod = PAGES_MAP[activePage];
    if (renderMethod) {
      return renderMethod(isMobile, isLoading, isRewardsEnabled);
    } else {
      return <ContentPage isMobile={isMobile} isLoading={isLoading} />;
    }
  }

  componentDidMount () {
    this.props.onComponentDidMount && this.props.onComponentDidMount();
  }
}
