/** @module ContactInfoDisplay
 * @summary A presentational component for displaying a person's name and contact information.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {CONTACT_ONLY_ADDRESS_PROP_TYPE_SHAPE, ADDRESS_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/addressPropTypes';

if (DESKTOP) { // eslint-disable-line
  require('./_d.contact-info-display.scss');
} else {
  require('./_m.contact-info-display.scss');
}

export class ContactInfoDisplay extends React.Component {
  static propTypes = {
    /** The text to display as a title for this contact information */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** a text to display at the end of the first line (i.e., after the name) */
    note: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** The CSS class to use for the title text(please fix this comnment to be more accurate) */
    className: PropTypes.string,

    /** the contact information to display */
    address: PropTypes.oneOfType([CONTACT_ONLY_ADDRESS_PROP_TYPE_SHAPE, ADDRESS_PROP_TYPES_SHAPE]).isRequired,

    emailAddress: PropTypes.string,
    phoneNumber: PropTypes.string,

    /** Flags if to show the address portion */
    isShowAddress: PropTypes.bool,
    /** Flags if to show the country (relevant only if isShowAddress is not falsy) */
    isShowCountry: PropTypes.bool,
    /** Flags if to show the phone */
    isShowPhone: PropTypes.bool,
    /** Flags if to show the email */
    isShowEmail: PropTypes.bool
  }

  render () {
    let {title, note, className, isShowAddress, isShowCountry, isShowPhone, isShowEmail,
      address: {
        firstName, lastName, addressLine1, addressLine2, city, state, zipCode, country
      },
      emailAddress, phoneNumber
    } = this.props;

    let containingClassName = cssClassName('address-container ', className);
    let titleClassName = cssClassName('address-title ', className);
    let addressClassName = cssClassName('address-details ', className);
    let additionalClassName = cssClassName('address-additional ', className);

    let firstAndLastName = firstName + ' ' + lastName + ' ';

    return (
      <div className={containingClassName}>
      {title && <strong className={titleClassName}>{title}</strong>}

        <p className={addressClassName}>
          <span className="name">{firstAndLastName} {note || ''}</span>
          <br />
          {isShowAddress &&
            <span className="address">
              {addressLine1}<span className="aux-char">, </span><br />
              {addressLine2 && <span>{addressLine2}<span className="aux-char">, </span><br /></span>}
              {city + ', ' + state + ' ' + zipCode}
              {isShowCountry && <span><br />{country}</span>}
            </span>
          }
        </p>

        {(emailAddress || phoneNumber) && (isShowPhone || isShowEmail) &&
          <p className={additionalClassName}>
            {isShowEmail && (emailAddress && <span>{emailAddress}<br /></span>)}
            {isShowPhone && phoneNumber}
          </p>
        }
      </div>
    );
  }
}
