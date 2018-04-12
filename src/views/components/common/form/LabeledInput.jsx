/** @module LabeledInput
 * @summary A React component rendering an input field with a label and optional validation error or warning.
 *
 * @author Ben
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {ErrorMessage, ERROR_FORM_NAME_DATA_ATTRIBUTE} from '../ErrorMessage.jsx';

/**
 * @summary A React component rendering an input field with a label and optional validation error or warning.
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 * Any extra props (i.e., other than <code>name, title, className, showErrorIfUntouched, showWarningIfUntouched, input, meta</code>),
 * e.g., <code>type, disabled, placeholder</code>, passed to this component will be passed along to the rendered <code>input</code> element.
 *
 * @example <caption>Usage</caption>
 * <LabeledInput name="fname" title="First Name" placeholder="enter your first name">
 *
 * @example <caption>Usage with redux-form</caption>
 * import {Field} from 'redux-form';
 * //
 * <Field component={LabeledInput} className="input-first-name" name="fname" title="First Name" type="text" placeholder="enter your first name" />
 */

export class LabeledInput extends React.Component {

  static propTypes = {
    /** The text to display in the label for this input field. */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    /** The CSS class to use for the title text(please fix this comnment to be more accurate) */
    className: PropTypes.string,
    /**
     * If <code>true</code>, and there is a validation error associated with the input value (i.e, </code>this.props.meta.error</code> is not empty)
     * then the error message will be displayed even if </code>this.props.meta.touched</code> is <code>false</code>.
     */
    showErrorIfUntouched: PropTypes.bool,
    /**
     * If <code>true</code>, and there is a validation error associated with the input value (i.e, </code>this.props.meta.error</code> is not empty)
     * then the error message will be displayed even if </code>this.props.meta.touched</code> is <code>false</code>.
     */
    showWarningIfUntouched: PropTypes.bool,
    /** A value for the React <code>ref</code> property of the rendered input element
     * Note that the <code>ref</code> prop of this element refers to this LabeledInpot component,
     * and not to the rendered HTML input element like this prop.
     */
    inputRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  }

  static labeledInputCount = 0;

  constructor (props) {
    super(props);

    this.state = {
      isFocused: false
    };

    this.labeledInputCount = LabeledInput.labeledInputCount++;

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // handles blur events of the input element of this component
  handleBlur (event) {
    this.setState({
      isFocused: false
    });

    // notify our listeners that this component is blured
    if (this.props.input && this.props.input.onBlur) this.props.input.onBlur(event);
  }

  // handles focus events of the input element of this component
  handleFocus (event) {
    this.setState({
      isFocused: true
    });

    // notify our listeners that this component is blured
    if (this.props.input && this.props.input.onFocus) this.props.input.onFocus(event);
  }

  // handles change events of the input element of this component
  handleChange (event) {
    // notify our listeners that this component is blured
    if (this.props.input && this.props.input.onChange) this.props.input.onChange(event);
  }

  render () {
    let {
      title,
      className,
      showErrorIfUntouched,
      showWarningIfUntouched,
      inputRef,
      input,                       // When using redux-form, is passed implicitly by a wrapping Field component
      meta,                        // When using redux-form, is passed implicitly by a wrapping Field component
      children,
      type,
      placeholder,
      ...otherProps               // all the extra props passed to this component (or the wrapping Field component when using redux-form)
     } = this.props;

    meta = meta || {};            // meta may be undefined if this component is not wrapped with a redux-form Field HOC
    let {touched, error, warning} = meta;

    let showError = error && (touched || showErrorIfUntouched);
    let showWarning = !showError && warning && (touched || showWarningIfUntouched);
    // If there is an error then show it; otherwise, if there is a warning then show it
    let errorMessage = showError ? error : (showWarning ? warning : null);

    let dataAttributes = showError || showWarning
      ? { [ERROR_FORM_NAME_DATA_ATTRIBUTE]: meta.form || '' }
      : {};

    let containingClassName = cssClassName('input-common ', className, {' label-error': showError, ' label-warning': showWarning});
    let inputClassName = cssClassName({'input-error': showError, 'input-warning': showWarning});
    let titleClassName = cssClassName('input-title ', {'input-title-placeholder ': !this.state.isFocused && input.value === ''});
    let messageClassName = cssClassName('inline-', {'error-message': showError, 'warning-message': showWarning});
    let name = (input && input.name) ? input.name : otherProps.name;
    let uniqueId = `${name}_${this.labeledInputCount}`;
    let errorUniqueId = 'error_' + uniqueId; // Unique Id to connect the error input with its error message. Both needs to be the same. Accessibility requirement. DT-30852

    return (
      <div className={containingClassName}>
        <label htmlFor={uniqueId} {...dataAttributes} tabIndex="-1">
          {typeof title === 'string' ? <div className={titleClassName}>{(input.value === '' && !!placeholder) ? placeholder : title}</div> : title}
          {/* default type is "text" */}
          <input id={uniqueId} type={type || 'text'} className={inputClassName} {...input} {...otherProps} ref={inputRef}
            onBlur={this.handleBlur} onFocus={this.handleFocus} onChange={this.handleChange} placeholder={placeholder || ''} aria-describedby={errorUniqueId} />
          {children}
        </label>
        {/* If there is an error then show it; otherwise, if there is a warning then show it */}
        <ErrorMessage isShowingMessage={!!showError || !!showWarning} errorId={errorUniqueId} className={messageClassName} error={showError ? error : warning} withoutErrorDataAttribute />
      </div>
    );
  }
}
