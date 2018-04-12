/**
 * @module OrderShipping
 * Shows purchase order shipping address or pick-up store information.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {PickUpStoreSummary} from './PickUpStoreSummary.jsx';

export class OrderShipping extends React.Component {
  static propTypes = {
    shippingAddress: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      addressLine1: PropTypes.string.isRequired,
      addressLine2: PropTypes.string,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    }),
    pickUpStore: PickUpStoreSummary.propTypes.store
  }

  renderPickUpPerson(personInfo) {
    let { firstName, lastName } = personInfo;
    return <h3 className="person-name" itemProp="name">{firstName} {lastName}</h3>
  }

  render () {
    let {shippingAddress, pickUpStore} = this.props;

    return (
      <div className="shipping-section">
        {shippingAddress &&
          <div className="ecom-information">
            <p className="title-description">Shipping</p>
            <ContactInfoDisplay address={shippingAddress} isShowAddress
              isShowCountry={false} isShowPhone={false} isShowEmail={false} />
          </div>}

        {pickUpStore &&
          <div className="pickup-information">
            <p className="title-description">PickUp</p>
            <PickUpStoreSummary store={pickUpStore} />
          </div>}

        {pickUpStore &&
          <div className="pickup-information pickup-alternate">
            <p className="title-description">Pick Up Person(s)</p>
            <div className="pickup-person-container">
              {pickUpStore.pickUpPrimary && this.renderPickUpPerson(pickUpStore.pickUpPrimary)}
              {pickUpStore.pickUpAlternative && this.renderPickUpPerson(pickUpStore.pickUpAlternative)}
            </div>
          </div>}
      </div>
    );
  }
}
