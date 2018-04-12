/**
 * @module FooterQuestions
 * Shows the questions and answers at the footer of the rewards section in
 * My Account.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {PAGES} from 'routing/routes/pages';

if (DESKTOP) { // eslint-disable-line
  require('./_d.legal-information-from-rewards.scss');
} else {
  require('./_m.legal-information-from-rewards.scss');
}

export class FooterQuestions extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {isExpanded: false};
    this.handleToggleInfo = this.handleToggleInfo.bind(this);
  }

  handleToggleInfo () {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded
    }));
  }

  render () {
    let {isMobile, isExpanded} = this.state;

    return (
      <div className="accordion rewards-information-container">
        <h4 onClick={!isMobile && this.handleToggleInfo} className="rewards-information-title">
          WHEN WILL I SEE MY POINTS?
        </h4>

        {(isExpanded || !isMobile) &&
          <div className="accordion-expanded rewards-text-container">
            <p className="rewards-information-text">
              <strong className="rewards-information-text-title">IN STORE</strong>
              While shopping in store and using your My Place Rewards information,
              points will appear in your account approximately 24-48 hours after
              the time of purchase.
            </p>

            <p className="rewards-information-text">
              <strong className="rewards-information-text-title">ONLINE</strong>
              While shopping online and logged in during time of checkout,
              points will appear in your account approximately 24-48 hours after
              receiving your shipping confirmation email.
            </p>

            <p className="rewards-information-text">
              If you haven't received your points within 48 hours after shopping
              in stores or receiving a shipping confirmation email,
              please <HyperLink destination={MY_ACCOUNT_SECTIONS.myRewards.subSections.pointsClaim}
                className="button-submit-point-claim">submit a Points Claim Form
              </HyperLink>.
            </p>

            <div className="rewards-information-text">
              <strong className="rewards-information-text-title">Other questions?</strong>

              <ul className="rewards-questions-list">
                <li>If you still are having trouble finding points, you may have multiple accounts. Please contact
                  <HyperLink destination={PAGES.helpCenter} pathSuffix="contact-us" className="button-merge-account-request"> Customer Service</HyperLink>.
                </li>

                <li>Please note: The purchase of gift cards do not qualify for My Place Rewards.</li>
              </ul>
            </div>
          </div>
        }
      </div>
    );
  }
}
