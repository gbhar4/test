/** @module AddressVerificationWithOptionsFormPart
 * A partial form for selecting an adddress from a list of suggested address, selectable by radio buttons.
 *
 * The radio buttons use the field name "addressIndex", whoes value is -1 if originalAddress is selected,
 * and is the index into the addressSuggestionsList array for any other selected address.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';

import {LabeledRadioButton} from 'views/components/common/form/LabeledRadioButton.jsx';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';

export class AddressesSuggestionsFormPart extends React.Component {

  static propTypes = {
    /** the address for which suggested alternatives are presented by this form */
    originalAddress: PropTypes.shape({
//      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      addressLine1: PropTypes.string.isRequired,
      addressLine2: PropTypes.string,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    }).isRequired,
    /** a list of alternative addresses to choose from */
    addressSuggestionsList: PropTypes.arrayOf(PropTypes.shape({
//      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      addressLine1: PropTypes.string.isRequired,
      addressLine2: PropTypes.string,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    }).isRequired).isRequired
  }

  render () {
    let {originalAddress, addressSuggestionsList} = this.props;

    return (
      <fieldset>
        <div className="address-you-entered">
          <p className="title title-you-entered"><strong>You entered</strong></p>
          <div className="checkbox-combo address-options">
            <Field component={LabeledRadioButton} name="addressIndex" key={-1} selectedValue={'-1'}>
              <ContactInfoDisplay address={originalAddress} isShowAddress />
            </Field>
          </div>
        </div>

        {!!addressSuggestionsList.length &&
          <div className="address-we-suggest">
            <p className="title title-we-suggest"><strong>We suggest</strong></p>
            <div className="checkbox-combo address-options">
              {addressSuggestionsList.map((address, index) =>
                // using the index as the key and value is OK since addressSuggestionsList does not
                // change while component is mounted
                <Field component={LabeledRadioButton} name="addressIndex" key={index} selectedValue={index.toString()}>
                  <ContactInfoDisplay address={address} isShowAddress />
                </Field>
              )}
            </div>
          </div>}
      </fieldset>
    );
  }
}
