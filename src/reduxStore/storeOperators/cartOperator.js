// TODO: Migrating these function to cartFormOperator
// we should have operator to manipulate ALL uiFlags within cart > uiFlags
// import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getProductsAbstractor} from 'service/productsServiceAbstractor';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {logErrorAndServerThrow, getSubmissionError} from 'reduxStore/storeOperators/operatorHelper';
import {getCartAbstractor} from 'service/cartServiceAbstractor';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getCheckoutOperator} from 'reduxStore/storeOperators/checkoutOperator';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {
  getSetAirmilesPromoIdActn,
  getSetAirmilesAccountActn
} from 'reduxStore/storeReducersAndActions/user/user';

import {
  getSetCurrentOrderIdActn,
  getSetCartActn,
  setEstimatedRewards,
  getSetEstimatedAirMilesActn,
  getSetGiftWrappingTotalActn,
  getSetGiftCardTotalActn,
  setShippingTotal,
  setTaxesTotal,
  getSetCouponsTotalActn,
  setSavingsTotal,
  getSetItemsTotalAction,
  setItemsCount,
  getSetSubTotal,
  getSetSubTotalWithDiscountsActn,
  getSetGrandTotal,
  getSetRewardsToBeEarnedActn,
  getSetIsEditableActn,
  getSetIsPayPalEnabledActn,
  getSetItemColorsSizeOptionsAction,
  getSetItemOptionsForColorAction,
  getSetItemOOSActn
  // getSetTotalsByFullfillmentCenterMap
} from 'reduxStore/storeReducersAndActions/cart/cart';
import {getSetGiftCardValuesActn} from 'reduxStore/storeReducersAndActions/checkout/checkout';
import {getUserAbstractor} from 'service/userServiceAbstractor';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator.js';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {PAGES} from 'routing/routes/pages';
import {getMapSliceForColorProductId} from 'util/viewUtil/productsCommonUtils';

export const CONFIRM_MODAL_IDS = {
  OOS_OR_UNAVAILABLE: 'cartOperator_oos',
  EDITING: 'cartOperator_editing'
};

let previous = null;
export function getCartOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new CartOperator(store);
  }
  return previous;
}

class CartOperator {
  constructor (store) {
    this.store = store;
    // create this-bound varsions of all methods of this class whoes name that start with 'submit'
    bindAllClassMethodsToThis(this);

    // #if LEGACY
    window.updateMinibagCount = () => this.loadCartItemsCount();
    window.startCheckout = () => this.startCheckout();
    // #endif
  }

  get cartServiceAbstractor () {
    return getCartAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get userServiceAbstractor () {
    return getUserAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get productsServiceAbstractor () {
    return getProductsAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  loadCartItemsCount () {
    return this.cartServiceAbstractor.getCurrentOrderSummary().then((res) => {
      this.store.dispatch(setItemsCount(res.totalItems));
      this.store.dispatch(getSetCurrentOrderIdActn(res.orderId));
    });
  }

  // This weird parameter (to say the least) is because backend service
  // needs to flag where the call
  // is being made from to recalculate taxes or not.
  // apparently calculation has performance impact
  // so it has to happen on specific scenarios:
  // Load or cart Page: true
  // Load of Shipping / Billing / Review / Paypal Review / Express Review: false
  // After applying/removing promo code: true
  // After applying/removing gift cards: false
  loadFullCartDetails (isRecalculateTaxes) {
    let imageGenerator = getProductsOperator(this.store).getImgPath;
    let isCart = routingStoreView.getCurrentPageId(this.store.getState()) === PAGES.cart.id;
    return this.cartServiceAbstractor.getCurrentOrder(null, isCart || isRecalculateTaxes, false, imageGenerator).then((res) => {
      // FIXME: we need to to update checkout information when applying a promo code because paymentId changes
      // and it's a required parameter to place an order on backend service
      // I don't think this is the best place for this thing (first of all, id should not change on backend...)
      // but if we need to place it, this is probably not the best place for it
      // as we could be on some legacy (or any other non-checkout page)
      // maybe an observer on checkoutOperator?
      getCheckoutOperator(this.store).storeUpdatedCheckoutValues(res);
      return updateCartInfo(this.store, res, true);
    });
  }

  /**
   * @param {cartInfo} - API response of cart items
   * @param {isSetCartItems} - if true we will dispatch reduct action to update cart items
   * @param {shouldExportActions} - if true we will not disptach action and just return an array of actions
   */
  setCartInfo (cartInfo, isSetCartItems, shouldExportActions) {
    return updateCartInfo(this.store, cartInfo, isSetCartItems, shouldExportActions);
  }

  setCartItemToEditMode (itemId) {
    let cartItem = cartStoreView.getCartItems(this.store.getState()).find((item) => itemId === item.itemInfo.itemId);

    /* NOTE: backend infinite wizdom strikes again: they want skuId instead of generalProductId for gift cards */
    let colorProductId = cartItem.productInfo.isGiftCard ? cartItem.productInfo.skuId : cartItem.productInfo.generalProductId;
    let imageGenerator = getProductsOperator(this.store).getSwatchImgPath;

    return this.productsServiceAbstractor.getSwatchesAndSizes(colorProductId, imageGenerator)
    .then((colorsSizesAndFitsMap) => {
      let colorOptionsMapEntry = getMapSliceForColorProductId(colorsSizesAndFitsMap, colorProductId);
      if (!colorOptionsMapEntry) throw new Error(`cartOperator.setCartItemToEditMode: colorFitsSizesMap missing entry for colorProductId='${colorProductId}'`);

      return getProductsOperator(this.store).getUpdatedOptionsInventoryForColor(colorOptionsMapEntry).then((colorOptionsMap) => {
        this.store.dispatch([
          getSetItemColorsSizeOptionsAction(itemId, colorsSizesAndFitsMap),
          getSetItemOptionsForColorAction(itemId, colorProductId, colorOptionsMap),
          getSetIsEditableActn(itemId, true)
        ]);
      });
    }).catch((err) => {
      throw getSubmissionError(this.store, 'cartOperator.setCartItemToEditMode', err);
    });
  }

  clearCart () {
    let actions = [
      getSetCurrentOrderIdActn(''),
      setEstimatedRewards(0),
      getSetEstimatedAirMilesActn(0),
      setShippingTotal(0),
      getSetGiftWrappingTotalActn(0),
      getSetGiftCardTotalActn(0),
      setTaxesTotal(0),
      setSavingsTotal(0),
      getSetCouponsTotalActn(0),
      getSetItemsTotalAction(0),
      setItemsCount(0),
      getSetSubTotal(0),
      getSetSubTotalWithDiscountsActn(0),
      getSetGrandTotal(0),
      getSetGiftCardValuesActn([]),
      getSetAirmilesPromoIdActn(null),
      getSetAirmilesAccountActn(null),
      getSetRewardsToBeEarnedActn(0),
      getSetCartActn([])
    ];

    this.store.dispatch(actions);
  }

  loadItemSwatchesAndSizes (itemId, colorProductId) {
    let imageGenerator = getProductsOperator(this.store).getSwatchImgPath;

    return this.productsServiceAbstractor.getSwatchesAndSizes(colorProductId, imageGenerator)
    .then((colorsSizesAndFitsMap) => {
      this.store.dispatch(getSetItemColorsSizeOptionsAction(itemId, colorsSizesAndFitsMap));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'loadItemSwatchesAndSizes', err);
    });
  }

  setShipToHome (orderItemId) {
    return this.productsServiceAbstractor.setShipToHome(orderItemId).then((r) => {
      this.loadFullCartDetails();
      getStoresOperator(this.store).loadDefaultStore();
    }).catch((err) => {
      throw getSubmissionError(this.store, 'setShipToHome', err);
    });
  }

  resetCartItemEditMode (itemId) {
    return this.store.dispatch(getSetIsEditableActn(itemId, false));
  }

  updateItemDetailsOptionsMap (itemId, colorProductId) {
    let item = cartStoreView.getItem(this.store.getState(), itemId);
    if (!item) throw new Error(`updateItemDetailsOptionsMap: item with id '${itemId}' not found`);

    let colorOptionsMapEntry = getMapSliceForColorProductId(item.miscInfo.detailsOptionsMap, colorProductId);
    if (!colorOptionsMapEntry) throw new Error(`cartOperator.updateItemDetailsOptionsMap: colorFitsSizesMap missing entry for colorProductId='${colorProductId}'`);

    return getProductsOperator(this.store).getUpdatedOptionsInventoryForColor(colorOptionsMapEntry)
    .then((newColorOptionsMap) => {
      this.store.dispatch(getSetItemOptionsForColorAction(itemId, colorProductId, newColorOptionsMap));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'updateItemDetailsOptionsMap', err);
    });
  }

  confirmStartCheckout (callback) {
    let state = this.store.getState();
    let generalOperator = getGeneralOperator(this.store);

    let confirmationsResult = Promise.resolve();
    if (cartStoreView.getIsEditingSomeItem(state)) {
      // editing an item, display warning modal
      confirmationsResult = confirmationsResult.then(() =>
        generalOperator.openConfirmationModal(CONFIRM_MODAL_IDS.EDITING, null, null));
    }
    if (cartStoreView.getOOSCount(state) > 0 || cartStoreView.getUnavailableCount(state) > 0) {
      // order has out-of-stock or unavailable items - confirm with user that they will be removed automatically
      confirmationsResult = confirmationsResult.then(() =>
        generalOperator.openConfirmationModal(CONFIRM_MODAL_IDS.OOS_OR_UNAVAILABLE, null, null));
    }

    return confirmationsResult.then(callback);
  }

  startCheckout () {
    return this.cartServiceAbstractor.getUnqualifiedItems().then((res) => {
      if (res.length) {
        this.store.dispatch(res.map((item) => getSetItemOOSActn(item)));
      }

      return this.confirmStartCheckout(() => {
        let storeState = this.store.getState();

        let removeUnqualifiedPromise = cartStoreView.getUnqualifiedCount(storeState) > 0
        ? this.cartServiceAbstractor.removeItem(cartStoreView.getUnqualifiedItemsIds(storeState)).then(() => { return this.loadFullCartDetails(); })
        : Promise.resolve();

        removeUnqualifiedPromise.then(() => {
          if (userStoreView.isGuest(storeState)) {
            getGlobalSignalsOperator(this.store).openAuthLoginForCheckoutModal();
          } else {
            return this.redirectToCheckout();
          }
        });
      }).catch(() => null /* reject simply means user dismissed confirmation modal, and we need do nothing */);
    });
  }

  startPaypalCheckout () {
    return this.confirmStartCheckout(() => getCheckoutFormOperator(this.store).initPaypalCheckout());
  }

  submitLogin (formData) {
    let {emailAddress, password, rememberMe} = formData;
    let plccCardId = formData.savePlcc && userStoreView.getUserPlccCardId(this.store.getState());

    return this.userServiceAbstractor.login(emailAddress, password, rememberMe, plccCardId).then((res) => {
      this.redirectToCheckout();
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitCheckoutLoginForm', err);
    });
  }

  redirectToCheckout () {
    getRoutingOperator(this.store).gotoPage(PAGES.checkout, null, true);
  }

}

/**
 * @protected
 * @func updateCartInfo
 * @summary You can call this function any time you need to update the cart info.
 */
function updateCartInfo (store, cartInfo, isUpdateCartItems, shouldExportActions) {
  let actions = [
    getSetCurrentOrderIdActn(cartInfo.orderId),
    setEstimatedRewards(cartInfo.estimatedRewards),
    getSetEstimatedAirMilesActn(cartInfo.estimatedAirMiles),
    setShippingTotal(cartInfo.shippingTotal),
    getSetGiftWrappingTotalActn(cartInfo.giftWrappingTotal),
    getSetGiftCardTotalActn(cartInfo.giftCardsTotal),
    setTaxesTotal(cartInfo.totalTax),
    setSavingsTotal(cartInfo.savingsTotal),
    getSetCouponsTotalActn(cartInfo.couponsTotal),
    getSetItemsTotalAction(cartInfo.orderTotalAfterDiscount),
    cartInfo.totalItems !== null && setItemsCount(cartInfo.totalItems),
    getSetSubTotal(cartInfo.subTotal),
    getSetSubTotalWithDiscountsActn(cartInfo.subTotalWithDiscounts),
    getSetGrandTotal(cartInfo.grandTotal),
    getSetGiftCardValuesActn(cartInfo.appliedGiftCards),
    getSetRewardsToBeEarnedActn(cartInfo.rewardsToBeEarned)
  ];

  if (isUpdateCartItems) {
    actions.push(getSetCartActn(cartInfo.orderItems));
  }

  if (cartInfo.uiFlags) {
    actions.push(getSetIsPayPalEnabledActn(cartInfo.uiFlags.isPaypalEnabled));
  }

  if (cartInfo.airmiles) {
    actions.push(getSetAirmilesPromoIdActn(cartInfo.airmiles.promoId));
    actions.push(getSetAirmilesAccountActn(cartInfo.airmiles.accountNumber));
  }

  /* Sometimes this function is used in another function to do bulk dispaches.
   * In this case we can just export all these actions so we can dispatch in one bulk.
  */
  if (shouldExportActions) {
    return actions;
  } else {
    store.dispatch(actions);
  }
}
