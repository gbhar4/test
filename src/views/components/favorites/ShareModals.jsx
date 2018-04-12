/**
* @module Share Favorite List
* @summary
* @author Oliver Ramirez
* @author Florencia <facosta@minutentag.com>
**/

import React from 'react';
import {Modal} from 'views/components/modal/Modal.jsx';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledTextArea} from 'views/components/common/form/LabeledTextArea.jsx';
import Immutable from 'seamless-immutable';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import cssClassName from 'util/viewUtil/cssClassName.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.share-list.scss');
} else {
  require('./_m.share-list.scss');
}

export const SHARE_OPTIONS = Immutable({
  FACEBOOK: 'FB',
  EMAIL: 'EMAIL',
  LINK: 'LINK'
});

class _ShareModals extends React.Component {

  static propTypes = {
    /** the link to share */
    link: PropTypes.string.isRequired,

    /*  is the option that choise for send the list
     *  'FB'
     *  'EMAIL'
     *  'LINK'
     */
    optionShared: PropTypes.string.isRequired,

    /* Function to close modals */
    onClose: PropTypes.func.isRequired,

    ...reduxFormPropTypes
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      isEnabledCopyLink: true
    };

    this.attachLinkRef = this.attachLinkRef.bind(this);
    this.handleCopyLink = this.handleCopyLink.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render () {
    let {optionShared, isMobile} = this.props;

    let content = '';
    switch (optionShared) {
      case SHARE_OPTIONS.EMAIL:
        content = this.emailOption(isMobile);
        break;
      case SHARE_OPTIONS.LINK:
        content = this.linkOption(isMobile);
        break;
      case SHARE_OPTIONS.FACEBOOK:
        window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(this.props.link));
        this.props.onClose();
        return null;
      default:
        return null;
    }

    return (
      <Modal className="overlay-container" contentLabel="Share Favorite List" overlayClassName="react-overlay overlay-center share-favorite-list" isOpen>
        <ModalHeaderDisplayContainer title="Share Favorite List" onCloseClick={this.props.onClose} />
        <div className="share-container">
          <p className="message">Make sure to specify a size and color for your items before sharing.</p>
          {content}
        </div>
      </Modal>
    );
  }

  componentWillMount () {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if ((/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
      this.setState({ isEnabledCopyLink: false });
    }
  }

  linkOption (isMobile) {
    let copyButtonClass = cssClassName(
      isMobile ? 'button-primary ' : 'button-quaternary ',
      'button-copy'
    );
    let { isEnabledCopyLink } = this.state;

    return (
      <div>
        <LabeledInput name="from" disabled={isEnabledCopyLink} className="from-copy-link" title="Copy this link and then send it to friends:" input={{value: this.props.link, onChange: () => {}}} inputRef={this.attachLinkRef} />

        <div className="buttons-container">
          {isEnabledCopyLink && <button className={copyButtonClass} onClick={this.handleCopyLink}>Copy Link</button>}
          <button className="button-cancel" onClick={this.props.onClose}>Cancel</button>
        </div>
      </div>
    );
  }

  attachLinkRef (ref) {
    this.linkRef = ref;
  }

  handleCopyLink () {
    this.linkRef.disabled = false;
    this.linkRef.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.log('Oops, unable to copy');
    }

    this.linkRef.disabled = true;
  }

  handleSubmit (event) {
    event.preventDefault();

    this.props.handleSubmit((formData) => {
      return this.props.onSubmit(formData).then(() => this.props.onClose());
    })();
  }

  emailOption (isMobile) {
    let {error} = this.props;

    return (
      <form onSubmit={this.handleSubmit} className="share-email-form">
        {error && <ErrorMessage error={error} />}

        <Field name="shareToEmailAddresses" component={LabeledInput} className="to-email-input" title={<div className="input-title">To</div>} />
        <Field name="shareFromEmailAddresses" component={LabeledInput} className="from-email-input" title={<div className="input-title">From</div>} />
        <Field name="shareSubject" component={LabeledInput} className="subject-input" title={<div className="input-title">Subject</div>} />
        <Field name="shareMessage" component={LabeledTextArea} className="message-box-input" title="Message" />

        <div className="buttons-container">
          <button type="submit" className={(isMobile ? 'button-primary ' : 'button-quaternary ') + 'button-send'}>Send</button>
          <button type="button" className="button-cancel" onClick={this.props.onClose}>Cancel</button>
        </div>
      </form>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig(['shareFromEmailAddresses', 'shareToEmailAddresses', 'shareSubject', 'shareMessage']));

let ShareModals = reduxForm({
  form: 'ShareModals',
  ...validateMethod
})(_ShareModals);

export {ShareModals};
