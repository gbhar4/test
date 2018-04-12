/**
 * @module GuestRewardsPromo
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Shows a promotional area for rewards programs to guest users.
 */
import React from 'react';
import {PropTypes} from 'prop-types';

require('./_d.guest-rewards-promo.scss');

class GuestRewardsPromo extends React.Component {
  static propTypes = {
    /** Flags if to use condensed version for mini-bag use. */
    isCondense: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    /**
     * The points that could be earned
     * if the user was registered.
     */
    pointsInYourBag: PropTypes.number.isRequired,

    globalSignalsOperator: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);

    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  handleRegisterClick (event) {
    this.props.globalSignalsOperator.openAuthRegistrationModal(false);
  }

  handleLoginClick (event) {
    this.props.globalSignalsOperator.openAuthLoginModal();
  }

  render () {
    let {isRemembered, isCondense, pointsInYourBag} = this.props;

    return (
      <div className="guest-rewards-promo-container summary-message">
        <div className="guest-rewards-promo">
          <h3 className="summary-message-title">
            You can earn <span>{pointsInYourBag}</span> points on this purchase!
          </h3>

          <img className="figure-stars-espot" src="/wcsstore/static/images/spot-stars-drawer-guest.png" />

          <h4 className="points-and-rewards-information">100 points = $5 reward</h4>

          {isCondense && !isRemembered && <button type="button" onClick={this.handleRegisterClick} className="button-register-condense">Create My Place Rewards Account</button>}
          {isCondense && <button type="button" onClick={this.handleLoginClick} className="button-login-condense">Log in</button>}

          {!isCondense &&
            <span className="guest-rewards-button-container">
              {!isRemembered && <button type="button" onClick={this.handleRegisterClick} className="button-register button-register-uncondense">
                CREATE MY PLACE REWARDS ACCOUNT
              </button>}

              <button type="button" onClick={this.handleLoginClick} className="button-login button-login-uncondense">
                LOG IN
              </button>
            </span>
          }
        </div>
      </div>
    );
  }
}

export {GuestRewardsPromo};
