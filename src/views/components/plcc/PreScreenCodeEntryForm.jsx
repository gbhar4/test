/** @module My place rewards credit card existing
 * @summary message of PLCC are existing
 *
 * @author Oliver Ramirez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.pre-screen-code.scss');
} else {
  require('./_m.pre-screen-code.scss');
}

class _PreScreenCodeEntryForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    ...reduxFormPropTypes
  }

  static defaultValidation = {
    ...getStandardConfig(['prescreenCode'])
  }

  render () {
    let {handleSubmit, error} = this.props;

    return (
      <Modal onRequestClose={this.props.onClose} className="overlay-container" contentLabel="preScreenCode" overlayClassName="react-overlay overlay-center overlay-pre-screen-code overlay-border-decoration" isOpen >
        <form className="pre-screen-code-container" onSubmit={handleSubmit}>
          <ModalHeaderDisplayContainer title="" onCloseClick={this.props.onClose} />
          <h2 className="title">You're Pre-Approved</h2>

          <p className="message">You should have received a pre-screen code in the mail. Enter it here to start the acceptance process.</p>

          {error && <ErrorMessage error={error} />}
          <Field component={LabeledInput} name="prescreenCode" className="input-pre-screen" title="Enter Pre-Screen Code" />
          <button type="submit" className="button-primary button-continue">Continue</button>
          <button type="button" onClick={this.props.onClose} className="button-primary button-return">Cancel</button>
        </form>
      </Modal>
    );
  }
}

let validateMethod = createValidateMethod({
  ..._PreScreenCodeEntryForm.defaultValidation
});

let PreScreenCodeEntryForm = reduxForm({
  form: 'preScreenCodeEntry',
  ...validateMethod
})(_PreScreenCodeEntryForm);

export {PreScreenCodeEntryForm};
