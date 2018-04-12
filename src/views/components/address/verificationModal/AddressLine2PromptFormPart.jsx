/** @module AddressLine2PromptFormPart
 * A partial form for displaying an address and prompting the user for an addressline2.
 * The input field name for entering address line 2 is named "addressLine2".
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {Field} from 'redux-form';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {AddressesSuggestionsFormPart} from './AddressesSuggestionsFormPart.jsx';

export class AddressLine2PromptFormPart extends React.Component {

  static propTypes = {
    /** the address for which suggested alternatives are presented by this form */
    originalAddress: AddressesSuggestionsFormPart.propTypes.originalAddress
  }

  render () {
    let {originalAddress} = this.props;
    return (
      <fieldset>
        <div className="address-entered-only">
          <p className="title"><strong>You entered</strong></p>
          <ContactInfoDisplay address={originalAddress} isShowAddress />

          <p className="title"><strong>Address Line 2 (optional)</strong></p>
          <Field component={LabeledInput} name="addressLine2" placeholder="Apartment or suite number" />
        </div>
      </fieldset>
    );
  }
}
