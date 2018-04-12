/**
 * @module BirthdaySavingsDisplay
 * Shows a read-only list of children birthdays registered in the user's account
 * in My Account Profile Information.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {ChildrenBirthdaysList} from './ChildrenBirthdaysList.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

class BirthdaySavingsDisplay extends React.Component {
  static propTypes = {
    childrenBirthdays: ChildrenBirthdaysList.propTypes.childrenBirthdays
  }

  render () {
    let {childrenBirthdays, isMobile} = this.props;

    return (
      <div className="birthday-information-container">
        <div className="profile-information-header">
          <h2 className="profile-information-only-title">Birthday Savings</h2>
        </div>
        <ChildrenBirthdaysList isMobile={isMobile} childrenBirthdays={childrenBirthdays} isReadOnly />

        {childrenBirthdays.length === 0 ? <HyperLink destination={MY_ACCOUNT_SECTIONS.profileInformation.subSections.birthdaySavings}
          className="button-information">Add birthday info</HyperLink>
        : <HyperLink destination={MY_ACCOUNT_SECTIONS.profileInformation.subSections.birthdaySavings}
          className="button-information">Edit birthday info</HyperLink>}
      </div>
    );
  }
}

export {BirthdaySavingsDisplay};
