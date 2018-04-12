/** @module MyAccountPage
 * Component for My Account page.
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Switch} from 'views/components/common/routing/Switch.jsx';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {Route} from 'views/components/common/routing/Route.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {AccountOverviewContainer} from 'views/components/myAccount/overview/AccountOverviewContainer.js';
import {USARewards} from 'views/components/myAccount/rewards/USARewards.jsx';
import {AddressBookContainer} from 'views/components/myAccount/addressBook/AddressBookContainer.js';
import {AccountProfileInfo} from 'views/components/myAccount/profileInformation/AccountProfileInfo.jsx';
import {Orders} from 'views/components/myAccount/orders/Orders.jsx';
import {MyAccountHelloMessageContainer} from 'views/components/myAccount/header/welcome/MyAccountHelloMessageContainer.js';
import {MyAccountHeaderContainer} from 'views/components/myAccount/header/MyAccountHeaderContainer.js';
import {MyAccountHeaderMobileContainer} from 'views/components/myAccount/header/MyAccountHeaderMobileContainer.js';
import {MyAccountNavigationContainer} from 'views/components/myAccount/menu/MyAccountNavigationContainer.js';
import {Payments} from 'views/components/myAccount/paymentMethods/Payments.jsx';
import {MY_ACCOUNT_SECTIONS, MY_ACCOUNT_PAGE} from 'routing/routes/myAccountRoutes.js';
import {Redirect} from 'react-router-dom';
import {RoutingWindowRefresherContainer} from 'views/components/common/routing/RoutingWindowRefresherContainer';
import {Reservations} from 'views/components/myAccount/reservations/Reservations.jsx';
import {CommunicationPreferencesContainer} from 'views/components/myAccount/communicationPreferences/CommunicationPreferencesContainer.js';
import {CanadaRewards} from 'views/components/myAccount/rewards/CanadaRewards.jsx';
import {LocationChangeTrigger} from 'views/components/common/routing/LocationChangeTrigger.jsx';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

const RedirectToRoot = (props) => <Redirect to={props.match.url} />;

if (DESKTOP) { // eslint-disable-line
  require('views/components/myAccount/_d.my-account-section.scss');
} else {
  require('views/components/myAccount/_m.my-account-section.scss');
}

class MyAccountPage extends React.Component {
  static propTypes = {
    /** flags if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,

    /* Flag to indicate if the country do not accept rewards. For example: Canada */
    isRewardsEnabled: PropTypes.bool,

    /** callback to be called when location changes */
    onEvalFlashMessageExpiration: PropTypes.func.isRequired,

    /** flag to show whether the page is loading */
    isLoading: PropTypes.bool.isRequired,

    /** callback to populate redux store information needed by the "profile-info" tab */
    onProfileInfoTabMount: PropTypes.func.isRequired,

    /** callback to populate redux store information needed by the "reservations" tab */
    onReservationsTabMount: PropTypes.func.isRequired,

    /** callback to populate redux store information needed by the "orders" tab */
    onOrdersInfoTabMount: PropTypes.func.isRequired,

    /** callback to populate redux store information needed by the "rewards" tab for USA */
    onUSARewardsTabMount: PropTypes.func.isRequired
  }

  render () {
    let {isMobile, isLoading, isRewardsEnabled, onProfileInfoTabMount, onReservationsTabMount, onUSARewardsTabMount, onOrdersInfoTabMount, onEvalFlashMessageExpiration} = this.props;
    let containerClassName = cssClassName('main-section-container ', ' my-account-content');

    if (isLoading) return <HeaderSpinnerFooter isMobile={isMobile} />;

    return (
      <div>
        <RoutingWindowRefresherContainer sections={MY_ACCOUNT_SECTIONS} /> {/* scrolls window up whenever stage changes */}
        <HeaderGlobalSticky isMobile={isMobile} />

        <div>
          <div className="my-account-container">
            {isMobile
              ? <MyAccountHeaderMobileContainer />
              : isRewardsEnabled && <MyAccountHeaderContainer />
            }
            <main className={containerClassName}>
              <div className={!isMobile ? 'viewport-container' : null}>
                {!isMobile &&
                  [!isRewardsEnabled && <MyAccountHelloMessageContainer key="hello-message" />,
                    <Route component={MyAccountNavigationContainer} key="navigation" />]
                }
                <Switch>

                  <Route path={MY_ACCOUNT_SECTIONS.myRewards.pathPattern} component={USARewards}
                    componentProps={{className: 'my-account-section-content', onMount: onUSARewardsTabMount}} />

                  <Route path={MY_ACCOUNT_SECTIONS.offersAndCoupons.pathPattern} component={CanadaRewards}
                    componentProps={{className: 'my-account-section-content'}} />

                  <Route path={MY_ACCOUNT_SECTIONS.orders.pathPattern} component={Orders}
                    componentProps={{className: 'my-account-section-content', onMount: onOrdersInfoTabMount}} />

                  <Route path={MY_ACCOUNT_SECTIONS.reservations.pathPattern} component={Reservations}
                    componentProps={{className: 'my-account-section-content', onMount: onReservationsTabMount}} />

                  <Route path={MY_ACCOUNT_SECTIONS.addressBook.pathPattern} component={AddressBookContainer}
                    componentProps={{className: 'my-account-section-content'}} />

                  <Route path={MY_ACCOUNT_SECTIONS.paymentAndGiftCards.pathPattern} component={Payments}
                    componentProps={{className: 'my-account-section-content'}} />

                  <Route path={MY_ACCOUNT_SECTIONS.profileInformation.pathPattern} component={AccountProfileInfo}
                    componentProps={{className: 'my-account-section-content', onMount: onProfileInfoTabMount}} />

                  <Route path={MY_ACCOUNT_SECTIONS.communicationPreferences.pathPattern} component={CommunicationPreferencesContainer}
                    componentProps={{className: 'my-account-section-content'}} />

                  <Route path={MY_ACCOUNT_PAGE.rootPathPattern} component={AccountOverviewContainer}
                    componentProps={{className: 'my-account-section-content'}} exact />

                  <Route path={MY_ACCOUNT_PAGE.rootPathPattern} render={RedirectToRoot} strict /> {/* redirects all unknown sections to the root of this page */}
                </Switch>
              </div>
            </main>
          </div>
        </div>

        <FooterGlobalContainer />
        <LocationChangeTrigger onLocationChange={onEvalFlashMessageExpiration} triggerOnMount={false} />
      </div>
    );
  }
}

export {MyAccountPage};
