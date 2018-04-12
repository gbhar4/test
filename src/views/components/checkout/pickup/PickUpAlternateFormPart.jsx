/** @module PickUpAlternateFormPart
 * @summary a form part for requesting and inserting an alternate pickup person details.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';

import {LabeledCheckbox} from '../../common/form/LabeledCheckbox.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ContactFormFields} from './ContactFormFields.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';

export class PickUpAlternateFormPart extends React.Component {
  static propTypes = {
    showTitle: PropTypes.bool,
    showNoteOnToggle: PropTypes.bool,
    isCondensed: PropTypes.bool
  }

  static defaultValidation = getStandardConfig(['firstName', 'lastName', 'emailAddress']);

  constructor (props) {
    super(props);
    this.mapValuesToAlternateFieldsProps = (values) => ({hasAlternatePickup: values.hasAlternatePickup});
  }

  render () {
    let {className, showTitle, showNoteOnToggle, isCondensed} = this.props;
    let legendClassName = cssClassName('alternate-form-title ', { 'sr-only': !showTitle });

    return (
      <div className={cssClassName('pick-up-alternate-form ', className)}>
        <legend className={legendClassName}>Alternative Pickup Contact</legend>

        <fieldset className="pick-up-alternate-fieldset">
          <Field name="hasAlternatePickup" component={LabeledCheckbox} className="alternate-pickup">
            <span>Add an alternate pickup person (optional)</span>
            {showNoteOnToggle &&
              <p className="pick-up-note">
                Alternate pickup contact will also receive a copy of all Order Pickup emails.
              </p>
            }
          </Field>
          <PickUpAlternateFields isCondensed={isCondensed}
            adaptTo={'hasAlternatePickup'} mapValuesToProps={this.mapValuesToAlternateFieldsProps} />
        </fieldset>
      </div>
    );
  }
}

let PickUpAlternateFields = getAdaptiveFormPart((props) => {
  if (!props.hasAlternatePickup) return null;
  return (
    <FormSection name="pickUpAlternate">
      <ContactFormFields className="pick-up-alternate-input" showEmailAddress isCondensed={props.isCondensed} />
    </FormSection>
  );
});
