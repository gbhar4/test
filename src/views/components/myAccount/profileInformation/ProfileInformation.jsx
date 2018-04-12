/**
 * @module ProfileInformation
 * Shows the different views for the user to manage it's profile information in
 * My Account. Supports both read-only and form views of Personal Information
 * and Password, and read-only views of Default Store and Children Birthday
 * Savings.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {PersonalInformationDisplay} from './PersonalInformationDisplay.jsx';
import {PersonalInformationFormContainer} from './PersonalInformationFormContainer';
import {ChangePasswordFormContainer} from './ChangePasswordFormContainer';
import {DefaultStore} from 'views/components/myAccount/overview/DefaultStore.jsx';
import {BirthdaySavingsDisplay} from './BirthdaySavingsDisplay.jsx';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

const EDITING_SECTIONS = {
  PERSONAL_INFO: 'personal-info',
  PASSWORD: 'password'
};

if (DESKTOP) { // eslint-disable-line
  require('./_d.change-password.scss');
  require('./_d.personal-information.scss');
  require('./_d.favorite-store.scss');
} else {
  require('./_m.change-password.scss');
  require('./_m.personal-information.scss');
  require('./_m.favorite-store.scss');
}

class ProfileInformation extends React.Component {
  static propTypes = {
    personalInformation: PersonalInformationDisplay.propTypes.personalInformation,
    airMilesAccount: PersonalInformationDisplay.propTypes.airMilesAccount,
    defaultStore: DefaultStore.propTypes.store,
    childrenBirthdays: BirthdaySavingsDisplay.propTypes.childrenBirthdays,
    isCanada: PropTypes.bool.isRequired,

    /** Flags if we're rendering for mobile */
    isMobile: PropTypes.bool
  }

  state = {
    successMessage: null
  }

  constructor (props) {
    super(props);
    this.state = {editingSection: null};
    this.handleEditPersonalInfo = this.handleEditPersonalInfo.bind(this);
    this.handleCancelPersonalInfoEdit = this.handleCancelPersonalInfoEdit.bind(this);
    this.handlePersonalInfoUpdated = this.handlePersonalInfoUpdated.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleCancelPasswordChange = this.handleCancelPasswordChange.bind(this);
    this.handlePasswordUpdated = this.handlePasswordUpdated.bind(this);
  }

  handleEditPersonalInfo () {
    this.setState({
      editingSection: EDITING_SECTIONS.PERSONAL_INFO,
      successMessage: null
    });
  }

  handleCancelPersonalInfoEdit () {
    this.setState({editingSection: null});
  }

  handlePersonalInfoUpdated () {
    this.setState({
      editingSection: null,
      successMessage: 'Your account has been updated.'
    });
  }

  handleChangePassword () {
    this.setState({
      editingSection: EDITING_SECTIONS.PASSWORD,
      successMessage: null
    });
  }

  handleCancelPasswordChange () {
    this.setState({editingSection: null});
  }

  handlePasswordUpdated () {
    this.setState({
      editingSection: null,
      successMessage: 'Your account has been updated.'
    });
  }

  render () {
    let {personalInformation,
      rewardsAccountNumber,
      airMilesAccount,
      defaultStore,
      childrenBirthdays,
      isCanada, isMobile} = this.props;
    let {editingSection, successMessage} = this.state;
    let passwordContainerclassName = cssClassName('change-password-container ', {'no-favorite-store-showed ': isCanada});

    return (
      <section className="personal-information-container">
        {successMessage && <SuccessMessage message={successMessage} />}
        {editingSection === EDITING_SECTIONS.PERSONAL_INFO
          ? <PersonalInformationFormContainer isCanada={isCanada}
            onCancel={this.handleCancelPersonalInfoEdit} onUpdated={this.handlePersonalInfoUpdated} />
          : <PersonalInformationDisplay {...{personalInformation, airMilesAccount, isCanada, rewardsAccountNumber}}
            onEdit={this.handleEditPersonalInfo} />
        }
        <div className={passwordContainerclassName}>
          {editingSection === EDITING_SECTIONS.PASSWORD
            ? <ChangePasswordFormContainer onCancel={this.handleCancelPasswordChange} onUpdated={this.handlePasswordUpdated} />
            : <div className="profile-information-header">
              <h2 className="profile-information-only-title">Password</h2>
              <button className="button-information" onClick={this.handleChangePassword}>Change password</button>
            </div>
          }
        </div>

        {!isCanada && <DefaultStore store={defaultStore} isMobile={isMobile} />}
        <BirthdaySavingsDisplay isMobile={isMobile} childrenBirthdays={childrenBirthdays} />
      </section>
    );
  }
}

export {ProfileInformation};
