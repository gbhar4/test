/**
 * @module DesktopDrawerCreateAccount
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 *
 * Create account form to be shown as a desktop drawer, with a
 * ContentSlotContainer below it.
 *
 * Usage:
 *  var DesktopDrawerCreateAccount = require("./DesktopDrawerCreateAccount.jsx");
 *
 *  <DesktopDrawerCreateAccount espotContent=[string] />
 *
 * Component Props description/enumeration:
 *  @param {string} espotContent: content for the eSpot to show below the form.
 *
 * Style (ClassName) Elements description/enumeration
 *  -
 *
 * Uses
 *  <CreateAccount />
 *  <ContentSlot />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CreateAccountFormContainer} from './CreateAccountFormContainer';

export class DesktopDrawerCreateAccount extends React.Component {

  static propTypes = {
    onForgotPasswordClick: PropTypes.func.isRequired
  }

  render () {
    return (
      <div className="create_account_drawer-container">
        <CreateAccountFormContainer onForgotPasswordClick={this.props.onForgotPasswordClick} />
      </div>
    );
  }
}
