/** PLCC landing - rewards benefits info block
 * @author Agu
 */

import React from 'react';

export class RewardsBenefitsSummary extends React.Component {
  render () {
    return (
      <div className="rewards-benefits-summary">
        <div className="item-benefits-container">
          <figure className="content-img">
            <img src="/wcsstore/static/images/welcome-offer.png" alt="img offer" className="img-offer" />
          </figure>
          <p>
            <strong className="rewards-benefits-title">30% OFF</strong>
            your first credit card purchase<sup>§</sup>
          </p>
        </div>
        <div className="item-benefits-container">
          <figure className="content-img" >
            <img src="/wcsstore/static/images/cake.png" alt="img cake" className="img-cake" />
          </figure>
          <p>
            <strong className="rewards-benefits-title">25% OFF</strong>
           for your kid's birthdays!<sup>**</sup>
          </p>
        </div>
        <div className="item-benefits-container">
          <figure className="content-img" >
            <img src="/wcsstore/static/images/plcc-small.png" alt="img card plcc" className="img-card" />
          </figure>
          <p>
            <strong className="rewards-benefits-title">20% OFF</strong>
            when you get your card<sup>§</sup>
          </p>
        </div>
        <div className="item-benefits-container item-last">
          <figure className="content-img" >
            <img src="/wcsstore/static/images/box.png" alt="img box with dog" className="img-box" />
          </figure>
          <p>
            <strong className="rewards-benefits-title">FREE STANDARD SHIPPING</strong>
            every day<sup>†</sup>
          </p>
        </div>
      </div>
    );
  }
}
