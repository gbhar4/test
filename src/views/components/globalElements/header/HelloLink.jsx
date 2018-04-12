/** @module HelloLink
 * A presentational component rendering a link greeting the the user by it's
 * name and show his number of points and rewards money.
 *
 * @author Ben
 * @author Florencia Acosta <facosta@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line no-undef
  require('./_d.login.scss');
}

export class HelloLink extends React.Component {

  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    /** User's first name. */
    firstName: PropTypes.string.isRequired,
    /** Number of MPR point currently accumulated by the user. */
    points: PropTypes.number,
    /** Amount of money accumulated by the user in rewards. */
    rewardsMoney: PropTypes.number.isRequired,

    /** the id associated with this link */
    id: PropTypes.string.isRequired,
    /** Flags if this link is currently active */
    isActive: PropTypes.bool,
    /** a callback for clicks on this link */
    onClick: PropTypes.func.isRequired,

    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.getRewardsDetails = this.getRewardsDetails.bind(this);
  }

  handleOnClick (event) {
    this.props.onClick(event, this.props.id);
  }

  getRewardsDetails () {
    /* NOTE: DT-18800 - changed to show points even for 0 values, we are to always show points unless it is disabled */
    return this.props.isRewardsEnabled
      ? '(' + this.props.points + ' points, $' + this.props.rewardsMoney + ' in Rewards)'
      : '';
  }

  render () {
    let {isActive, firstName} = this.props;
    let classNameContainer = cssClassName(
      'welcome-message ',
      {
        'center-name ': !this.getRewardsDetails(),
        'active ': isActive
      });

    let content = [
      <strong key="first-name" className="welcome-name">Hi, {firstName} </strong>,
      <span key="rewards-number" className="reward-details-container">{this.getRewardsDetails()}</span>
    ];
    let ariaText = 'My Account. ' + (isActive ? 'Toggle' : 'Opens') + ' a dialog.';

    return (
        <button className={classNameContainer} onClick={this.handleOnClick} aria-label={ariaText}>
          {content}
        </button>
    );
  }
}
