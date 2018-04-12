/**
 * @author Ben
 */
import {logErrorAndServerThrow, getSubmissionError} from './operatorHelper';
import {
  getSetQuickviewProductActn,
  getSetQuickViewRequestInfoActn,
  getClearQuickviewProductActn,
  getSetQuickviewProductOptionsForColorActn,
  getForgetLastAddedToBagItemActn,
  getSetLastAddedToBagItemActn
} from 'reduxStore/storeReducersAndActions/quickView/quickView';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getProductsAbstractor} from 'service/productsServiceAbstractor';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {quickViewStoreView} from 'reduxStore/storeViews/quickViewStoreView';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator.js';
import {getMapSliceForColorProductId} from 'util/viewUtil/productsCommonUtils';

let previous = null;

export function getQuickViewOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new QuickViewOperator(store);
  }
  return previous;
}

class QuickViewOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get productsAbstractor () {
    return getProductsAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  clearQuickViewRequest () {
    this.store.dispatch(getClearQuickviewProductActn());
    return Promise.resolve();
  }

  // setQuickViewRequestInfo (generalProductId, showBopis, requestorKey = generalProductId) {
  //   let quickViewRequestInfo = {generalProductId, showBopis, requestorKey};
  //   this.store.dispatch(getSetQuickViewRequestInfoActn(quickViewRequestInfo));
  // }

  loadBopisQuickViewInfo (generalProductId, initialValues, colorProductId = generalProductId, requestorKey = generalProductId) {
    return this.setQuickViewRequestInfoAndLoadProduct(generalProductId, initialValues, colorProductId, true, requestorKey);
  }

  loadQuickViewInfo (generalProductId, colorProductId = generalProductId, requestorKey = generalProductId) {
    return this.setQuickViewRequestInfoAndLoadProduct(generalProductId, undefined, colorProductId, false, requestorKey);
  }

  // loadQuickViewProduct (generalProductId) {
  //   return this.productsAbstractor.getProductInfoById(generalProductId)
  //   .then((res) => this.updateProductColorFitsSizesMap(res.product, res.product.generalProductId).then(() => res))
  //   .then((res) => {
  //     this.store.dispatch(getSetQuickviewProductActn(res.product));
  //   }).catch((err) => {
  //     throw getSubmissionError(this.store, 'QuickViewOperator.loadQuickViewProduct', err);
  //   });
  // }

  setActiveProductColor (colorProductId) {
    return Promise.resolve().then(() => {
      let currentProduct = quickViewStoreView.getQuickViewProduct(this.store.getState());

      let colorOptionsMapEntry = getMapSliceForColorProductId(currentProduct.colorFitsSizesMap, colorProductId);
      if (!colorOptionsMapEntry) throw new Error(`QuickViewOperator.setActiveProductColor: colorFitsSizesMap missing entry for colorProductId='${colorProductId}'`);

      return getProductsOperator(this.store).getUpdatedOptionsInventoryForColor(colorOptionsMapEntry)
      .then((newColorOptionsMap) => {
        this.store.dispatch(getSetQuickviewProductOptionsForColorActn(colorProductId, newColorOptionsMap));
      }).catch((err) => {
        logErrorAndServerThrow(this.store, 'QuickViewOperator.setActiveProductColor', err);
      });
    });
  }

  setQuickViewRequestInfoAndLoadProduct (generalProductId, initialValues, colorProductId, showBopis, requestorKey) {
    let quickViewRequestInfo = {generalProductId, showBopis, requestorKey, initialValues};
    let imageGenerator = getProductsOperator(this.store).getImgPath;

    return this.productsAbstractor.getProductInfoById(generalProductId, imageGenerator)
    .then((res) => this.updateProductColorFitsSizesMap(res.product, colorProductId).then(() => res))
    .then((res) => {
      this.store.dispatch([
        getSetQuickviewProductActn(res.product),
        getSetQuickViewRequestInfoActn(quickViewRequestInfo)
      ]);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'QuickViewOperator.setQuickViewRequestInfoAndLoadProduct', err);
    });
  }

  updateProductColorFitsSizesMap (currentProduct, colorProductId) {
    return Promise.resolve().then(() => {
      let colorOptionsMapEntry = getMapSliceForColorProductId(currentProduct.colorFitsSizesMap, colorProductId);
      if (!colorOptionsMapEntry) throw new Error(`QuickViewOperator.updateProductColorFitsSizesMap: colorFitsSizesMap missing entry for colorProductId='${colorProductId}'`);

      return getProductsOperator(this.store).getUpdatedOptionsInventoryForColor(colorOptionsMapEntry)
      .then((newColorOptionsMap) => {
        // refresh the currentProduct (may have changed if user dismissed BOPIS modal)
        currentProduct = quickViewStoreView.getQuickViewProduct(this.store.getState());
        if (currentProduct) {       // check that the user did not get out of BOPIS modal while the request was being processed by the server
          this.store.dispatch(getSetQuickviewProductOptionsForColorActn(colorProductId, newColorOptionsMap));
        }
      }).catch((err) => {
        logErrorAndServerThrow(this.store, 'QuickViewOperator.updateProductColorFitsSizesMap', err);
      });
    });
  }

  openAddedToBagNotification (cartItemInfo) {
    return this.store.dispatch(getSetLastAddedToBagItemActn(cartItemInfo));
  }

  forgetLastAddedToBagItem () {
    this.store.dispatch(getForgetLastAddedToBagItemActn());
  }

}
