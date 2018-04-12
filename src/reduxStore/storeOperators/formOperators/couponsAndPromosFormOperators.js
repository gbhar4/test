/**
 * Operator for promocode/rewards/coupons
 *
 * @author Agu
 * @author Ben
 **/
import {getSubmissionError} from '../operatorHelper';
import {getCartAbstractor} from 'service/cartServiceAbstractor';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {setStatus, setError, COUPON_STATUS} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView';
import {getCartOperator} from '../cartOperator';
import {logErrorAndServerThrow, getErrorMessage} from 'reduxStore/storeOperators/operatorHelper';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

import {getUserOperator} from 'reduxStore/storeOperators/userOperator';

let previous = null;

export function getCouponsAndPromosFormOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new CouponsAndPromosFormOperator(store);
  }
  return previous;
}

class CouponsAndPromosFormOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get cartServiceAbstractor () {
    return getCartAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitCode (formData) {
    let couponCode = formData.couponCode;
    let coupon = couponsAndPromosStoreView.getCoupon(this.store.getState(), couponCode);
    let oldStatus = coupon && coupon.status;

    if (coupon) {
      this.store.dispatch(setStatus(couponCode, COUPON_STATUS.APPLYING));
    }

    return this.cartServiceAbstractor.addCouponOrPromo(couponCode).then((res) => {
      // getAllAvailableCouponsAndPromos might fail, so marking as applied in here,
      // if service fails we have a fallback if it doesn't everything will get refreshed
      this.store.dispatch(setStatus(couponCode, COUPON_STATUS.APPLIED));

      return Promise.all([
        // reload cart as applied coupon may affect the displayed price of some items
        getCartOperator(this.store).loadFullCartDetails(true).catch((err) => { logErrorAndServerThrow(this.store, 'submitCode,loadFullCartDetails', err); }),
        // reload rewards as coupons may affect rewards potential applied order values
        getUserOperator(this.store).setRewardPointsData().catch((err) => { logErrorAndServerThrow(this.store, 'submitCode,setRewardPointsData', err); }),
        // refresh coupons list (to reflect applied vs. available copuons)
        getUserOperator(this.store).getAllAvailableCouponsAndPromos().catch((err) => { logErrorAndServerThrow(this.store, 'submitCode,getAllAvailableCouponsAndPromos', err); })
      ]);
    }).catch((err) => {
      if (coupon) {
        // DT-32410 & DT-32447
        // Backend updates the piId value even if coupon fails
        // Need to get the latest piId to prevent checkout/billing errors after coupon fails to apply
        getCartOperator(this.store).loadFullCartDetails().catch((err) => { logErrorAndServerThrow(this.store, 'submitCode,loadFullCartDetails', err); });

        // coupon existed, there was an error applying the code, rollback the state
        this.store.dispatch([
          setStatus(couponCode, oldStatus),
          setError(couponCode, getErrorMessage(err.errorMessages))
        ]);

        // The error will stop showing at 5 seconds according to the solution found for the ticket DT-18266.
        setTimeout(function () {
          this.store.dispatch(setError(couponCode, null));
        }.bind(this), 5000);
      }
      throw getSubmissionError(this.store, 'submitPromoCode', err);
    });
  }

  submitRemoveCode (formData) {
    let {couponCode} = formData;
    let coupon = couponsAndPromosStoreView.getCoupon(this.store.getState(), couponCode);
    let oldStatus = coupon && coupon.status;

    if (coupon) {
      this.store.dispatch(setStatus(couponCode, COUPON_STATUS.REMOVING));
    }

    return this.cartServiceAbstractor.removeCouponOrPromo(couponCode).then((res) => {
      // getAllAvailableCouponsAndPromos might fail, so marking as applied in here,
      // if service fails we have a fallback if it doesn't everything will get refreshed
      this.store.dispatch(setStatus(couponCode, COUPON_STATUS.AVAILABLE));

      return Promise.all([
        getCartOperator(this.store).loadFullCartDetails(true).catch((err) => { logErrorAndServerThrow(this.store, 'removeCouponOrPromo,loadFullCartDetails', err); }),
        // coupon didn't exist, user manually adding one, need to refresh applied listPrice
        getUserOperator(this.store).getAllAvailableCouponsAndPromos().catch((err) => { logErrorAndServerThrow(this.store, 'removeCouponOrPromo,getAllAvailableCouponsAndPromos', err); }),
        // reload rewards as coupons may affect rewards potential applied order values
        getUserOperator(this.store).setRewardPointsData().catch((err) => { logErrorAndServerThrow(this.store, 'removeCouponOrPromo,setRewardPointsData', err); })

      ]);
    }).catch((err) => {
      if (coupon) {
        this.store.dispatch([
          setStatus(couponCode, oldStatus),
          setError(couponCode, getErrorMessage(err.errorMessages))
        ]);

        // The error will stop showing at 5 seconds according to the solution found for the ticket DT-18266.
        setTimeout(function () {
          this.store.dispatch(setError(couponCode, null));
        }, 5000);
      }

      throw getSubmissionError(this.store, 'removeCouponOrPromo', err);
    });
  }
}
