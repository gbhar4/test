/**
 * @author Ben
 */

import {
  COUPON_STATUS,
  COUPON_REDEMPTION_TYPE} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';

export const couponsAndPromosStoreView = {
  getCoupon,
  getCouponsAndPromos,
  getAppliedCouponsAndPromos,
  getAvailableCouponsAndPromos,
  getRecentCouponsAndPromos,
  isPromosLoaded,
  getAvailableLoyaltyCoupons,
  getLoyaltyCoupons,
  hasLoyaltyCoupons,
  getPlaceCashCoupons,
  getPublicCoupons,
  getPlaceCashAndPublicCoupons,
  getAvailableAndStartedCouponsAndPromos
};

function getCouponsAndPromos (state) {
  return state.couponsAndPromos.couponList;
}

function getCoupon (state, id) {
  return state.couponsAndPromos.couponList.find((coupon) => coupon.id === id);
}

function getAppliedCouponsAndPromos (state) {
  return state.couponsAndPromos.couponList.filter((coupon) => coupon.status === COUPON_STATUS.APPLIED || coupon.status === COUPON_STATUS.REMOVING);
}

function getAvailableCouponsAndPromos (state) {
  return state.couponsAndPromos.couponList.filter((coupon) => coupon.status === COUPON_STATUS.AVAILABLE || coupon.status === COUPON_STATUS.APPLYING);
}

function getAvailableAndStartedCouponsAndPromos (state) {
  return getAvailableCouponsAndPromos(state).filter((coupon) => coupon.isStarted);
}

function getRecentCouponsAndPromos (state) {
  let couponsAndPromos = state.couponsAndPromos.couponList.filter((coupon) => coupon.status === COUPON_STATUS.AVAILABLE || coupon.status === COUPON_STATUS.APPLYING || (coupon.status === COUPON_STATUS.APPLIED && !coupon.isApplicable));
  if (couponsAndPromos && couponsAndPromos.length > 3) {
    couponsAndPromos = couponsAndPromos.slice(0, 3);
  }
  return couponsAndPromos;
}

function isPromosLoaded (state) {
  return state.couponsAndPromos.isLoaded;
}

function getAvailableLoyaltyCoupons (state) {
  return getAvailableCouponsAndPromos(state).filter((coupon) => coupon.promotionType === COUPON_REDEMPTION_TYPE.LOYALTY);
}

function hasLoyaltyCoupons (state) {
  return getAvailableLoyaltyCoupons(state).length > 0;
}

function getLoyaltyCoupons (state) {
  return state.couponsAndPromos.couponList.filter((coupon) => coupon.promotionType === COUPON_REDEMPTION_TYPE.LOYALTY);
}

function getPlaceCashCoupons (state) {
  return state.couponsAndPromos.couponList.filter((coupon) => coupon.promotionType === COUPON_REDEMPTION_TYPE.PLACECASH);
}

function getPublicCoupons (state) {
  return state.couponsAndPromos.couponList.filter((coupon) => coupon.promotionType === COUPON_REDEMPTION_TYPE.PUBLIC);
}

function getPlaceCashAndPublicCoupons (state) {
  return getPlaceCashCoupons(state).concat(getPublicCoupons(state));
}
