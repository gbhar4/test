import React from 'react';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {Rewards} from 'views/components/rewards/Rewards.jsx';
import {ContentSlotList} from 'views/components/common/contentSlot/ContentSlotList.jsx';
import {HOME_PAGE_SECTIONS} from 'routing/routes/homePageRoutes';
import {Route} from 'views/components/common/routing/Route.jsx';
import {GlobalHeaderDrawerOpener} from 'views/components/globalElements/header/GlobalHeaderDrawerOpener';
import {TrackOrderOpener} from 'views/components/trackorder/TrackOrderOpener.js';
import {CountrySelectorOpener} from 'views/components/formCountrySelect/CountrySelectorOpener.js';
import {DRAWER_IDS, LOGIN_FORM_TYPES} from 'reduxStore/storeReducersAndActions/globalComponents/globalComponents';
import {ProductRecommendationsListContainer} from 'views/components/recommendations/ProductRecommendationsListContainer.js';

const CONTENT_SLOTS_MEMBERS_TOP = [
  {contentSlotName: 'email_signup'},
  {contentSlotName: 'limited_promotion'},
  {contentSlotName: 'promo_spot_1'},
  {contentSlotName: 'promo_spot_2'},
  {contentSlotName: 'social_shopping'}
];

const CONTENT_SLOTS_MEMBERS_BOTTOM = [
  {contentSlotName: 'registered_popular_products'},
  {contentSlotName: 'promo_spot_3'}
];

export class HomePage extends React.Component {

  render () {
    let {isMobile, rewardsOverlay} = this.props;

    return (
      <div>
        <Route path={HOME_PAGE_SECTIONS[DRAWER_IDS.LOGIN].pathPattern} component={GlobalHeaderDrawerOpener}
          componentProps={{drawerId: DRAWER_IDS.LOGIN}} />

        <Route path={HOME_PAGE_SECTIONS[DRAWER_IDS.CREATE_ACCOUNT].pathPattern} component={GlobalHeaderDrawerOpener}
          componentProps={{drawerId: DRAWER_IDS.CREATE_ACCOUNT}} />

        <Route path={HOME_PAGE_SECTIONS[DRAWER_IDS.WISHLIST_LOGIN].pathPattern} component={GlobalHeaderDrawerOpener}
          componentProps={{drawerId: DRAWER_IDS.WISHLIST_LOGIN}} />

        <Route path={HOME_PAGE_SECTIONS[LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET].pathPattern} component={GlobalHeaderDrawerOpener}
          componentProps={{drawerId: DRAWER_IDS.LOGIN, formId: LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET}} />

        <Route path={HOME_PAGE_SECTIONS.trackOrder.pathPattern} component={TrackOrderOpener} />

        <Route path={HOME_PAGE_SECTIONS.shipTo.pathPattern} component={CountrySelectorOpener} />

        <HeaderGlobalSticky isMobile={isMobile} />

        <main className="main-section-container">
          <ContentSlotList contentSlots={CONTENT_SLOTS_MEMBERS_TOP} />

          <ProductRecommendationsListContainer />

          <ContentSlotList contentSlots={CONTENT_SLOTS_MEMBERS_BOTTOM} />
        </main>
        <FooterGlobalContainer isMobile={isMobile} />
        {rewardsOverlay && <Rewards {...this.props} />}
      </div>
    );
  }
}
