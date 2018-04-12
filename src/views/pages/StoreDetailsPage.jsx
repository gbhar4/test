/**
 * @author Miguel <malvarez@minutentag.com>
 * Page to show the details of a store, other recommended stores and multiple eSpots.
 * @notes  - footerGlobalContainer needs to get a isMobile state to see if it is true or not.
 * To render Footer, It used be to called from jsx directly (ex <footerGlobal isMobile={isMobile} /> ), now, we are calling it from it's  container and not from window.store anymore.
 * I understand that this won't be a problem anymore (get fixed automatically) when routing is implemented.
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {StoreDetailsContainer} from 'views/components/store/detail/StoreDetailsContainer.js';
import {StoreRecommendationsListContainer} from 'views/components/store/detail/StoreRecommendationsListContainer.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {Route} from 'views/components/common/routing/Route.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';

if (DESKTOP) { // eslint-disable-line
  require('views/components/store/detail/_d.store-details.scss');
} else {
  require('views/components/store/detail/_m.store-details.scss');
}

export class StoreDetailsPage extends React.Component {

  static propTypes = {
    /** indicates device (mobile vs desktop) */
    isMobile: PropTypes.bool.isRequired,
    /** flags if data is being loaded */
    isLoading: PropTypes.bool
  }

  constructor (props) {
    super(props);
    this.state = {isExpanded: true};
    this.handleToggleRecommendations = this.handleToggleRecommendations.bind(this);
  }

  handleToggleRecommendations () {
    if (this.props.isMobile) {
      this.setState((prevState) => ({
        isExpanded: !prevState.isExpanded
      }));
    }
  }

  render () {
    let {isMobile, isLoading} = this.props;
    let {isExpanded} = this.state;
    let nearStoresTitleClassName = cssClassName('near-stores-title  ', { 'collapsed': !isExpanded });

    if (isLoading) return <HeaderSpinnerFooter isMobile={isMobile} />;

    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />

        <main className={cssClassName('main-section-container store-location ', {'viewport-container': !isMobile})}>
          <div className="container-store-info">
            <Route path={PAGES.storeDetails.pathPattern} component={StoreDetailsContainer} />
          </div>

          <div className="nearest-stores-from-selected-store">
            <h4 className={nearStoresTitleClassName} onClick={this.handleToggleRecommendations}>Other locations near you</h4>
            {(!isMobile || (isMobile && isExpanded)) && <StoreRecommendationsListContainer />}
          </div>

          <div className="container-slots">
            <ContentSlot contentSlotName={['<StoreLocatorId>_LOCAL_espot3', '<STATE>_Store_espot3', '<country>_Country_Store_MidLeft', 'global_store_espot3']} className="bottom-map map-middle" />
            <ContentSlot contentSlotName={['<StoreLocatorId>_LOCAL_espot2', '<STATE>_Store_espot2', '<country>_Country_Store_MidRight', 'global_store_espot2']} className="bottom-map map-middle" />
            <ContentSlot contentSlotName={['<StoreLocatorId>_LOCAL_espot4', '<STATE>_Store_espot4', '<country>_Country_Store_Bottom', 'global_store_espot4']} className="bottom-map main-map" />
          </div>
        </main>

        <FooterGlobalContainer isMobile={isMobile} />
      </div>
    );
  }
}
