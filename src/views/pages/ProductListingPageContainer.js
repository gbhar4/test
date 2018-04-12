/**
 * @module PLPContainer
 * @author Gabriel Gomez
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ProductListingPage} from './ProductListingPage.jsx';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator';
import {abTestingStoreView} from 'reduxStore/storeViews/abTestingStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    breadcrumbs: productListingStoreView.getBreadcrumbs(state),
    navitagionTree: productListingStoreView.getNavigationTree(state),
    totalProductsCount: productListingStoreView.getTotalProductsCount(state),
    currentSearchTerm: productListingStoreView.getListingSearchText(state),
    onLocationChange: storeOperators.productsOperator.getProductsListingForUrlLocation,
    categoryId: productListingStoreView.getListingId(state),
    slotsList: productListingStoreView.getEspotByCategory(state),
    isDepartmentLanding: productListingStoreView.getIsDepartmentLanding(state),
    description: productListingStoreView.getListingDescription(state),
    isShowFooter: productListingStoreView.getLastLoadedPageNumber(state) === productListingStoreView.getMaxPageNumber(state),
    isNewMobileFilterForm: abTestingStoreView.getIsNewMobileFilterActive(state)
  };
}

export let ProductListingPageContainer = connectPlusStoreOperators(
  {productsOperator: getProductsOperator}, mapStateToProps
)(ProductListingPage);
