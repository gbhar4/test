/**
 * @module PlaceCashSpotsi
 * @author Florencia Acosta <facosta@minutentag.com>
 * Shows a spot in relation to Place Cash. It will be displayed in a certain period of time, when the user has money in his Place Cash account.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.place-cash-spot.scss');
} else {  // eslint-disable-line
  require('./_m.place-cash-spot.scss');
}

export class PlaceCashSpot extends React.Component {
  static propTypes = {
    /** session currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    /** Specific class name to container of component. */
    className: PropTypes.string,

    /** Flag to know if the spot should be shown */
    isEnabled: PropTypes.bool.isRequired,

    /** Money that the user will earn with the current purchase. */
    value: PropTypes.number,

    /* Flag to know if is Confirmation section from checkout */
    isConfirmation: PropTypes.bool,

    /* We are available to know if is an international shipping */
    isInternationalShipping: PropTypes.bool
  }

  message () {
    let {value, isConfirmation, currencySymbol} = this.props;
    let className = 'place-cash-message';
    let message = '';

    if (isConfirmation) {
      message = <div className={className}>Yay! You earned <strong>{currencySymbol}{value}</strong> in PLACE cash. <br /> PLACE cash will be emailed within 48-72 hours.</div>;
    } else {
      message = <div className={className}>You'll earn <strong>{currencySymbol}{value}</strong> in PLACE cash on this purchase!</div>;
    }

    return message;
  }

  render () {
    let {className, isEnabled, isInternationalShipping} = this.props;
    let containerClass = cssClassName('place-cash-spot-container ', className);
    let message = this.message();

    if (!isEnabled || isInternationalShipping) { return null; }

    return (
      <div className={containerClass}>
        <img src="/wcsstore/static/images/place-cash-spot.png" alt="Place Cash Icon" />
        {message}
      </div>
    );
  }
}
