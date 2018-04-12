/** @module ModalAddressVerificationForm
 * @summary A modal displaying a form for address verification.

 *
 * Note that any extra props other than <code>title, selectedAddress, addressSuggestionsList,
 *  onModalClose, onSubmit, className, overlayClassName</code>,
 * e.g., <code>portalClassName</code>, that are passed to this component will be passed along to the rendered react-modal.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {AddressesSuggestionsFormPart} from './AddressesSuggestionsFormPart.jsx';
import {AddressVerificationForm} from './AddressVerificationForm.jsx';
import {Modal} from 'views/components/modal/Modal.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.address-verification.scss');
} else {
  require('./_m.address-verification.scss');
}

// FIXME rename to AddressVerificationModal
export class ModalAddressVerificationForm extends React.Component {

  static propTypes = {
    /** Indicates mobile version (most components need it to handle specific layout settings) */
    isMobile: PropTypes.bool.isRequired,
    /** title for the modal (used in mobile). Defaults to "Verify Your Address" */
    title: PropTypes.string,

    /** This is the text to display to the user to help them understand why we poped the modal */
    modalSubTitle: PropTypes.object.isRequired,

    /** the address for which suggested alternatives are presented by this form */
    originalAddress: AddressesSuggestionsFormPart.propTypes.originalAddress,
    /** a list of alternative addresses to choose from */
    addressSuggestionsList: AddressesSuggestionsFormPart.propTypes.addressSuggestionsList,

    /** Callback to dismiss this modal, and cancel the submit */
    onModalClose: PropTypes.func.isRequired,
    /**
     * Callback to call when the AddressVerificationForm is submitted.
     * This method will be passed the address selected/modified in the AddressVerificationForm
     */
    onSubmit: PropTypes.func.isRequired,

    /** The version of the form on the address verification modal to be displayed will be determined by this */
    displayAptMissingForm: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ])
  }

  static defaultProps = {
    title: 'Verify Your Address'
  }

  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (values) {
    this.props.onSubmit(this.getSelectedAddressIfNotOriginal(values));
  }

  render () {
    let {isMobile, title, onModalClose, originalAddress, addressSuggestionsList, displayAptMissingForm, modalSubTitle, ...otherProps} = this.props;

    return (
      <Modal contentLabel="Address Verification Modal" className="overlay-container" overlayClassName={cssClassName('react-overlay overlay-center overlay-address-verification overlay-border-decoration ', { 'overlay-center': !isMobile })} preventEventBubbling {...otherProps}>
        {isMobile &&
          <header className="overlay-header verification-header">
            <button type="button" onClick={onModalClose} aria-label="back" className="button-back">Back</button>
            {title && <h3>{title}</h3>}
          </header>
        }

        <div className="address-verification-container">
          {!isMobile && <button className="button-overlay-close button-overlay-close-center" aria-label="close this modal" onClick={onModalClose}></button>}

          <AddressVerificationForm originalAddress={originalAddress} addressSuggestionsList={addressSuggestionsList}
            onReturnToEditAddress={onModalClose} onSubmit={this.handleSubmit} displayAptMissingForm={displayAptMissingForm}
            modalSubTitle={modalSubTitle} />
        </div>
      </Modal>
    );
  }

  // --------------- private methods --------------- //

  getSelectedAddressIfNotOriginal (formValues) {
    let {addressIndex, addressLine2} = formValues;
    let {originalAddress, addressSuggestionsList} = this.props;
    if (addressLine2) {
      return {...originalAddress, addressLine2};
    } else if (addressIndex === '-1') {
      return undefined;      // original address was selected
    } else {
      return addressSuggestionsList[parseInt(addressIndex)];
    }
  }
  // --------------- end of private methods --------------- //

}
