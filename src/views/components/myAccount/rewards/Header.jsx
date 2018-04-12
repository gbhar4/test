/**
 * @module Header
 * Shows the title and tabs of the rewards section in My Account.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Route} from 'views/components/common/routing/Route.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {BreadCrumbs} from 'views/components/common/routing/BreadCrumbs.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./menu/_d.my-rewards-navigation.scss');
} else {
  require('./menu/_m.my-rewards-navigation.scss');
}

class Header extends React.Component {
  static propTypes = {
    /** number of current offers and coupons */
    offersAndCouponsNumber: PropTypes.number.isRequired,
    /** flags if we are in Canada site */
    isCanada: PropTypes.bool.isRequired
  }

  render () {
    let {offersAndCouponsNumber, isCanada} = this.props;
    let {myRewards: {subSections}} = MY_ACCOUNT_SECTIONS;

    return (
      <div className="my-rewards-header">
        <Route component={BreadCrumbs} componentProps={{sections: MY_ACCOUNT_SECTIONS}} />

        {!isCanada &&
          <ul className="my-rewards-navigation-container">
            <li className="my-rewards-navigation-item">
              <HyperLink
                className="rewards-navigation-item-link"
                activeClassName="rewards-navigation-item-link-selected"
                useActiveClassNameOnlyForRoot
                destination={subSections.rewards}>Rewards</HyperLink>
            </li>

            <li className="my-rewards-navigation-item">
              <HyperLink
                className="rewards-navigation-item-link"
                activeClassName="rewards-navigation-item-link-selected"
                destination={subSections.pointsHistory}>Points History</HyperLink>
            </li>

            <li className="my-rewards-navigation-item">
              <HyperLink
                className="rewards-navigation-item-link"
                activeClassName="rewards-navigation-item-link-selected"
                destination={subSections.offersAndCoupons}>Offers &amp; Coupons ({offersAndCouponsNumber})</HyperLink>
            </li>
          </ul>
        }
      </div>
    );
  }
}

export {Header};
