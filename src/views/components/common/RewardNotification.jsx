/**
Component description: Reward Notification
@Author Florencia Acosta
*/

import React from 'react';
import cssClassName from 'util/viewUtil/cssClassName';
import {Notification} from './Notification.jsx';
import {Modal} from 'views/components/modal/Modal.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.notifications.scss');
} else {
  require('./_m.notifications.scss');
}

export class RewardNotification extends React.Component {
  render () {
    let {message, reasonNotification, metaRewardNotification, meta, showModalDetails} = this.props;
    // "showModalDetails" is fpo until the integration and only is used for show one state for now.
    message = message + ' ' + reasonNotification;

    let {error, warning} = meta;
    let classNameRewardNotification = cssClassName('reward-notification-', {'error-message': error, 'warning-message': warning});

    return (
      <Notification className={'container-reward-notification ' + classNameRewardNotification} type="inline" meta={metaRewardNotification}>
        <p className="notification-inline">{message} <button className="link-coupon-ineligible-more-details">More Details</button></p>

        {/* "showModalDetails" is fpo until the integration and only is used for show one state for now. */}
        {showModalDetails && <Modal className="reward-more-details" isOpen>
          <p className="reward-more-details-message">Valid for a limited time online only. Free shipping will automatically be applied to all orders; no web code needed. Offer is good for free standard shipping or priority shipping if shipping to a street address or a P.O. Box address in the contiguous U.S. or a PO Box (but not a street address) in the following areas: U.S. Territories, Military addresses/APOs, AK, HI, PR and some rural areas. Not valid on any express or rush shipping service. Not valid on international orders or on previously purchased merchandise. Offer may be canceled or modified at any time.</p>
        </Modal>}
      </Notification>
    );
  }
}
