/**
 * @module Coupon
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Agustin H Andina Silva <asilva@minutentag.com>
 * @updated Florencia Acosta <facosta@minutentag.com>
 * Shows a single coupon in any of it's possible status.
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';

import cssClassName from 'util/viewUtil/cssClassName.js';
import {COUPON_STATUS, COUPON_REDEMPTION_TYPE} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {BASIC_COUPON_PROP_TYPES} from 'views/components/common/propTypes/couponsPropTypes';

class Coupon extends React.Component {
  static propTypes = {
    ...BASIC_COUPON_PROP_TYPES,

    /** Flags if is Mobile */
    isMobile: PropTypes.bool,

    /** Flag to know if 'Apply to Order' button should be shown as 'Apply' */
    isShortApplyTo: PropTypes.bool,

    /** Whether to show the expiration date or not. */
    isShowExpirationDate: PropTypes.bool,

    expirationDate: PropTypes.string.isRequired,
    effectiveDate: PropTypes.string.isRequired,

    alert: PropTypes.shape({
      shortMessage: PropTypes.string.isRequired,
      detailsMessage: PropTypes.string.isRequired,
      detailsOpen: PropTypes.bool
      // ¿cssClass?
    }),
    error: PropTypes.string,

    /** the id of this coupon */
    id: PropTypes.string.isRequired,

    /** indicates the button to apply the coupon is disabled
     * (in case other coupon is being applied)
     */
    isDisabled: PropTypes.bool.isRequired
  }

  static propTypes = {
    ...Coupon.defautPropTypes,
    /** callback to apply a coupon to the current order. Accepts a single parameter that is the coupon id */
    onApply: PropTypes.func.isRequired,
    /** callback to remove a coupon from the current order. Accepts a single parameter that is the coupon id */
    onRemove: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      detailsOpen: !!props.detailsOpen,
      alertOpen: !!(props.alert && props.alert.detailsOpen)
    };

    this.handleToggleAlert = this.handleToggleAlert.bind(this);
    this.handleToggleDetails = this.handleToggleDetails.bind(this);

    this.handleApply = this.handleApply.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleToggleAlert () {
    this.setState({
      detailsOpen: this.state.detailsOpen,
      alertOpen: !this.state.alertOpen
    });
  }

  handleToggleDetails () {
    this.setState({
      detailsOpen: !this.state.detailsOpen,
      alertOpen: this.state.alertOpen
    });
  }

  handleApply (event) {
    this.props.onApply(this.props.id);
  }

  handleRemove (event) {
    this.props.onRemove(this.props.id);
  }

  render () {
    let {status, isDisabled, isExpiring, title, details, imageThumbUrl, expirationDate, alert, isShortApplyTo, error, isApplicable, isShowExpirationDate, redemptionType, effectiveDate} = this.props;
    let {detailsOpen, alertOpen} = this.state;

    let couponCssClass = cssClassName('coupon', {
      ' coupon-ineligible': status === COUPON_STATUS.PENDING || status === COUPON_STATUS.APPLYING || isDisabled
    }, {
      ' applied-coupon-notice': status === COUPON_STATUS.APPLIED
    }, {
      ' expiration-limit': isExpiring === true
    }, {
      ' coupon-place-cash': (redemptionType === COUPON_REDEMPTION_TYPE.PLACECASH)
    });

    let alertMessagePrefix = 'This coupon will be applied when ';
    if (status === COUPON_STATUS.AVAILABLE) {
      alertMessagePrefix = 'This coupon could not be applied because ';
    }

    return (
      <li className={couponCssClass}>
        {error && <ErrorMessage error={error} />}

        {isExpiring && <span className="limited-message">Limited time remaining</span>}
        <div className="coupon-content">
          <div>
            <img className="image-coupon" src={imageThumbUrl} alt="money" />
            <div className="information-coupon">
              <strong className="coupon-value">{title}</strong>
              {isShowExpirationDate &&
                <span className="expire-information">
                    {redemptionType === COUPON_REDEMPTION_TYPE.PLACECASH
                      ? `Valid ${effectiveDate} - ${expirationDate}`
                      : `Expires ${expirationDate}`}
                </span>}
              <button type="button" onClick={this.handleToggleDetails} className="link-to-details" aria-label="Coupon details">details</button>
            </div>

            {status === COUPON_STATUS.PENDING && <button type="button" disabled className="apply-coupons-button">Pending</button>}
            {status === COUPON_STATUS.APPLYING && <button type="button" disabled className="apply-coupons-button">Applying</button>}
            {status === COUPON_STATUS.REMOVING && <button type="button" disabled className="apply-coupons-button">Removing</button>}

            {status === COUPON_STATUS.AVAILABLE && <button type="button" disabled={isDisabled} onClick={!isDisabled ? this.handleApply : null} className="apply-coupons-button" aria-label="Apply coupon to order">Apply {!isShortApplyTo && ' to order'}</button>}
            {status === COUPON_STATUS.APPLIED && <button type="button" disabled={isDisabled} onClick={!isDisabled ? this.handleRemove : null} className="apply-coupons-button" aria-label="Remove coupon">Remove</button>}
          </div>
          {status === COUPON_STATUS.APPLIED && !isApplicable && <p className="coupon-inline-notification">This coupon is no longer applicable</p>}
        </div>

        {alert &&
          <div className="coupon-alert-notification">
            <p className="notification-inline">
              {alertMessagePrefix} {alert.shortMessage}. <button type="button" onClick={this.handleToggleAlert} className="link-coupon-ineligible-more-details">More Details</button>
            </p>
            {alertOpen && <Modal contentLabel="Alert" className="overlay-container" overlayClassName="react-overlay overlay-center overlay-coupon-alert-message" isOpen>
              <ModalHeaderDisplayContainer onCloseClick={this.handleToggleAlert} />
              <div className="overlay-content">
                <p>{alert.detailsMessage}</p>
              </div>
            </Modal>}
          </div>
        }

        {detailsOpen && <Modal contentLabel="Details" className="overlay-container" overlayClassName="react-overlay overlay-center overlay-coupon-detail" isOpen>
          <ModalHeaderDisplayContainer onCloseClick={this.handleToggleDetails} />
          <div className="overlay-content long-description">
            <p>{details}</p>
          </div>
        </Modal>}
      </li>
    );
  }
}

export {Coupon};
