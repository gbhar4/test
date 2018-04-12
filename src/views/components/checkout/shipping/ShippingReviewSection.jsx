/**
* @module ShippingReviewSection
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Section to display pick up on review section of checkout, for normal checkout and express (form)
*
* Component Props description/enumeration:
*  @param {bool} enablePickUpContactForm: indicates the section needs to display the form to enter additional pick up person vs just showing the information
*
* Style (ClassName) Elements description/enumeration
*  checkout-review-section
*  checkout-review-pickup
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {TitlePlusEditButton} from '../TitlePlusEditButton.jsx';
import {ShippingAddressDisplay} from './ShippingAddressDisplay.jsx';
import {ShippingMethodFormSectionContainer} from './ShippingMethodFormSectionContainer.js';
import {ShippingMethodDisplay} from './ShippingMethodDisplay.jsx';
import {GiftWrappingFormSectionContainer} from 'views/components/checkout/giftWrapping/GiftWrappingFormSectionContainer.js';
import {GiftWrappingDisplay} from 'views/components/checkout/giftWrapping/GiftWrappingDisplay.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.shipping-review-section.scss');
} else { // eslint-disable-line
  require('./_m.shipping-review-section.scss');
}

export class ShippingReviewSection extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    enableShippingMethodForm: PropTypes.bool.isRequired,
    enableGiftWrappingForm: PropTypes.bool,
    isGiftOptionsEnabled: PropTypes.bool.isRequired,
    shippingAddress: PropTypes.shape({
      ...ShippingAddressDisplay.propTypes
    }),

    shippingMethod: PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      shippingSpeed: PropTypes.string.isRequired,
      isDefault: PropTypes.bool
    }).isRequired,

    giftWrappingDisplayName: GiftWrappingDisplay.propTypes.displayName,

    /** a callback to change values in the form */
    change: PropTypes.func.isRequired
  }

  static defaultValidation = {
    methiod: ShippingMethodFormSectionContainer.defaultValidation,
    giftWrap: GiftWrappingFormSectionContainer.defaultValidation
  };

  render () {
    let {isMobile, enableShippingMethodForm, enableGiftWrappingForm, isGiftOptionsEnabled,
      shippingAddress, shippingMethod, shippingMethodsMap, giftWrappingDisplayName, change} = this.props;

    return (
      <div className="checkout-review-section checkout-review-shipping">
        <TitlePlusEditButton title="Shipping" onEdit={this.props.onEdit} />

        <ShippingAddressDisplay {...shippingAddress} />

        {enableShippingMethodForm
          ? <ShippingMethodFormSectionContainer name="method" isMobile={isMobile} change={change}
            optionsMap={shippingMethodsMap} />
          : <ShippingMethodDisplay displayName={shippingMethod.displayName} />
        }

        {enableGiftWrappingForm && isGiftOptionsEnabled
          ? <GiftWrappingFormSectionContainer />
          : isGiftOptionsEnabled && <GiftWrappingDisplay displayName={giftWrappingDisplayName} change={change} />
        }
      </div>
    );
  }
}
