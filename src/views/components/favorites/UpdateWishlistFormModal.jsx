/**
* @module Update Wishlist Form Modal
* @summary
* @author Agu
* @link https://projects.invisionapp.com/share/C59C6U337#/screens/209377239
**/

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {Field, reduxForm} from 'redux-form';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

class _UpdateWishlistFormModal extends React.Component {
  static propTypes = {
    /** the id of the wishtlist to edit */
    id: PropTypes.string.isRequired,

    /** whether or not to enable delete wishlist functionality */
    enableDelete: PropTypes.bool.isRequired,

    /** whether or not to enable setting a wishlist as the default one */
    isSetAsDefaultDisabled: PropTypes.bool.isRequired,

    /** callback for form submit */
    onSubmit: PropTypes.func.isRequired,

    /** callback for form submit to delete the wishlist */
    onDelete: PropTypes.func.isRequired,

    /** callback to close the edit modal */
    onClose: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      isConfirmDelete: false
    };

    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleConfirmDelete () {
    this.setState({
      isConfirmDelete: true
    });
  }

  handleDelete () {
    this.props.onDelete(this.props.id).then(() => {
      this.setState({
        isConfirmDelete: false
      });

      this.props.onClose();
    });
  }

  handleSubmit (event) {
    event.preventDefault();

    this.props.handleSubmit((formData) => {
      return this.props.onSubmit({
        ...formData,
        id: this.props.id
      }).then(() => this.props.onClose());
    })();
  }

  render () {
    let {isMobile, error, enableDelete, isSetAsDefaultDisabled, onClose} = this.props;
    let {isConfirmDelete} = this.state;

    return (
      <Modal className="overlay-container" contentLabel="Update Favorite List" overlayClassName="react-overlay overlay-center overlay-update" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title="Update List Settings" onCloseClick={onClose} />

        <form onSubmit={this.handleSubmit} className="update-wishlist-form">
          {error && <ErrorMessage error={error} />}

          <div className="update-container">
            <Field name="wishlistName" component={LabeledInput} className="list-name" title={<div className="input-title">List Name</div>} />
            <Field name="setAsDefault" component={LabeledCheckbox} disabled={isSetAsDefaultDisabled} className="by-default" subtitle="Make My Default List" />

            {enableDelete && <p className="message-delete">
              {!isMobile && <span className="subtitle-delete">Delete list</span>}
              Deleting your list will remove all of your saved items. Are you sure you want to do this?
            </p>}

            {enableDelete
              ? !isConfirmDelete
              ? <button type="button" className="button-quaternary button-delete" onClick={this.handleConfirmDelete}>Delete list</button>
              : <button type="button" className="button-quaternary button-delete-confirm" onClick={this.handleDelete}>Yes, please delete list</button>
            : null}
          </div>

          <div className="buttons-container">
            <button type="submit" className={(isMobile ? 'button-primary ' : 'button-quaternary ') + 'button-save'}>Save</button>
            <button type="button" className="button-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </Modal>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig(['wishlistName']));

let UpdateWishlistFormModal = reduxForm({
  form: 'updateWishlistForm',
  ...validateMethod
})(_UpdateWishlistFormModal);

export {UpdateWishlistFormModal};
