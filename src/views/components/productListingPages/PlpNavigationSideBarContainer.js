/**
 * @module PLPContainer
 * @author Gabriel Gomez
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PlpNavigationSideBar} from './PlpNavigationSideBar.jsx';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    breadcrumbs: productListingStoreView.getBreadcrumbs(state),
    navitagionTree: productListingStoreView.getNavigationTree(state),
    activeCategoryId: productListingStoreView.getListingId(state)
  };
}

export let PlpNavigationSideBarContainer = connectPlusStoreOperators(
  {productsOperator: getProductsOperator}, mapStateToProps
)(PlpNavigationSideBar);
