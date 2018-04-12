/** @module InputPassword
 * @summary A React component rendering a {@linkcode module:LabeledInputWithButton} for accepting passwords
 * with a button that toggles the option to see the entered text.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ButtonTooltip} from 'views/components/tooltip/ButtonTooltip.jsx';
import {LabeledInputWithButton} from './LabeledInputWithButton.jsx';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';

/**
 * @summary A React component rendering a {@linkcode module:LabeledInputWithButton} for accepting passwords
 * with a button that toggles the option to see the entered text.
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 *
 * This component completely takes over the props of the button (i.e., <code>dontDisableButtonIfInvalid, buttonProps<c/ode>) and the type of the inpout
 * in the rendered {@linkcode module:LabeledInputWithButton}, but passes along to the <code>LabeledInputWithButton</code> any extra props
 * (e.g., <code>name, title, showErrorIfUntouched, meta</code>, but not <code>buttonText, dontDisableButtonIfInvalid, buttonProps, type</code>)
 * passed to this component (either directly or by a wrapping HOC).
 *
 * @example <caption>Usage with redux-form</caption>
 * import {Field} from 'redux-form';
 * //
 * <Field component={InputPassword} classNamePrefix="input-common" name="password" title="Password" placeholder="Enter your password" />
 */
export class InputPassword extends React.Component {

  static propTypes = {
    /** The text to display inside the show-password button. If not specified then defaults to <code>'Show'</code>. */
    buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** if present and <code>true</code> then shows the password by default */
    isInitialShowPassword: PropTypes.bool,

    /* Flag to indicates does not requires show its own tooltip */
    disabledTooltip: PropTypes.bool,

    /** Direction of tooltip arrow */
    tooltipDirection: PropTypes.string,

    /* Flag to know when success message is enabled to showing */
    isShowSuccessMessage: PropTypes.bool,

    /* Message into success notification */
    successMessage: PropTypes.string
  }

  constructor (props) {
    super(props);

    this.state = {
      showPassword: this.props.isInitialShowPassword || false    // || false to assign false to showPassword in case InitialShowPassword is undefined
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick () {
    this.setState({ showPassword: !this.state.showPassword });    // toggle this.state.showPassword
  }

  render () {
    let {isSpecialCharsDisabled, buttonText, meta, disabledTooltip, isShowSuccessMessage, successMessage, tooltipDirection, ...otherProps} = this.props;
    buttonText = this.state.showPassword ? 'Hide' : 'Show';        // set default value for buttonText

    let inputType = this.state.showPassword ? 'text' : 'password';       // type of input element decides if user sees the password or not
    let buttonProps = {
      className: 'button-show-password',
      type: 'button',
      onClick: this.handleButtonClick
    };

    tooltipDirection = tooltipDirection || 'bottom';
    isShowSuccessMessage = isShowSuccessMessage && meta.valid && !meta.pristine;

    let showError = meta.error && (meta.touched || this.props.showErrorIfUntouched);

    return (
      <LabeledInputWithButton meta={meta} {...otherProps} type={inputType} buttonText={buttonText} dontDisableButtonIfInvalid buttonProps={buttonProps}>
        {!disabledTooltip && <ButtonTooltip isOpen={showError} title="Password Requirements" className="tooltip-password" type="info" direction={tooltipDirection}>
          <b>Password Requirements:</b>
          <ul>
            <li>- Must be at least 8 characters long</li>
            <li>- Must have at least 1 uppercase letter</li>
            <li>- Must contain 1 number</li>
            {!isSpecialCharsDisabled && <li>- Must contain 1 special character: &#33;&#64;&#35;&#36;&#37;&#94;&amp;&#42;&#40;&#41;&lt;&gt;&#63;</li>}
          </ul>
          <p> Note: It can’t be your last used password or your email address.</p>
        </ButtonTooltip>}
        {isShowSuccessMessage && <SuccessMessage className="inline-success-message" message={successMessage} />}
      </LabeledInputWithButton>
    );
  }

}
