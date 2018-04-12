/**
 * @module BirthdaysSavings
 * Shows the view for birthdays section on Profile information
 *
 * @author Damian <drossi@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ChildrenBirthdaysList} from './ChildrenBirthdaysList.jsx';
import {AddChildBirthdayFormContainer} from './AddChildBirthdayFormContainer';
import {DeleteChildBirthdayConfirmation} from './DeleteChildBirthdayConfirmation.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';
if (DESKTOP) { // eslint-disable-line
  require('views/components/myAccount/profileInformation/birthday/_d.birthday-add-new.scss');
  require('views/components/myAccount/profileInformation/birthday/_d.birthday-savings.scss');
} else {
  require('views/components/myAccount/profileInformation/birthday/_m.birthday-add-new.scss');
  require('views/components/myAccount/profileInformation/birthday/_m.birthday-savings.scss');
}

class BirthdaysSavings extends React.Component {
  static propTypes = {
    childrenBirthdays: ChildrenBirthdaysList.propTypes.childrenBirthdays,
    onDeleteChildBirthday: PropTypes.func.isRequired,
    onClearSuccessMessage: PropTypes.func.isRequired
  }

  state = {
    isAddingChildBirthday: false,
    deletingChildBirthday: null,
    error: null
  }

  constructor (props) {
    super(props);
    this.handleAddChildBirthday = this.handleAddChildBirthday.bind(this);
    this.handleChildBirthdayAdded = this.handleChildBirthdayAdded.bind(this);
    this.handleCancelAddChildBirthday = this.handleCancelAddChildBirthday.bind(this);
    this.handleDeleteChildBirthday = this.handleDeleteChildBirthday.bind(this);
    this.handleCancelDeleteChildBirthday = this.handleCancelDeleteChildBirthday.bind(this);
    this.handleChildBirthdayDeleted = this.handleChildBirthdayDeleted.bind(this);
    this.setError = getSetErrorInStateMethod(this);
  }

  handleAddChildBirthday () {
    this.clearSuccessMessage();
    this.setError();
    this.setState({
      isAddingChildBirthday: true,
      deletingChildBirthday: null
    });
  }

  handleChildBirthdayAdded () {
    this.clearSuccessMessage();
    this.setState({success: 'Your account has been updated.'});
    this.setState({isAddingChildBirthday: false});
  }

  handleCancelAddChildBirthday () {
    this.clearSuccessMessage();
    this.setState({isAddingChildBirthday: false});
  }

  handleDeleteChildBirthday (childBirthday) {
    this.clearSuccessMessage();
    this.setError();
    this.setState({
      deletingChildBirthday: childBirthday,
      isAddingChildBirthday: false
    });
  }

  handleCancelDeleteChildBirthday (childBirthday) {
    this.setState({deletingChildBirthday: null});
  }

  clearSuccessMessage () {
    this.setState({success: null});
  }

  handleChildBirthdayDeleted (childBirthday) {
    this.props.onDeleteChildBirthday(childBirthday).then(() => {
      this.setError();
      this.setState({success: 'Your account has been updated.'});
      this.setState({deletingChildBirthday: null});
    }).catch((err) => {
      this.setError(err);
      this.setState({deletingChildBirthday: null});
    });
  }

  render () {
    let {isMobile, childrenBirthdays} = this.props;
    let {isAddingChildBirthday, deletingChildBirthday} = this.state;

    return (
      <section className="birthday-savings-container">
        {this.state.error && <ErrorMessage error={this.state.error} />}
        {this.state.success && <SuccessMessage message={this.state.success} />}
        <p className="add-birthday-message">Add up to 4 kids´ birthdays to your account and receive special savings during their birthday month!</p>

        <ChildrenBirthdaysList isMobile={isMobile} childrenBirthdays={childrenBirthdays}
          isReadOnly={false} isAddingChild={isAddingChildBirthday}
          deletingChildId={deletingChildBirthday && deletingChildBirthday.id}
          onAddChildBirthday={this.handleAddChildBirthday}
          onDeleteChildBirthday={this.handleDeleteChildBirthday} />

        {isAddingChildBirthday &&
          <AddChildBirthdayFormContainer onAdded={this.handleChildBirthdayAdded}
            onCancel={this.handleCancelAddChildBirthday} />}

        {deletingChildBirthday &&
          <DeleteChildBirthdayConfirmation isMobile={isMobile} childBirthday={deletingChildBirthday}
            onConfirm={this.handleChildBirthdayDeleted} onCancel={this.handleCancelDeleteChildBirthday} />}
      </section>
    );
  }
}

export {BirthdaysSavings};
