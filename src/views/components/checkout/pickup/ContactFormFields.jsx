/** @module ContactFormFields
 * A form part rendering contact informtion fields
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-pickup-form.scss');
} else {  // eslint-disable-line
  require('./_m.checkout-pickup-form.scss');
}

export class ContactFormFields extends React.Component {

  static propTypes = {
    /** an optional css class to use for the containing div */
    className: PropTypes.string,
    /** Flags if an emailAddress field should be shown */
    showEmailAddress: PropTypes.bool,
    /** Flags if a phoneNumber field should be shown */
    showPhoneNumber: PropTypes.bool
  }

  render () {
    let {isCondensed, showEmailAddress, showPhoneNumber, className} = this.props;
    let firstNameClass = cssClassName(!isCondensed ? 'input-and-message-container' : 'first-name-container');
    let lastNameClass = cssClassName(!isCondensed ? 'input-and-message-container last-name-and-message' : 'last-name-container');

    return (
      <div className={className}>
        <div className={firstNameClass}>
          <Field name="firstName" component={LabeledInput} title="First Name" type="text" className="first-name" />
          {!isCondensed && <aside className="checkout-review-pickup-note">A government issued ID is required to pick up the order.</aside>}
        </div>

        <div className={lastNameClass}>
          <Field name="lastName" component={LabeledInput} title="Last Name" type="text" className="last-name" />
          {isCondensed && <aside className="checkout-review-pickup-note">A government issued ID is required to pick up the order.</aside>}
        </div>

        {showEmailAddress && <Field name="emailAddress" component={LabeledInput} title="Email Address" type="text" className="email-address" />}
        {showPhoneNumber && <Field name="phoneNumber" component={LabeledInput} title="Mobile Number" type="tel" className="phone-number" />}
      </div>
    );
  }
}
