/** @module AccountInformationDisplay
 * @summary Information of account.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

class AccountInformationDisplay extends React.Component {
  static propTypes = {
    /* Account id of user */
    idAccount: PropTypes.string.isRequired,

    /* First Name of user */
    firstName: PropTypes.string.isRequired,

    /* Last Name of user */
    lastName: PropTypes.string.isRequired,

    /* Email address of user */
    emailAddress: PropTypes.string.isRequired
  }

  render () {
    let {idAccount, firstName, lastName, emailAddress} = this.props;

    return (
      <div className="account-information">
        <div className="account-information-title">
          My Place Rewards #:
          <br />
          First Name:
          <br />
          Last Name:
          <br />
          Email:
        </div>

        <div className="account-information-content">
          <span>{idAccount}</span>
          <span>{firstName}</span>
          <span>{lastName}</span>
          <strong>{emailAddress}</strong>
        </div>
      </div>
    );
  }
}

export {AccountInformationDisplay};
