/** @module LabeledInputWithButton
 * @summary A React component rendering a {@linkcode module:LabeledInput} with a button.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {LabeledInput} from './LabeledInput.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

/**
 * @summary A React component rendering a {@linkcode module:LabeledInput} with a button.
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 * The properties of the button (e.g, type, className) should be passed inside the buttonProps prop.
 *
 * Any extra props (i.e., other than <code>buttonText, dontDisableButtonIfInvalid, buttonProps</code>),
 * e.g., <code>name, title, showErrorIfUntouched, meta</code>, passed to this component (either directly or by a wrapping HOC)
 * will be passed along to the rendered <code>LabeledInput</code> element.
 *
 * The default type of the button is <code>submit</code>.
 *
 * @example <caption>Usage</caption>
 * <LabeledInputWithButton name="fname" title="First Name" buttonText="Apply" buttonProps={ {className="button-apply", type="button"} } >
 *
 * @example <caption>Usage with redux-form</caption>
 * import {Field} from 'redux-form';
 * //
 * <Field component={LabeledInputWithButton} name="fname" title="First Name" buttonText="Apply" buttonProps={ {className="button-apply", type="button"} />
 */
export class LabeledInputWithButton extends React.Component {

  static propTypes = {
    /** The text to display inside the button. */
    buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /**
     * If <code>true</code>, then the button will not be automatically disabled if the the value of this
     * input is invalid (i.e, </code>this.props.meta.invalid === true</code>)
     */
    dontDisableButtonIfInvalid: PropTypes.bool,

    /** The initial CSS class to use for the rendered <code>LabeledInput</code> */
    className: PropTypes.string,

    /**
     * A plain object containing any extra props to be passed to the button
     * Note that if a <code>disabled</code> property is passed, then it overrides any automatic
     * management of the disabled property of the button (see dontDisableButtonIfInvalid above).
     */
    buttonProps: PropTypes.object
  }

  render () {
    let {
      children,
      buttonText,
      dontDisableButtonIfInvalid,
      buttonProps,
      className,
      meta,
      ...otherProps               // all the extra props passed to this component
    } = this.props;

    meta = meta || {};            // meta may be undefined if this component is not wrapped with a redux-form Field HOC
    // default behavior is to disable the button if the value enterd in the LabeledInput is invalid
    let disabled = buttonProps && buttonProps.disabled !== undefined
                    ? buttonProps.disabled
                    : !dontDisableButtonIfInvalid && meta.invalid;
    let inputClassName = cssClassName(className, ' input-with-button');
    let buttonClassName = cssClassName(buttonProps.className);

    return (
      <div className={inputClassName}>
        <LabeledInput meta={meta} {...otherProps}>
          {children}
        </LabeledInput>
        <button {...buttonProps} className={buttonClassName} disabled={disabled}>{buttonText}</button>
      </div>
    );
  }

}
