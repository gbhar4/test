/** @module AddressVerificationForm
 * @summary A form for selecting an alternative address (usually a standardized version) to a given address,
 *  or for prompting the user for addressLine2 (apartment or suite number).
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {AddressesSuggestionsFormPart} from './AddressesSuggestionsFormPart.jsx';
import {AddressLine2PromptFormPart} from './AddressLine2PromptFormPart.jsx';
// import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.address-verification.scss');
} else {
  require('./_m.address-verification.scss');
}

class _AddressVerificationForm extends React.Component {
  static propTypes = {
    /** the address for which suggested alternatives are presented by this form */
    originalAddress: AddressesSuggestionsFormPart.propTypes.originalAddress,
    /** a list of alternative addresses to choose from */
    addressSuggestionsList: AddressesSuggestionsFormPart.propTypes.addressSuggestionsList,

    /** callback to dismiss this form (and return to manually entering the address) */
    onReturnToEditAddress: PropTypes.func.isRequired,

    /** This is the text to display to the user to help them understand why we poped the modal */
    modalSubTitle: PropTypes.object.isRequired,

    /** The version of the form on the address verification modal to be displayed will be determined by this */
    displayAptMissingForm: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    ...reduxFormPropTypes
  }

  render () {
    let {modalSubTitle: { className, text }, originalAddress, addressSuggestionsList, onReturnToEditAddress, error, handleSubmit, submitting, displayAptMissingForm} = this.props;

    return (
      <form className="address-verification" onSubmit={handleSubmit}>
        <div className="verify-notification">
          <h3>Verify Your Address</h3>
          <p className={className}> {text} </p>
        </div>

        {error && <ErrorMessage error={error} />}

        {displayAptMissingForm
          ? <AddressLine2PromptFormPart originalAddress={originalAddress} />
          : <AddressesSuggestionsFormPart originalAddress={originalAddress} addressSuggestionsList={addressSuggestionsList} />
        }

        <div className="group-button">
          <button type="submit" className="button-continue" disabled={submitting}>Continue</button>
          <button type="button" className="button-edit" onClick={onReturnToEditAddress}>EDIT ADDRESS</button>
        </div>
      </form>
    );
  }

}

// let validateMethod = createValidateMethod({
//   rules: {
//     addressIndex: {
//       custom: (values, props) => isShowAddressSuggestions(props) && (values.suggestedAddress || '').length > 0
//     }
//   },
//   messages: {
//     addressIndex: 'Please select an address'
//   }
// });

let AddressVerificationForm = reduxForm({
  form: 'addressVerificationForm',
//  ...validateMethod
  initialValues: {
    addressIndex: '0'     // select the first suggested address
  }
})(_AddressVerificationForm);

export {AddressVerificationForm};
