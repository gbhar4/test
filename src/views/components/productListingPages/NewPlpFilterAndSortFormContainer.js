import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {NewPlpFilterAndSortForm, formName} from './NewPlpFilterAndSortForm.jsx';
import {getProductsFormOperator} from 'reduxStore/storeOperators/formOperators/productsFormOperator';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getFormValues, formValueSelector} from 'redux-form';
import {TOOLBAR_FIELD_NAMES} from 'views/components/productListingPages/ProductListingToolbarComponents.jsx';


// TODO: we should break this compoent down, there is way to much happending here... will take care of this in the upcoming filter form re-design task
function mapStateToProps (state, ownProps, storeOperators) {
  const selector = formValueSelector(formName);

  let selectedColorFilters = selector(state, TOOLBAR_FIELD_NAMES.colors) || [];
  let selectedSizesFilters = selector(state, TOOLBAR_FIELD_NAMES.sizes) || [];
  let selectedDepFilters = selector(state, TOOLBAR_FIELD_NAMES.departments) || [];
  let selectedSebdepFilters = selector(state, TOOLBAR_FIELD_NAMES.subDepartments) || [];

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    onSubmit: storeOperators.productsFormOperator.submitProductListingFiltersForm,
    filtersMaps: productListingStoreView.getFiltersMaps(state),
    sortOptionsMap: productListingStoreView.getAvailableSortsMap(state),
    totalProductsCount: productListingStoreView.getTotalProductsCount(state),
    currentSearchTerm: productListingStoreView.getListingSearchText(state),
    initialValues: {
      ...productListingStoreView.getAppliedFilterIds(state),
      sort: productListingStoreView.getAppliedSort(state)
    },
    isShowDepartmentFilterSelector: productListingStoreView.isShowDepartmentFilterSelector(state),
    isShowSubDepartmentFilterSelector: productListingStoreView.isShowSubDepartmentFilterSelector(state),

    // DT-31958
    // Need to pass form values in as prop so we can compare current values to previous values
    formValues: getFormValues('PlpFilterAndSortForm')(state),
    selectedSizesFilters: selectedSizesFilters.length,
    selectedColorFilters: selectedColorFilters.length,
    selectedDepFilters: selectedDepFilters.length,
    selectedSebdepFilters: selectedSebdepFilters.length
  };
}

export let NewPlpFilterAndSortFormContainer = connectPlusStoreOperators(
  {productsFormOperator: getProductsFormOperator}, mapStateToProps
)(NewPlpFilterAndSortForm);
