/** @module couponsPropTypes
 * @summary basic propTypes used for coupons
 *
 * @author Ben
 * FIXME: document each prop
 */
import {PropTypes} from 'prop-types';
import {COUPON_STATUS} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';

export const BASIC_COUPON_PROP_TYPES = {
  /** the id of this coupon */
  id: PropTypes.string.isRequired,
  status: PropTypes.oneOf([COUPON_STATUS.AVAILABLE, COUPON_STATUS.APPLYING, COUPON_STATUS.APPLIED, COUPON_STATUS.PENDING, COUPON_STATUS.EXPIRING_SOON]).isRequired,
  title: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  detailsOpen: PropTypes.bool,
  alert: PropTypes.shape({
    shortMessage: PropTypes.string.isRequired,
    detailsMessage: PropTypes.string.isRequired,
    detailsOpen: PropTypes.bool
    // ¿cssClass?
  }),
  error: PropTypes.string,
  expirationDate: PropTypes.string.isRequired,
  imageThumbUrl: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  /** This flag is used to see if an applied coupon is still applicable, is not then we display an inline alert */
  isApplicable: PropTypes.bool
};
