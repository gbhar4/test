/**  @module PaymentMethodSelectModal
 * @summary A form section for selecting a credit card from radios of credit cards; editing an existing card, or adding a new card.
 * add / edit are their own forms, select is form part of the container of this component
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {EditOrNewCreditCardEntryFormContainer} from 'views/components/billing/EditOrNewCreditCardEntryFormContainer.js';
import {CreditCardSelect} from 'views/components/billing/CreditCardSelect.jsx';

if (!DESKTOP) { // eslint-disable-line
  require('./_m.credit-card-select-modal.scss');
}

// note that we are extending FormSection (and not React.Component) just so that we can provide a default 'name' prop.
export class CreditCardSelectModal extends React.Component {

  static propTypes = {
    creditCardEntries: CreditCardSelect.propTypes.creditCardEntries,

    /** Flags if 'set as default' checkbox should be shown */
    isShowSetAsDefault: PropTypes.bool.isRequired,

    /** Flags if 'save to account' checkbox should be shown */
    isShowSaveToAccount: PropTypes.bool.isRequired,

    /**
     * A callback to call whenever a change in the selected card is made.
     * Receives as a parameter the id of the selected card;
     * or null to indicate the "add new credit card" was selected
     */
    onCardSelectionChange: PropTypes.func.isRequired,

    onEditCardSubmit: PropTypes.func.isRequired,
    onNewCardSubmit: PropTypes.func.isRequired,

    isAdding: PropTypes.bool,

    title: PropTypes.string,

    /** a callback allowing one to change values of form fields
     * (usually comes from the redux-form injected form prop called 'change') */
    change: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);
    this.state = {
      isEditing: false,
      isAdding: this.props.isAdding,
      onFileCardId: null
    };

    this.handleEditEntry = this.handleEditEntry.bind(this);
    this.handleNewEntry = this.handleNewEntry.bind(this);

    this.handleEditCardSubmit = this.handleEditCardSubmit.bind(this);
    this.handleAddNewCardSubmit = this.handleAddNewCardSubmit.bind(this);
  }

  handleEditEntry (onFileCardId) {
    this.setState({
      isEditing: true,
      isAdding: false,
      onFileCardId: onFileCardId
    });
  }

  handleNewEntry () {
    this.setState({
      isEditing: false,
      isAdding: true,
      onFileCardId: null
    });
  }

  closeAddOrEditForm () {
    this.setState({
      isEditing: false,
      isAdding: false,
      onFileCardId: null
    });
  }

  handleEditCardSubmit (formData) {
    return this.props.onEditCardSubmit(formData).then((res) => {
      this.props.change('onFileCardId', this.state.onFileCardId);
      this.props.onCardSelectionChange(this.state.onFileCardId);
    });
  }

  handleAddNewCardSubmit (formData) {
    return this.props.onNewCardSubmit(formData).then((res) => this.props.onCardSelectionChange(null));
  }

  renderSelectFromSection () {
    let {
      creditCardEntries
    } = this.props;

    return (
      <Modal className="overlay-container" contentLabel="Credit Card Modal" overlayClassName="react-overlay overlay-right address-book-select-overlay" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title="Select Card" onCloseClick={this.props.onClose} >
          <button type="button" onClick={this.props.onClose} aria-label="back" className="button-back">Back</button>
        </ModalHeaderDisplayContainer>

        <Field name="onFileCardId" isMobile component={CreditCardSelect} className="dropdown-address-book" title="Select from card on file"
          creditCardEntries={creditCardEntries}
          onAddNewEntry={this.handleNewEntry} onSelectEntry={this.props.onCardSelectionChange} onEditEntry={this.handleEditEntry}
          />
      </Modal>
    );
  }

  renderEditForm () {
    let {onFileCardId} = this.state;
    let {isShowSaveToAccount, isShowSetAsDefault, creditCardEntries} = this.props;
    let creditCardEntry = creditCardEntries.find((entry) => entry.onFileCardId === onFileCardId);

    let initialValues = {
      ...creditCardEntry,
      address: {
        onFileAddressKey: creditCardEntry.addressKey
      },
      setAsDefault: creditCardEntry && creditCardEntry.isDefault,
      saveToAccount: true
    };

    return (
      <Modal className="overlay-container" contentLabel="Edit Payment Method" overlayClassName="react-overlay overlay-right address-book-select-overlay" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title="Edit Payment Method" onCloseClick={this.props.onClose}>
          <button type="button" onClick={this.props.onClose} aria-label="back" className="button-back">Back</button>
        </ModalHeaderDisplayContainer>

        <EditOrNewCreditCardEntryFormContainer
          isShowSaveToAccount={isShowSaveToAccount}
          isShowSetAsDefault={isShowSetAsDefault} isHavePhoneField
          initialValues={initialValues}
          onSubmit={this.handleEditCardSubmit}
          submitButtonText="Save" />
      </Modal>
    );
  }

  renderAddNewForm () {
    let {isShowSaveToAccount, isShowSetAsDefault} = this.props;

    return (
      <Modal className="overlay-container" contentLabel="Add Payment Method" overlayClassName="react-overlay overlay-right payment-method-select-overlay" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title="Add Payment Method" onCloseClick={this.props.onClose} >
          <button type="button" onClick={this.props.onClose} aria-label="back" className="button-back">Back</button>
        </ModalHeaderDisplayContainer>

        <EditOrNewCreditCardEntryFormContainer
          isShowSaveToAccount={isShowSaveToAccount}
          isShowSetAsDefault={isShowSetAsDefault} isHavePhoneField
          onSubmit={this.handleAddNewCardSubmit}
          submitButtonText="Save" />
      </Modal>
    );
  }

  render () {
    if (this.state.isAdding) {
      return this.renderAddNewForm();
    } else if (this.state.isEditing) {
      return this.renderEditForm();
    }

    return this.renderSelectFromSection();
  }
}
