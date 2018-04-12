/**
 * @module StoreLocatorPage
 *
 * @author Damian <drossi@minutentag.com>
 * @summary Page to show a store's list, with short specifications rendering respective's default store map.
  * @notes  - footerGlobalContainer needs to get a isMobile state to see if it is true or not.
 * To render Footer, It used be to called from jsx directly (ex <footerGlobal isMobile={isMobile} /> ),
 *now, we are calling it from it's  container and not from window.store anymore.
 * I understand that this won't be a problem anymore (get fixed automatically) when routing is implemented.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {StoresSearchFormContainer} from 'views/components/store/searchForm/StoresSearchFormContainer.js';
import {StoreLocatorList} from 'views/components/store/locator/StoreLocatorList.jsx';
import {STORE_ID_DATA_ATTRIBUTE} from 'views/components/store/locator/StoreLocatorListItem.jsx';
import {StoreMap} from 'views/components/store/StoreMap.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {STORE_TYPES} from 'views/components/common/propTypes/storesPropTypes';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';
import {scrollToFirstMatchingElement} from 'util/viewUtil/scrollingAndFocusing';

if (DESKTOP) { // eslint-disable-line
  require('views/components/store/_d.store-locator.scss');
} else {
  require('views/components/store/_m.store-locator.scss');
}

export class StoreLocatorPage extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Indicates whether to show the back to account button or not */
    isShowBackToMyAccount: PropTypes.bool.isRequired,

    /** Array of stores to display */
    storesList: StoreLocatorList.propTypes.storesList,
    /** flags if we are in mobile */
    isMobile: PropTypes.bool.isRequired,
    /** Indicates if "save as default store" feature is enabled */
    isEnableSetAsDefault: PropTypes.bool,
    /** flags if data is being loaded */
    isLoading: PropTypes.bool,
    /**
     * Function to call to set a store as the default one for the user. The
     * called function will receive one parameter, the id of the store.
     */
    onSetFavoriteStore: PropTypes.func.isRequired,
    /** callback to load the stores near certain coordinates */
    loadStoresByLatLng: PropTypes.func.isRequired,
    /** The Id of the users favorit store */
    favoriteStoreId: PropTypes.string
  }

  constructor (props) {
    super(props);
    let {isMobile} = props;
    this.state = {
      isShowStoresList: true,
      isShowStoresMap: !isMobile,
      isShowOnlyBopisStores: false,
      isShowOnlyOutletStores: false,
      selectedStoreId: null,
      isSearchShouldReload: false,
      isFromMyAccountPage: false
    };
    this.handleShowOnlyBopisStoresChange = this.handleShowOnlyBopisStoresChange.bind(this);
    this.handleShowOnlyOutletStoresChange = this.handleShowOnlyOutletStoresChange.bind(this);
    this.handleStoreItemClicked = this.handleStoreClicked.bind(this, false);
    this.handleStoreMarkerClicked = this.handleStoreClicked.bind(this, true);
    this.handleSetFavoriteStore = this.handleSetFavoriteStore.bind(this);
    this.handleViewList = this.handleViewList.bind(this);
    this.handleViewMap = this.handleViewMap.bind(this);
  }

  handleViewList () {
    if (!this.state.isShowStoresList) {
      this.setState((prevState, isShowStoresMap) => ({
        isShowStoresList: !prevState.isShowStoresList,
        isShowStoresMap: !prevState.isShowStoresMap
      }));
    }
  }

  handleViewMap () {
    if (!this.state.isShowStoresMap) {
      this.setState((prevState, isShowStoresMap) => ({
        isShowStoresList: !prevState.isShowStoresList,
        isShowStoresMap: !prevState.isShowStoresMap
      }));
    }
  }

  handleShowOnlyBopisStoresChange (newValue) {
    this.setState({isShowOnlyBopisStores: !!newValue});
  }

  handleShowOnlyOutletStoresChange (newValue) {
    this.setState({isShowOnlyOutletStores: !!newValue});
  }

  handleStoreClicked (isScrollStoreToView, storeId) {
    this.setState({selectedStoreId: storeId});
    if (isScrollStoreToView) {
      scrollToFirstMatchingElement(STORE_ID_DATA_ATTRIBUTE, storeId);
    }
  }

  handleSetFavoriteStore (storeId) {
    return this.props.onSetFavoriteStore(storeId).then(() => this.setState({isSearchShouldReload: true}));
  }

  componentWillReceiveProps (nextProps) {
    // When hydrating from the server we need to recheck this on mount as react will throw an error if the HTML is not the same as the server
    if (!this.isShowBackToMyAccount && nextProps.isShowBackToMyAccount) {
      this.setState({ isFromMyAccountPage: true });
    }
  }

  render () {
    let {isMobile, isLoading, isGuest, storesList,
      favoriteStoreId, isEnableSetAsDefault, loadStoresByLatLng} = this.props;
    let storeLocatorClassName = cssClassName('main-section-container store-locators ', {'viewport-container ': !isMobile});
    let {isShowStoresList, isShowStoresMap, isShowOnlyBopisStores,
      isShowOnlyOutletStores, selectedStoreId, isFromMyAccountPage} = this.state;

    if (isLoading) return <HeaderSpinnerFooter isMobile={isMobile} />;

    let filteredStoresList = storesList.filter((store) => {
      return (!isShowOnlyBopisStores || store.features.isBopisAvailable) && (!isShowOnlyOutletStores || store.features.storeType === STORE_TYPES.OUTLET);
    });
    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />

        <main className={storeLocatorClassName}>
          <div className="store-information-container">

            {isFromMyAccountPage &&
              <div className="back-to-account-container">
                <div>
                  <HyperLink destination={PAGES.myAccount} className="button-back-to-account"> Return to My Account</HyperLink>
                </div>
              </div>}

            <div className="store-information">
              <StoresSearchFormContainer isShowStoresMap={isShowStoresMap} isShowOnlyBopisStoresInitialValue={isShowOnlyBopisStores}
                isShowOnlyOutletStoresInitialValue={isShowOnlyOutletStores}
                onListClick={this.handleViewList} onMapClick={this.handleViewMap}
                onShowOnlyBopisStoresChange={this.handleShowOnlyBopisStoresChange}
                onShowOnlyOutletStoresChange={this.handleShowOnlyOutletStoresChange}
                filteredStoresQuantity={filteredStoresList.length} />
              {isShowStoresList && (
                <StoreLocatorList
                  isGuest={isGuest}
                  storesList={filteredStoresList} onStoreClick={this.handleStoreItemClicked}
                  onSetFavoriteStore={this.handleSetFavoriteStore}
                  {...{isMobile, selectedStoreId, favoriteStoreId, isEnableSetAsDefault}} />
              )}
            </div>
            {isShowStoresMap &&
              <StoreMap storesList={filteredStoresList} className="google-map"
                onStoreMarkerClick={this.handleStoreMarkerClicked} centeredStoreId={selectedStoreId}
                loadStoresByLatLng={loadStoresByLatLng} />
            }
          </div>

          <div className="international-stores-link">
            <HyperLink destination={PAGES.usAndCaStores} className="link-stores">View a list of all US and Canada stores</HyperLink>
            <p className="international-store-container">
              Looking for an international store? <HyperLink destination={PAGES.content} pathSuffix={'international-stores'} className="international-store-button">click here</HyperLink>.
            </p>
          </div>
        </main>

        <FooterGlobalContainer />
      </div>
    );
  }
}
