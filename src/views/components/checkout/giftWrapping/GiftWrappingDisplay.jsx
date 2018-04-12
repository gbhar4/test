/**
* @module GiftWrappingDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Module to show shipping wrapping details
*
* Usage:
*  var GiftWrappingDisplay = require("./GiftWrappingDisplay.jsx");
*
* @example
* <code>
*   <GiftWrappingDisplay displayName=[string] />
* </code>
*
* Component Props description/enumeration:
*  @param {string} displayName: the additional pickup person details
*
* Style (ClassName) Elements description/enumeration
*  checkout-review-shipping-address
*/

import React from 'react';
import {PropTypes} from 'prop-types';

class GiftWrappingDisplay extends React.Component {
  static propTypes = {
    /** the gift wrapping details */
    displayName: PropTypes.string.isRequired
  }

  render () {
    let {displayName} = this.props;

    return (
      <section className="checkout-review-gift-wrapping">
        <div className="gift-wrapping-container">
          <strong className="gift-wrapping-title">Gift Services</strong>

          <p className="gift-wrapping-name">{displayName}</p>
        </div>
      </section>
    );
  }
}

export {GiftWrappingDisplay};
