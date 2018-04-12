/** @module LoginLink
 * A presentational component rendering a link for opening the login drawer
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line no-undef
  require('./_d.login.scss');
}

export class LoginLink extends React.Component {

  static propTypes = {
    /** the id associated with this link */
    id: PropTypes.string.isRequired,
    /** Flags if this link is currently active */
    isActive: PropTypes.bool,
    /** a callback for clicks on this link */
    onClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick (event) {
    this.props.onClick(event, this.props.id);
  }

  render () {
    let {isActive} = this.props;
    let ariaText = 'Login. ' + (isActive ? 'Toggle' : 'Opens') + ' a dialog.';

    return (
      <div className="access-acount login-link-container">
        <button className={cssClassName('login-link', {' active': isActive})}
          onClick={this.handleOnClick} aria-label={ariaText}>Log In</button>
      </div>
    );
  }

}
