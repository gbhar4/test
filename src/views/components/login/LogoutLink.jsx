/** @module LogoutLink
 * @summary Renders a "Logout" CTA, optionally preceded by "not Malcolm?" prefix.
 *
 * @author Agu
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.remembered-logout.scss');
} else {
  require('./_m.remembered-logout.scss');
}

export class LogoutLink extends React.Component {
  static propTypes= {
    /** the text to show for this link, if not specified "Log Out" is used */
    linkText: PropTypes.string,
    /** first name of the user */
    firstName: PropTypes.string,
    /** flags if to show the "not [firstName]?" prefix */
    isShowNamePrefix: PropTypes.bool,

    /** callback for logging the user out */
    onLogoutSubmit: PropTypes.func.isRequired,
    /** optional extra callback for calling after a successfull logout */
    onSuccessfulLogout: PropTypes.func
  }

  constructor (props) {
    super(props);

    this.state = {triggered: false};

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLogoutClick () {
    if (this.state.triggered) return;      // disallow double calls

    this.setState({triggered: true});

    this.props.onLogoutSubmit()
    .then(() => {
      this.props.onSuccessfulLogout();
    }).catch((submissionError) => {
      window.alert(`Problem encountered during logout. The following error occured:\n\n${submissionError.errors._error}\n\nPleased try again later.`);
      this.setState({triggered: false});      // allow retry
    });
  }

  render () {
    let {firstName, linkText, isShowNamePrefix} = this.props;
    let buttonText = linkText || 'Log Out';

    return (
      <div className="remembered-logout">
        {isShowNamePrefix && firstName && <span>Not {firstName}?</span>}
        <button className="button-logout" type="button" onClick={this.handleLogoutClick} disabled={this.state.triggered}>{buttonText}</button>
      </div>
    );
  }
}
