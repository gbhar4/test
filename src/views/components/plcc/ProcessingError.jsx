/** @module ProcessingError
 *
 * @author Florencia Acosta
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CardWithSmile} from 'views/components/plcc/CardWithSmile.jsx';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

import {isClient} from 'routing/routingHelper';

if (DESKTOP) { // eslint-disable-line
  require('./_d.under-review-plcc.scss');
} else {
  require('./_m.under-review-plcc.scss');
}

export class ProcessingError extends React.Component {
  static propTypes = {
    isInstantCredit: PropTypes.bool.isRequired,
    // /** Boolean for know if the service return Processing Error */
    // isApplicationError: PropTypes.bool.isRequired,
    /** Boolean for know if the service return Timeout Error */
    isApplicationTimeout: PropTypes.bool.isRequired,
    /** Func to close button for dispatch a new invalid state and refresh submit */
    onDissmissErrorModal: PropTypes.func.isRequired,
    /** Flag to know if content should be into a modal */
    isModal: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      isApplicationError: props.isApplicationError,
      isApplicationTimeout: props.isApplicationTimeout
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    this.setState({isApplicationError: nextProps.isApplicationError, isApplicationTimeout: nextProps.isApplicationTimeout});
  }

  handleClose () {
    this.setState({isApplicationError: false, isApplicationTimeout: false});
    this.props.onDissmissErrorModal();
  }

  componentWillMount () {
    // REVIEW / FIXME: I know we have a routing component for this,
    // but this page does not require a new route
    if (isClient()) {
      window.scrollTo(0, 0);
    }
  }

  render () {
    let {isInstantCredit} = this.props;
    let {isApplicationError, isApplicationTimeout} = this.state;
    let overlayClassName = cssClassName('react-overlay ', 'overlay-center ', 'overlay-form-plcc overlay-processing-error ', 'overlay-border-decoration');
    let overlayClassNameContainer = cssClassName('overlay-container');

    let content = <div className="under-review-container">
      <CardWithSmile />
      <h3 className="title-under-review">There was an error processing your request.</h3>
      {isInstantCredit
        ? <p className="message-under-review">We’re sorry. We’re experiencing technical difficulties, and cannot process <br/>your request at this time. Please try again later.</p>
        : <p className="message-under-review">We’re sorry. We’re experiencing technical difficulties, <br/> and cannot process your request at this time. <br/><br/> Please call 1-866-254-9967 (TDD/TTY: 1-888-819-1918) and speak to a customer service representative</p>
      }
    </div>;

    return (
      this.props.isModal
        ? <Modal className={overlayClassNameContainer} contentLabel="PLCC error modal" overlayClassName={overlayClassName} isOpen={isApplicationError || isApplicationTimeout}>
            <ModalHeaderDisplayContainer onCloseClick={this.handleClose} />
            {content}
          </Modal>
        : content
    );
  }
}
