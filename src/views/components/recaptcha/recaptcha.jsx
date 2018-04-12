/**
 * @author Agu
 * Component to initialize Google ReCaptcha API
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {requireNamedOnlineModule} from 'util/resourceLoader';

class Recaptcha extends React.Component {
  static propTypes = {
    /** styling. an additional className to use in the recaptcha container */
    className: PropTypes.string.isRequired,

    /** callback to call whenever the recaptcha module initialized */
    onloadCallback: PropTypes.func.isRequired,

    /** callback to call whenever recaptcha validation passes,
    it receives one parameter that should be provided to backend
    on the server call so they validate it **/
    verifyCallback: PropTypes.func.isRequired,

    /** callback to call whenever recaptcha validation fails. It would show an error message or something **/
    expiredCallback: PropTypes.func.isRequired,

    /** recaptcha api settings. please refer to recaptcha documentation **/
    sitekey: PropTypes.string,
    theme: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    tabindex: PropTypes.string.isRequired
  }

  static defaultProps = {
    className: '',
    onloadCallback: undefined,
    verifyCallback: undefined,
    expiredCallback: undefined,
    theme: 'light',
    type: 'image',
    size: 'normal',
    tabindex: '0',
    sitekey: '6LdYiRsTAAAAAHF4Yntsq8mPdWgHaTTFHsk8rax8'
  }

  checkReady () {
    if (!window.grecaptcha) {
      setTimeout(this.checkReady, 100);
    } else if (!this.state.ready) {
      this.setState({
        ready: true
      });
    }
  }

  constructor (props) {
    super(props);
    this._renderGrecaptcha = this._renderGrecaptcha.bind(this);

    this.checkReady = this.checkReady.bind(this); // recaptcha base includes other js we need to wait before initializing anything

    this.handleExpired = this.handleExpired.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
    this.attachToRef = this.attachToRef.bind(this);
    this.reset = this.reset.bind(this);

    this.state = {
      ready: false,
      widget: null
    };
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.ready && !prevState.ready && !this.state.widget) {
      this._renderGrecaptcha();
    }
  }

  attachToRef (refToContainer) {
    this.refToContainer = refToContainer;

    if (refToContainer !== null) {          // can be null for example when React unmounts this components
      if (!this.state.widget) {             // if the captcha object was not created
        requireNamedOnlineModule('recaptcha').then(this.checkReady);
      }
    }
  }

  handleVerify (response) {
    // TODO: need to store this value to send it on the form
    this.props.verifyCallback && this.props.verifyCallback(response);
  }

  handleExpired () {
    // TODO: need to show an error on top of recaptcha
    this.reset();
    this.props.expiredCallback && this.props.expiredCallback();
  }

  reset () {
    window.grecaptcha.reset(this.state.widget);
  }

  _renderGrecaptcha () {
    this.state.widget = window.grecaptcha.render(this.refToContainer, {
      sitekey: this.props.sitekey,
      callback: this.handleVerify,
      theme: this.props.theme,
      type: this.props.type,
      size: this.props.size,
      tabindex: this.props.tabindex,
      'expired-callback': this.handleExpired
    });

    this.props.onloadCallback && this.props.onloadCallback();
  }

  render () {
    let {className, sitekey, theme, type, size, tabindex} = this.props;

    return (
      <div className="recaptcha">
        <div className={className} ref={this.attachToRef}
          data-sitekey={sitekey}
          data-theme={theme}
          data-type={type}
          data-size={size}
          data-tabindex={tabindex}
        ></div>
      </div>
    );
  }
}

export {Recaptcha};
