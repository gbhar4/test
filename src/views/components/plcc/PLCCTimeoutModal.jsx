/** @module PLCC Timeout Modal
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';

import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages.js';
import cssClassName from 'util/viewUtil/cssClassName';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';

if (DESKTOP) { // eslint-disable-line
  require('./_d.timeout-modal-plcc.scss');
} else {
  require('./_m.timeout-modal-plcc.scss');
}

export class PLCCTimeoutModal extends React.Component {
  static propTypes = {
    /* callback to call when the user clicks to continue application or close the modal while the counter is still active */
    onClose: PropTypes.func.isRequired,

    time: PropTypes.number.isRequired,

    /* indicates whether the timeout buttons should redirect or not (on checkout they don't) */
    isRedirectOnTimeout: PropTypes.bool.isRequired,

    /* callback to call when the user clicks to restart the application form */
    onRestartAcceptance: PropTypes.func.isRequired,

    /* callback to call when the timeout times out and the user tries to close the modal (from checkout) */
    onTimedoutClose: PropTypes.func.isRequired,

    /* allow the component to customize messages to tailor instant credit language or RTPS */
    isInstantCredit: PropTypes.bool.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      currentTime: this.props.time,
      error: null
    };

    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleTimedoutCloseClick = this.handleTimedoutCloseClick.bind(this);
    this.setError = getSetErrorInStateMethod(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  handleCloseClick () {
    clearInterval(this.interval);
    this.interval = null;

    this.props.onClose();
  }

  handleTimedoutCloseClick () {
    clearInterval(this.interval);
    this.interval = null;

    this.setState({
      error: null
    });

    this.props.onTimedoutClose().catch((err) => this.setError(err));
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      let newTime = this.state.currentTime - 1;

      this.setState({
        currentTime: newTime
      });

      if (newTime === 0) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }, 1000);
  }

  render () {
    let {isMobile, isRedirectOnTimeout, isInstantCredit} = this.props;
    let {currentTime} = this.state;

    let overlayClassName = cssClassName('react-overlay ', 'overlay-center ', 'overlay-timeout-plcc ', 'overlay-border-decoration');

    return (
      <Modal onRequestClose={currentTime === 0 ? this.handleTimedoutCloseClick : null} className="overlay-container" contentLabel="" overlayClassName={overlayClassName} isOpen >
        {isMobile && <ModalHeaderDisplayContainer onCloseClick={currentTime > 0 ? this.handleCloseClick : this.handleTimedoutCloseClick} />}
        <div className="timeout-modal-container">
          {(currentTime > 0)
            ? <div className="first-alert">
              {!isMobile && <button type="button" className="button-close" onClick={this.handleCloseClick}>Close</button>}
              <img src="/wcsstore/static/images/card-smile.png" alt="my place rewards card img" className="img-promo-plcc" />

              <h2 className="title-promo">Still There?</h2>

              <p className="text-promo">To protect your privacy, we will close this page in <strong>{currentTime} seconds</strong> if you don't choose to continue.</p>

              {this.state.error && <ErrorMessage error={this.state.error} />}
              <button type="button" className="button-continue-acceptance" onClick={this.handleCloseClick}>{(isInstantCredit) ? 'Continue application' : 'Continue Acceptance'}</button>
            </div>

          : <div className="second-alert">
            {!isMobile && isRedirectOnTimeout && <HyperLink destination={PAGES.webInstantCredit} className="button-close">Close</HyperLink>}
            {!isMobile && !isRedirectOnTimeout && <button type="button" className="button-close" onClick={this.handleTimedoutCloseClick}>Close</button>}
            <img src="/wcsstore/static/images/card-smile.png" alt="my place rewards card img" className="img-promo-plcc" />

            <h2 className="title-promo current-time">{(isInstantCredit) ? 'We\'ve closed your application.' : 'We\'ve closed your pre-screen acceptance'}</h2>
            <p className="text-promo current-time">To protect your privacy, we have closed this session.</p>

            {this.state.error && <ErrorMessage error={this.state.error} />}
            <button type="button" className="button-restart" onClick={this.props.onRestartAcceptance}>{(isInstantCredit) ? 'Restart application' : 'Restart Acceptance'}</button>

            {!isInstantCredit && (
              isRedirectOnTimeout
                ? <HyperLink destination={PAGES.checkout} className="button-return">Return to checkout</HyperLink>
                : <button type="button" className="button-return" onClick={this.handleTimedoutCloseClick}>Return to checkout</button>
            )}
          </div>}
        </div>
      </Modal>
    );
  }
}
