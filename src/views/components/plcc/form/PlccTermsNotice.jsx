/** PLCC Application form - static agreement text
 * @author Agu
 */

import React from 'react';
import {CardWithSmile} from 'views/components/plcc/CardWithSmile.jsx';

export class PlccTermsNotice extends React.Component {
  render () {
    return (<div className="plcc-terms-notice-container">
      <CardWithSmile />

      <div className="plcc-terms-notice-content">
        <h3 className="title-first">Complete the Application</h3>
        <p className="message message-terms">Please review the important information and terms about opening a <b>MY PLACE REWARDS CREDIT CARD</b> account prior to submitting your application or accepting a pre-approved offer.</p>
        <span className="title-list-apply">To apply or accept a pre-approved offer you must:</span>

        <ul className="list-apply">
          <li>Be at least 18 years of age </li>
          <li>Have a valid government-issued photo ID</li>
          <li>Have a U.S. Social Security Number</li>
          <li>Be a U.S. resident residing in the United States</li>
          <li>Have a street, rural route or APO/FPO mailing address (no P.O. Boxes)</li>
        </ul>
      </div>
    </div>);
  }
}
