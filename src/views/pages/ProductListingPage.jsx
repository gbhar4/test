/**
 * @module PLP - Product Listing Page
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {ProductsGridContainer} from 'views/components/productListingPages/ProductsGridContainer';
import {PlpNavigationSideBarContainer} from 'views/components/productListingPages/PlpNavigationSideBarContainer';
import {LocationChangeTrigger} from 'views/components/common/routing/LocationChangeTrigger.jsx';
import {EmptySearchResultsFormPLP} from 'views/components/productListingPages/EmptySearchResultsFormPLP.jsx';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';
import {FixedBreadCrumbs} from 'views/components/common/routing/FixedBreadCrumbs.jsx';
import {SearchByKeywords} from 'views/components/productListingPages/ProductListingToolbarComponents.jsx';
import {DepartmentListingContent} from 'views/components/productListingPages/DepartmentListingContent.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {ContentSlotList} from 'views/components/common/contentSlot/ContentSlotList.jsx';
import {AuthModalContainer} from 'views/components/login/AuthModalContainer.js';
import {ContentSlotModalsRendererContainer} from 'views/components/common/contentSlot/ContentSlotModalsRendererContainer';

if (DESKTOP) { // eslint-disable-line
  require('views/components/productListingPages/_d.product-listing-section.scss');
} else {
  require('views/components/productListingPages/_m.product-listing-section.scss');
}

export class ProductListingPage extends React.Component {

  static propTypes = {
    /** flags if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,
    /** flags if data is being loaded */
    isLoading: PropTypes.bool,
    /** flags if on an L1 plp */
    isDepartmentLanding: PropTypes.bool.isRequired,

    /** list of espots to show */
    slotsList: ContentSlotList.propTypes.contentSlots,

    /** the id of the category */
    categoryId: PropTypes.string,
    /** Description for the category */
    description: PropTypes.string,
    /** total number of products */
    totalProductsCount: PropTypes.number.isRequired,

    /** search term current engaged */
    currentSearchTerm: PropTypes.string,

    /** callback for when location changes (to reload plp). Accepts the new location */
    onLocationChange: PropTypes.func.isRequired,

    /** indicates whether to show the footer or not */
    isShowFooter: PropTypes.bool.isRequired,

    /** list of all the L2 to display in department landings of mobile only, required only for isDepartmentLanding===true */
    navitagionTree: PropTypes.arrayOf(PropTypes.shape({
      /** naming representation to the category */
      name: PropTypes.string.isRequired,
      /** full path to relevant page */
      plpPath: PropTypes.string.isRequired
    })).isRequired
  };

  constructor (props) {
    super(props);

    this.handleLocationChange = (_, location, history) => (history.action === 'POP') && this.props.onLocationChange(location);
  }

  renderContent () {
    let {totalProductsCount, currentSearchTerm, isDepartmentLanding, categoryId, slotsList, description, isMobile, navitagionTree, isNewMobileFilterForm} = this.props;

    if (isDepartmentLanding) {          // an L1 PLP
      return <DepartmentListingContent isMobile={isMobile} navitagionTree={navitagionTree} categoryId={categoryId} description={description} isShowEspot slotsList={slotsList} />;
    } else if (currentSearchTerm) {     // a search results page
      return totalProductsCount > 0
        ? <ProductsGridContainer isNewMobileFilterForm={isNewMobileFilterForm} categoryId={categoryId} description={description} isShowEspot />
        : <EmptySearchResultsFormPLP currentSearchTerm={currentSearchTerm} />;
    } else {                           // an L2 or L3 PLP
      return <ProductsGridContainer isNewMobileFilterForm={isNewMobileFilterForm} categoryId={categoryId} description={description} isShowEspot slotsList={slotsList} />;
    }
  }

  render () {
    let {isMobile, isLoading, breadcrumbs, currentSearchTerm, isShowFooter, isNewMobileFilterForm} = this.props;

    if (isLoading) return <HeaderSpinnerFooter isMobile={isMobile} />;

    let className = cssClassName(
      'plp-section-container search-result-container ',
      {'viewport-container ': !isMobile, 'search-from-navigation ': !currentSearchTerm, 'new-plp-section-container': isNewMobileFilterForm});

    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />
        <div className={className}>
          {!currentSearchTerm ? <FixedBreadCrumbs crumbs={breadcrumbs} separationChar=">" /> : <SearchByKeywords currentSearchTerm={currentSearchTerm} />}
          {!currentSearchTerm && <PlpNavigationSideBarContainer isMobile={isMobile} />}
          {this.renderContent()}
        </div>
        {isShowFooter && <FooterGlobalContainer isMobile={isMobile} />}
        {!isShowFooter && <ContentSlotModalsRendererContainer />}
        {!isShowFooter && <AuthModalContainer />}
        <LocationChangeTrigger onLocationChange={this.handleLocationChange} triggerOnMount={false} />
      </div>
    );
  }
}
