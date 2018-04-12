/**
* @module PickUpReviewSection
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Section to display pick up on review section of checkout, for normal checkout and express (form)
* also used in guest / registered pickup section
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {TitlePlusEditButton} from '../TitlePlusEditButton.jsx';
import {PickUpContactDisplay} from './PickUpContactDisplay.jsx';
import {PickUpAlternateDisplay} from './PickUpAlternateDisplay.jsx';
import {PickUpAlternateFormPart} from './PickUpAlternateFormPart.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-review-pickup.scss');
} else {  // eslint-disable-line
  require('./_m.checkout-review-pickup.scss');
}

export class PickUpReviewSection extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,

    /** indicates the section needs to display the form to enter additional pick up person vs just showing the information */
    enablePickUpAlternateForm: PropTypes.bool.isRequired,
    pickUpContactPerson: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      emailAddress: PropTypes.string,
      phoneNumber: PropTypes.string.isRequired
    }),

    pickUpAlternatePerson: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      emailAddress: PropTypes.string.isRequired
    }),
    isHasPickUpAlternatePerson: PropTypes.bool.isRequired,
    /** callback for initiating edit of main pickup contact */
    onEdit: PropTypes.func.isRequired
  }

  static defaultValidation = PickUpAlternateFormPart.defaultValidation;

  render () {
    let {enablePickUpAlternateForm, pickUpContactPerson, pickUpAlternatePerson, isMobile, isHasPickUpAlternatePerson} = this.props;

    return (
      <div className="checkout-review-section checkout-review-pickup">
        {pickUpContactPerson &&
          <TitlePlusEditButton title={isMobile ? 'Pickup' : 'Pick Up In Store'}
            onEdit={this.props.onEdit} className="pick-up pick-up-contact" />
        }
        <PickUpContactDisplay contactDetails={pickUpContactPerson} />

        {enablePickUpAlternateForm
          ? <PickUpAlternateFormPart showTitle isCondensed showNoteOnToggle />
          : <PickUpAlternateDisplay {...pickUpAlternatePerson} isHasPickUpAlternatePerson={isHasPickUpAlternatePerson} />}
      </div>
    );
  }
}
