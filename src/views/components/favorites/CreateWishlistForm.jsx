/**
* @module Create Favorite List
* @summary
* @author Oliver Ramirez
* @link https://projects.invisionapp.com/share/C59C6U337#/screens/209377251
**/

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {Field, reduxForm} from 'redux-form';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

if (DESKTOP) { // eslint-disable-line
  require('./_d.create-list.scss');
} else {
  require('./_m.create-list.scss');
}

class _CreateWishlistForm extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    error: PropTypes.string
  }

  render () {
    let {isMobile, error} = this.props;
    let submitButtonClassName = cssClassName('button-save ', {' button-primary': isMobile, ' button-quaternary': !isMobile});

    return (
      <Modal className="overlay-container" contentLabel="Create a New Favorites List" overlayClassName="react-overlay overlay-center overlay-create-list" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title="Create a New Favorites List" onCloseClick={this.props.onClose} />

        <form onSubmit={this.props.handleSubmit} className="create-wishlist-form">
          {error && <ErrorMessage error={error} />}

          <div className="create-list-container">
            <Field name="wishlistName" component={LabeledInput} className="list-name" title={<div className="input-title">List Name</div>} />
            <Field name="setAsDefault" component={LabeledCheckbox} className="by-default" subtitle="Make My Default List" />
          </div>

          <div className="buttons-container">
            <button type="submit" className={submitButtonClassName}>{isMobile ? 'Create New' : 'Save'}</button>
            <button type="button" className="button-cancel" onClick={this.props.onClose}>Cancel</button>
          </div>
        </form>
      </Modal>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig(['wishlistName']));

let CreateWishlistForm = reduxForm({
  form: 'createWishlistForm',
  ...validateMethod
})(_CreateWishlistForm);

export {CreateWishlistForm};
