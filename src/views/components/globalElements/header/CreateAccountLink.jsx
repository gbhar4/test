/** @module CreateAccountLink
 * A presentational component rendering a link for opening the create-account drawer
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line no-undef
  require('./_d.login.scss');
}

export class CreateAccountLink extends React.Component {

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
    let ariaText = 'Create Account. ' + (isActive ? 'Toggle' : 'Opens') + ' a dialog.';

    return (
      <div className="access-acount create-account-container">
        <button className={cssClassName('create-account-link', {' active': isActive})}
          onClick={this.handleOnClick} aria-label={ariaText}>Create Account</button>
      </div>
    );
  }

}
