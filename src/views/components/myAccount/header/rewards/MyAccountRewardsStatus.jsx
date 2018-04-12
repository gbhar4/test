/** @module MyAccountRewardsStatus
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Gabriel Gomez <ggomez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ButtonTooltip} from 'views/components/tooltip/ButtonTooltip.jsx';
import {RewardsStatusContainer} from 'views/components/account/rewardsStatus/RewardsStatusContainer.js';
import RewardsToolTip from 'service/resources/MyAccountRewardsToolTip.html';
import cssClassName from 'util/viewUtil/cssClassName';

class MyAccountRewardsStatus extends React.Component {
  static propTypes = {
    /** flag determines whether we're looking the component on a desktop or mobile device */
    isMobile: PropTypes.bool.isRequired,
    /** User's current points earned */
    currentPoints: PropTypes.number.isRequired,
    /** User's pending rewards to be accrued (those have been earned but are pending clearance on the system) */
    pendingRewards: PropTypes.number.isRequired

    // pointsToNextReward: PropTypes.number.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      openStatusAccordion: !!props.openStatusAccordion
    };
    this.handleOpenAccordion = this.handleOpenAccordion.bind(this);
  }

  handleOpenAccordion (newState) {
    this.setState({
      openStatusAccordion: !this.state.openStatusAccordion
    });
  }

  renderPointsAndRewards () {
    let {currentPoints, isMobile} = this.props;

    return (
      <div className="rewards-summary" key="0">
        {isMobile && <p className="rewards-title">Your Reward Status</p>}
        <span className="total-points">
          CURRENT POINTS: {currentPoints}
        </span>

        <ButtonTooltip type="tooltip" direction="top" className="pending-rewards-tooltip-container">
          <div className="pending-rewards-tooltip" dangerouslySetInnerHTML={{ __html: RewardsToolTip }} />
        </ButtonTooltip>
      </div>
    );
  }

  render () {
    let {isMobile} = this.props;
    let {openStatusAccordion} = this.state;
    let isOpen = isMobile ? openStatusAccordion : true;
    let buttonClassName = cssClassName(
      'button-open-reward-status ',
      { 'expanded ': this.state.openStatusAccordion }
    );

    return (
      <section className="rewards-status-container">
        {isMobile && [
          this.renderPointsAndRewards(),
          <button key="1" className={buttonClassName} aria-label="" onClick={this.handleOpenAccordion}></button>
        ]}
        {isOpen && <RewardsStatusContainer isCondense />}
        {!isMobile && this.renderPointsAndRewards()}
      </section>
    );
  }
}

export {MyAccountRewardsStatus};
