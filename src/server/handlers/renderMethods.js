/** @module renderMethods
 * @summary exposes an object with methods for rendering the server-side react root ui component of various pages.
 *
 * @author Ben
 */
import {render} from './storeWrappedPage.jsx';

import {CartPage} from 'views/pages/CartPage.jsx';
import {CheckoutPageContainer} from 'views/pages/CheckoutPageContainer.js';
import {InternationalCheckoutPageContainer} from 'views/pages/InternationalCheckoutPageContainer.js';
import {MyAccountPageContainer} from 'views/pages/MyAccountPageContainer.js';
import {OrderDetailsPage} from 'views/pages/OrderDetailsPage.jsx';
import {ReservationDetailsPageContainer} from 'views/pages/ReservationDetailsPageContainer.js';
import {StoreDetailsPage} from 'views/pages/StoreDetailsPage.jsx';
import {SiteStoresPage} from 'views/pages/SiteStoresPage.jsx';
import {PlccPage} from 'views/pages/PlccPage.jsx';
import {FavoritesPage} from 'views/pages/FavoritesPage.jsx';
import {HelpCenterPage} from 'views/pages/HelpCenterPage.jsx';
import {ProductDetailsPage} from 'views/pages/ProductDetailsPage.jsx';
import {HomePage} from 'views/pages/HomePage.jsx';
import {ContentPage} from 'views/pages/ContentPage.jsx';
import {ProductListingPageContainer} from 'views/pages/ProductListingPageContainer';
import {StoreLocatorPageContainer} from 'views/pages/StoreLocatorPageContainer.js';
import {SiteMapPage} from 'views/pages/SiteMapPage.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';

// for legacy support
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';

export const RENDER_METHODS = {
  cartRenderMethod: (store) => render(store, CartPage, getProps(store)),
  checkoutRenderMethod: (store) => render(store, CheckoutPageContainer, getProps(store)),
  intlCheckoutRenderMethod: (store) => render(store, InternationalCheckoutPageContainer, getProps(store)),
  myAccountRenderMethod: (store) => render(store, MyAccountPageContainer,
    getProps(store,
      {isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(store.getState())}
    )
  ),
  guestOrderDetailsRenderMethod: (store) => render(store, OrderDetailsPage, getProps(store)),
  guestReservationDetailsRenderMethod: (store) => render(store, ReservationDetailsPageContainer, getProps(store)),
  webInstantCreditRenderMethod: (store) => render(store, PlccPage, getProps(store)),
  storeDetailsRenderMethod: (store) => render(store, StoreDetailsPage, getProps(store)),
  storeLocatorRenderMethod: (store) => render(store, StoreLocatorPageContainer, getProps(store)),
  favoritesRenderMethod: (store) => render(store, FavoritesPage, getProps(store)),
  helpCenterRenderMethod: (store) => render(store, HelpCenterPage, getProps(store)),
  usAndCaStoresRenderMethod: (store) => render(store, SiteStoresPage, getProps(store)),
  homePageRenderMethod: (store) => render(store, HomePage, getProps(store)),
  productDetailsRenderMethod: (store) => render(store, ProductDetailsPage, getProps(store)),
  productListingRenderMethod: (store) => render(store, ProductListingPageContainer, getProps(store)),
  searchRenderMethod: (store) => render(store, ProductListingPageContainer, getProps(store)),
  contentRenderMethod: (store) => render(store, ContentPage, getProps(store)),
  outfitDetailsRenderMethod: (store) => render(store, ProductDetailsPage, getProps(store, {isOutfitPdp: true})),
  siteMapRenderMethod: (store) => render(store, SiteMapPage, getProps(store)),
  notFoundPageRenderMethod: (store) => render(store, ContentPage, getProps(store)),
  legacyHeaderRenderMethod: (store) => render(store, HeaderGlobalSticky, getProps(store)),
  legacyFooterRenderMethod: (store) => render(store, FooterGlobalContainer, getProps(store))
};

function getProps (store, extraProps) {
  let state = store.getState();
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isLoading: generalStoreView.getIsLoading(state),
    ...extraProps
  };
}
