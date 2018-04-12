/** @module MyAccountNavigation
 * @summary Navigation menu of My Account.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @co-author Michael Citro
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {MyAccountNavigationItem} from 'views/components/myAccount/menu/MyAccountNavigationItem.jsx';
import {MY_ACCOUNT_SECTIONS as sections} from 'routing/routes/myAccountRoutes.js';
import {PAGES} from 'routing/routes/pages.js';
// import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.my-account-navigation.scss');
} else {
  require('./_m.my-account-navigation.scss');
}

class MyAccountNavigation extends React.Component {
  static propTypes = {
    /** Whether is mobile. */
    isMobile: PropTypes.bool,

    /** Whether we are on the US site. */
    isUSSite: PropTypes.bool,

    /** Whether contry are US. */
    isUsContry: PropTypes.bool,

    /** This prop is injected when you wrap this component in a route */
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }),

    /** This props desactive o active section reservations */
    isRopisEnabled: PropTypes.bool,

    isRopisEnabledFlag: PropTypes.bool,

    /* Flag to indicates if commnication preferences should render on My Account */
    isCommunicationPreferencesEnabled: PropTypes.bool
  }

  render () {
    let {isMobile, isUSSite, isUsContry, isRopisEnabled, isRopisEnabledFlag, isCommunicationPreferencesEnabled, onClearSuccessMessage} = this.props;
    let unusedSections = [];

    isUSSite ? unusedSections.push(sections.offersAndCoupons) : unusedSections.push(sections.myRewards);
    (!(isRopisEnabledFlag && isRopisEnabled) || !isUsContry) && unusedSections.push(sections.reservations);
    (!(isCommunicationPreferencesEnabled) && unusedSections.push(sections.communicationPreferences));

    return (
      <ul className="my-account-navigation-container">
        {!isMobile &&
          <MyAccountNavigationItem
            isRoot
            isMobile={isMobile}
            menuItem={{...PAGES.myAccount, displayName: 'Account Overview'}} />}

        {Object.keys(sections).map((key, index) => {
          return !unusedSections.find((unused) => unused.id === sections[key].id) && <MyAccountNavigationItem
            isMobile={isMobile}
            key={sections[key].id}
            menuItem={sections[key]}
            onClick={onClearSuccessMessage} />;
        })}
      </ul>
    );
  }
}

export {MyAccountNavigation};
