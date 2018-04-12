/**  @module AddressBookSelectModal
 * @summary A form section for selecting an address from radios of addresses; editing an existing address, or adding a new address.
 * add / edit are their own forms, select is form part of the container of this component
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';
import {Modal} from 'views/components/modal/Modal.jsx';
import {AddressBookSelectContainer} from 'views/components/address/AddressBookSelectContainer';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {EditOrNewAddressBookEntryForm} from 'views/components/address/EditOrNewAddressBookEntryForm.jsx';

if (!DESKTOP) { // eslint-disable-line
  require('./_m.address-book-select-modal.scss');
}

// note that we are extending FormSection (and not React.Component) just so that we can provide a default 'name' prop.
export class AddressBookSelectModal extends FormSection {

  static propTypes = {
    /** The list of addresses to choose from */
    addressBookEntries: AddressBookSelectContainer.propTypes.addressBookEntries,

    /** Flags if 'set as default' checkbox should be shown */
    isShowSetAsDefault: PropTypes.bool.isRequired,
    /** Flags if 'save to account' checkbox should be shown */
    isShowSaveToAccount: PropTypes.bool.isRequired,

    /**
     * A callback to call whenever a change in the selected address is made.
     * Receives as a parameter the id of the selected address;
     * or null to indicate the "add new address" was selected
     */
    onAddressSelectionChange: PropTypes.func.isRequired,

    onEditAddressSubmit: PropTypes.func.isRequired,
    onNewAddressSubmit: PropTypes.func.isRequired,

    isAdding: PropTypes.bool,
    isDisableCountry: PropTypes.bool,
    defaultCountry: PropTypes.string,

    title: PropTypes.string
  }

  static defaultProps = {
    /** the default name of this form section */
    name: 'shipTo',
    title: 'Shipping Address',
    submitButtonText: 'Select this shipping address'
  }

  constructor (props, context) {
    super(props, context);
    this.state = {
      isEditing: false,
      isAdding: this.props.isAdding,
      addressKey: null
    };

    this.handleEditEntry = this.handleEditEntry.bind(this);
    this.handleNewEntry = this.handleNewEntry.bind(this);
    this.handleEditAddressSubmit = this.handleEditAddressSubmit.bind(this);
    this.handleAddNewAddressSubmit = this.handleAddNewAddressSubmit.bind(this);
  }

  handleEditEntry (addressKey) {
    this.setState({
      isEditing: true,
      isAdding: false,
      addressKey: addressKey
    });
  }

  handleNewEntry () {
    this.setState({
      isEditing: false,
      isAdding: true,
      addressKey: null
    });
  }

  closeAddOrEditForm () {
    this.setState({
      isEditing: false,
      isAdding: false,
      addressKey: null
    });
  }

  handleEditAddressSubmit (formData) {
    return this.props.onEditAddressSubmit(formData).then((res) => this.props.onAddressSelectionChange(this.state.addressKey));
  }

  handleAddNewAddressSubmit (formData) {
    return this.props.onNewAddressSubmit(formData).then((res) => this.props.onAddressSelectionChange(res.addressKey));
  }

  renderSelectFromSection () {
    let {
      title,
      addressBookEntries
    } = this.props;

    return (
      <Modal className="overlay-container" contentLabel="Addresses Modal" overlayClassName="react-overlay overlay-right address-book-select-overlay" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title={title} onCloseClick={this.props.onClose} >
          <button type="button" onClick={this.props.onClose} aria-label="back" className="button-back">Back</button>
        </ModalHeaderDisplayContainer>
        <Field component={AddressBookSelectContainer} name="onFileAddressKey" className="dropdown-address-book" title="Select from address book"
          addressBookEntries={addressBookEntries} onAddNewEntry={this.handleNewEntry} onSelectEntry={this.props.onAddressSelectionChange} onEditEntry={this.handleEditEntry} />
      </Modal>
    );
  }

  renderEditForm () {
    let {addressKey} = this.state;
    let {isDisableCountry, addressBookEntries, submitButtonText, isShowSetAsDefault, isHavePhoneField} = this.props;
    let addressBookEntry = addressBookEntries.find((entry) => entry.addressKey === addressKey);
    let initialValues = {
      ...addressBookEntry,
      setAsDefault: addressBookEntry && addressBookEntry.isDefault,
      saveToAccount: true
    };

    return (
      <Modal className="overlay-container" contentLabel="Edit Address" overlayClassName="react-overlay overlay-right address-book-select-overlay" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title="Edit Address" onCloseClick={this.props.onClose} >
          <button type="button" onClick={this.props.onClose} aria-label="back" className="button-back">Back</button>
        </ModalHeaderDisplayContainer>

        <EditOrNewAddressBookEntryForm
          isDisableCountry={isDisableCountry}
          isShowSetAsDefault={isShowSetAsDefault} isHavePhoneField={isHavePhoneField}
          initialValues={initialValues}
          onSubmit={this.handleEditAddressSubmit}
          submitButtonText={submitButtonText} />
      </Modal>
    );
  }

  renderAddNewForm () {
    let {isDisableCountry, defaultCountry, submitButtonText, isShowSaveToAccount, isShowSetAsDefault, isHavePhoneField} = this.props;
    let initialValues = {
      address: {
        country: defaultCountry
      },
      saveToAccount: true
    };

    return (
      <Modal className="overlay-container" contentLabel="Add New Address" overlayClassName="react-overlay overlay-right address-book-select-overlay" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title="Add New Address" onCloseClick={this.props.onClose} >
          <button type="button" onClick={this.props.onClose} aria-label="back" className="button-back">Back</button>
        </ModalHeaderDisplayContainer>

        <EditOrNewAddressBookEntryForm
          isDisableCountry={isDisableCountry}
          isShowSaveToAccount={isShowSaveToAccount}
          isShowSetAsDefault={isShowSetAsDefault} isHavePhoneField={isHavePhoneField}
          initialValues={initialValues}
          onSubmit={this.handleAddNewAddressSubmit}
          submitButtonText={submitButtonText} />
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
