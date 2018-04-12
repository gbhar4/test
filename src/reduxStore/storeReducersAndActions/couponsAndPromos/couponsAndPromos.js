/**
 * @author Agu ?
 * @author Ben
 * @author Noam
 */
import Immutable from 'seamless-immutable';

let defaultPromotionsStore = Immutable({
  couponList: [],
  isLoaded: false
});

export const COUPON_STATUS = {
  AVAILABLE: 'available',
  EXPIRING_SOON: 'expiration-limit',
  APPLYING: 'applying',
  APPLIED: 'applied',
  PENDING: 'pending',
  REMOVING: 'removing'
};

export const COUPON_REDEMPTION_TYPE = {
  PUBLIC: 'public',
  WALLET: 'wallet',
  LOYALTY: 'LOYALTY',
  PLACECASH: 'PLACECASH'
};

export function couponsAndPromosReducer (promotions = defaultPromotionsStore, action) {
  switch (action.type) {
    case 'COUPONSANDPROMOS_LOAD_PROMOS':
      return promotions.set('couponList', action.sitePromos);
    case 'COUPONSANDPROMOS_SET_STATUS':
      return promotions.set('couponList', promotions.couponList.map((promo) => promo.id === action.promoCode ? {...promo, status: action.status} : promo));
    case 'COUPONSANDPROMOS_SET_ERROR':
      return promotions.set('couponList', promotions.couponList.map((promo) => promo.id === action.promoCode ? {...promo, error: action.error} : promo));
    case 'COUPONSANDPROMOS_REMOVE':
      return promotions.set('couponList', promotions.couponList.filter((promo) => promo.id !== action.promoCode));
    case 'COUPONSANDPROMOS_SET_IS_LOADED':
      return promotions.set('isLoaded', action.isLoaded);
    default:
      return promotions;
  }
}

export * from './actionCreators';
