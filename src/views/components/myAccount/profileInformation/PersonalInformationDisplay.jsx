/**
 * @module PersonalInformationDisplay
 * Shows the personal information of the user and the edit button on My Account
 * Profile Information.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.profile-information-title.scss');
} else {
  require('./_m.profile-information-title.scss');
}

class PersonalInformationDisplay extends React.Component {
  static propTypes = {
    personalInformation: PropTypes.shape({
      lastName: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      emailAddress: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string
    }),
    rewardsAccountNumber: PropTypes.string,
    airMilesAccount: PropTypes.string,
    isCanada: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired
  }

  render () {
    let {personalInformation: {
      firstName, lastName, emailAddress, phoneNumber
    }, rewardsAccountNumber, airMilesAccount, isCanada, onEdit} = this.props;

    let address = {firstName, lastName};

    return (
      <div className="profile-information-container contact-info-display-container">
        <div className="my-account-title-section profile-information-header">
          <h2 className="profile-information-title">Personal Information</h2>
          <button type="button" className="button-action button-edit"
            onClick={onEdit}>Edit</button>
        </div>
        <ContactInfoDisplay {...{address, emailAddress, phoneNumber}} isShowPhone isShowEmail />
        {(isCanada && airMilesAccount)
          ? <p className="air-miles-message">AIR MILES Card: <span>{airMilesAccount}</span></p>
          : rewardsAccountNumber && <p className="rewards-message">MY PLACE REWARDS #: <span>{rewardsAccountNumber}</span></p>
        }
      </div>
    );
  }
}

export {PersonalInformationDisplay};
