/**
 * @module CanadaRewards
 * Shows the offers and coupons for Canada accounts.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import cssClassName from 'util/viewUtil/cssClassName';
import {OffersAndCouponsContainer} from './OffersAndCouponsContainer';

if (DESKTOP) { // eslint-disable-line
  require('./_d.my-rewards-section.scss');
} else {
  require('./_m.my-rewards-section.scss');
}

class CanadaRewards extends React.Component {
  render () {
    let {className} = this.props;
    let rewardsContainerClass = cssClassName('my-rewards-section ', className);
    return (
      <div className={rewardsContainerClass}>
        <OffersAndCouponsContainer />
      </div>
    );
  }
}

export {CanadaRewards};
