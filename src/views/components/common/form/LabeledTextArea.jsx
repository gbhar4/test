/** @module LabeledTextArea
 * @summary A React component rendering a textarea field with a label and optional validation error or warning.
 *
 * @author Ben
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {ErrorMessage, ERROR_FORM_NAME_DATA_ATTRIBUTE} from '../ErrorMessage.jsx';

export class LabeledTextArea extends React.Component {

  static propTypes = {
    /** The text to display in the label for this input field. */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

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
    showWarningIfUntouched: PropTypes.bool
  }

  static labeledTextAreaCounter = 0;

  constructor (props) {
    super(props);
    this.labeledTextAreaCounter = LabeledTextArea.labeledTextAreaCounter++;
  }

  render () {
    let {
      title,
      className,
      showErrorIfUntouched,
      showWarningIfUntouched,
      input,                       // When using redux-form, is passed implicitly by a wrapping Field component
      meta,                        // When using redux-form, is passed implicitly by a wrapping Field component
      children,
      maxLength,
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

    let containingClassName = cssClassName('textarea-common ', className, {' label-error': showError, ' label-warning': showWarning});
    let inputClassName = cssClassName({'input-error': showError, 'input-warning': showWarning});
    let messageClassName = cssClassName('inline-', {'error-message': showError, 'warning-message': showWarning});
    let name = `labeled-textarea_${this.labeledTextAreaCounter}`;
    let errorUniqueId = 'error_' + name; // Unique Id to connect the error input with its error message. Both needs to be the same. Accessibility requirement. DT-30852

    return (
      <div className={containingClassName}>
        <label htmlFor={name} {...dataAttributes} tabIndex="-1">
          <span className="input-textarea-title">{title}</span>
          {maxLength && <span className="textarea-subtitle">{maxLength} Character Limit</span>}
          {children}
          <textarea id={name} className={inputClassName} {...input} {...otherProps} maxLength={maxLength} aria-describedby={errorUniqueId} />
        </label>
        {/* If there is an error then show it; otherwise, if there is a warning then show it */}
        <ErrorMessage isShowingMessage={!!showError || !!showWarning} errorId={errorUniqueId} className={messageClassName} error={showError ? error : warning} withoutErrorDataAttribute />
      </div>
    );
  }

}
