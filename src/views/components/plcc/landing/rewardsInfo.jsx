/** PLCC landing - rewards info block
 * @author Agu
 */

import React from 'react';

export class RewardsInfo extends React.Component {
  render () {
    return (<div className="info-rewards">
      <div className="info-content">
        <div className="numbers">
          <span className="number"><i>$</i>1</span>
          <span className="number">=</span>
          <span className="number">2</span>
        </div>
        <div className="words">
          <span className="word">spent</span>
          <span className="word">points</span>
        </div>
      </div>
      <div className="info-content">
        <div className="numbers">
          <span className="number">100</span>
          <span className="number">=</span>
          <span className="number"><i>$</i>5</span>
        </div>
        <div className="words">
          <span className="word">points</span>
          <span className="word">reward*</span>
        </div>
      </div>
    </div>);
  }
}
