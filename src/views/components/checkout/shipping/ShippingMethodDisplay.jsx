/**
* @module ShippingMethodDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Module to show selected shipping method
*
* Usage:
*  var ShippingMethodDisplay = require("./ShippingMethodDisplay.jsx");
*
* @example
* <code>
*   <ShippingMethodDisplay displayName=[string] />
* </code>
*
* Component Props description/enumeration:
*  @param {string} displayName: the selected shipping method details
*
* Style (ClassName) Elements description/enumeration
*  checkout-review-shipping-method
*/

import React from 'react';
import {PropTypes} from 'prop-types';

class ShippingMethodDisplay extends React.Component {
  static propTypes = {
    /** the selected shipping method details */
    displayName: PropTypes.string.isRequired
  }

  render () {
    let {displayName} = this.props;

    return (
      <section className="checkout-review-shipping-method">
        <div className="shipping-method-container">
          <strong className="shipping-method-title">Shipping Method</strong>

          <p className="shipping-method-name">{displayName}</p>
        </div>
      </section>
    );
  }
}

export {ShippingMethodDisplay};
