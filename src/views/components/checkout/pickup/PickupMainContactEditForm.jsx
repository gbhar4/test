/** @module PickupMainContactEditForm
 * A form for viewing or editing the main contact person for checkout BOPIS.
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {Modal} from 'views/components/modal/Modal.jsx';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {PickUpContactDisplay} from './PickUpContactDisplay.jsx';
import {ContactFormFields} from './ContactFormFields.jsx';
import {TitlePlusEditButton} from '../TitlePlusEditButton.jsx';
import {SaveAndCancelButton} from 'views/components/checkout/SaveAndCancelButton.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-pickup-form.scss');
} else {  // eslint-disable-line
  require('./_m.checkout-pickup-form.scss');
}

class _PickupMainContactEditForm extends React.Component {

  static propTypes = {
    /** Flags if this form should display in the editing state */
    isEditing: PropTypes.bool.isRequired,

    /**
     * A callback to call whenever switching between the read-only and editing modes.
     * Will accept a single Boolean parameter that is true when entering edit mode,
     * and is false when exiting the edit mode.
     */
    onEditModeChange: PropTypes.func.isRequired,

    ...reduxFormPropTypes
  }

  static defaultValidation = getStandardConfig(['firstName', 'lastName', 'emailAddress', 'phoneNumber']);

  constructor (props) {
    super(props);
    this.handleEnterEditModeClick = () => this.props.onEditModeChange(true);
    this.handleExitEditModeClick = () => { this.props.reset(); this.props.onEditModeChange(false); };
  }

  render () {
    let {className, isMobile, handleSubmit, initialValues, isEditing} = this.props;
    className = cssClassName('pick-up-form', ' pick-up-input', className);

    return (
      <div className={className}>
        {this.renderSectionTitle()}
        {!isEditing && <PickUpContactDisplay contactDetails={initialValues} />}
        {isEditing && !isMobile && <ContactFormFields className="pick-up-input toggle" showPhoneNumber />}
        {isEditing && isMobile &&
          <Modal className="overlay-container" contentLabel="Edit Pickup" overlayClassName="react-overlay overlay-right pick-up-edit-overlay" preventEventBubbling isOpen>
            <ModalHeaderDisplayContainer title="Edit Pickup" onCloseClick={this.handleExitEditModeClick}>
              <button type="button" onClick={this.handleExitEditModeClick} aria-label="back" className="button-back">Back</button>
            </ModalHeaderDisplayContainer>
            <form onSubmit={handleSubmit} className="pick-up-form-edit-content">
              <ContactFormFields className="pick-up-input toggle" showPhoneNumber isCondensed />
              <button type="submit" aria-label="save pickup details" className="button-primary button-save-pickup">Save pickup details</button>
            </form>
          </Modal>
        }
        {isEditing && <SaveAndCancelButton onSubmit={handleSubmit} onCancel={this.handleExitEditModeClick} />}
      </div>
    );
  }

  // --------------- private methods --------------- //
  renderSectionTitle () {
    let title = this.props.isMobile ? 'Pickup' : 'Pickup Contact';
    return (this.props.isEditing
      ? <div className="pick-up-form">
        <h2 className="pick-up-form-title">{title}</h2>
        {/* <button type="submit" aria-label="save" className="button-save-address">Save</button>
        <button type="button" aria-label="cancel" className="button-cancel-address"
          onClick={this.handleExitEditModeClick}>Cancel</button> */}
      </div>
      : <TitlePlusEditButton title={title} onEdit={this.handleEnterEditModeClick} className="summary-title-pick-up-contact" />
    );
  }
  // --------------- end of private methods --------------- //

}

// FIXME: ? validation of email and phone depends on the corresponding props.
let validateMethod = createValidateMethod(_PickupMainContactEditForm.defaultValidation);

let PickupMainContactEditForm = reduxForm({
  form: 'pickupMainForm',       // (a default value) unique identifier for this form
  ...validateMethod,
  enableReinitialize: true
})(_PickupMainContactEditForm);
PickupMainContactEditForm.defaultValidation = _PickupMainContactEditForm.defaultValidation;

export {PickupMainContactEditForm};
