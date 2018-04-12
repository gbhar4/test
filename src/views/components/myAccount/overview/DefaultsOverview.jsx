/**
 * @module DefaultsOverview
 * Shows the defaults selected by the user for payment method, shipping address
 * and store.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {DefaultPaymentMethod} from './DefaultPaymentMethod.jsx';
import {DefaultShippingAddress} from './DefaultShippingAddress.jsx';
import {DefaultStore} from './DefaultStore.jsx';
import {STORE_SUMMARY_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/storesPropTypes';

class DefaultsOverview extends React.Component {
  static propTypes = {
    /** Default payment method selected by the user */
    defaultPaymentMethod: DefaultPaymentMethod.propTypes.card,
    defaultShippingAddress: PropTypes.shape({
      addressId: PropTypes.string,
      address: DefaultShippingAddress.propTypes.address.isRequired,
      phoneNumber: DefaultShippingAddress.propTypes.phoneNumber.isRequired
    }),
    defaultStore: STORE_SUMMARY_PROP_TYPES_SHAPE,

    /** Flags if we're rendering for mobile */
    isMobile: PropTypes.bool,
    /** Flags if we're in canada session */
    isCanada: PropTypes.bool
  }

  render () {
    let {defaultPaymentMethod, defaultShippingAddress, defaultStore, isMobile, isCanada} = this.props;

    return (
      <div className="default-information-summary">
        <DefaultPaymentMethod card={defaultPaymentMethod} />
        <DefaultShippingAddress {...defaultShippingAddress} />
        {!isCanada && <DefaultStore store={defaultStore} isMobile={isMobile} />}
      </div>
    );
  }
}

export {DefaultsOverview};
