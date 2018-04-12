/** @module LabeledDatePickerInput
 * @summary A React component rendering a date picker input field with a label and optional validation error or warning.
 *
 * @author Agu
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {ErrorMessage, ERROR_FORM_NAME_DATA_ATTRIBUTE} from '../ErrorMessage.jsx';

require('views/components/common/datePicker/_datePickerInput.scss');

export class LabeledDatePickerInput extends React.Component {

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

    format: PropTypes.string,

    /** Flag to know if allow to user navigates over the calendar with keyboard */
    disabledKeyboardNavigation: PropTypes.bool,

    minDate: PropTypes.object,

    maxDate: PropTypes.object
  }

  static datePickerCount = 0;

  constructor (props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.labeledDatePickerCount = LabeledDatePickerInput.datePickerCount++;
  }

// handles blur events of the input element of this component
  handleBlur (event) {
    // notify our listeners that this component is blured
    if (this.props.input && this.props.input.onBlur) this.props.input.onBlur(event);
  }

  // handles focus events of the input element of this component
  handleFocus (event) {
    // notify our listeners that this component is blured
    if (this.props.input && this.props.input.onFocus) this.props.input.onFocus(event);
  }

  // handles change events of the input element of this component
  handleChange (value) {
    // notify our listeners that this component is blured
    if (this.props.input && this.props.input.onChange) {
      this.props.input.onChange(value ? value.format(this.props.format || 'MM/DD/YYYY') : null);
    }
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
      disabledKeyboardNavigation,
      maxDate,
      minDate,
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
    let messageClassName = cssClassName('inline-', {'error-message': showError, 'warning-message': showWarning});
    let selectedValue = null;
    let uniqueId = `date-picker_${this.labeledDatePickerCount}`;
    let errorUniqueId = 'error_' + uniqueId; // Unique Id to connect the error input with its error message. Both needs to be the same. Accessibility requirement. DT-30852

    // NOTE: DT-21431 && DT-21408 requires displaying the wrong value
    if (input.value) {
      selectedValue = moment(input.value);
    }

    if (selectedValue && !selectedValue.isValid()) {
      selectedValue = null;
    }

    return (
      <div className={containingClassName}>
        <label {...dataAttributes} tabIndex="-1">
          <span>{title}</span>

          <DatePicker
            disabledKeyboardNavigation={disabledKeyboardNavigation}
            minDate={minDate}
            maxDate={maxDate}
            className={inputClassName}
            aria-describedby={errorUniqueId} {...input} {...otherProps}
            onBlur={this.handleBlur} onFocus={this.handleFocus} onChange={this.handleChange} selected={selectedValue} />

          {children}
        </label>
        {/* If there is an error then show it; otherwise, if there is a warning then show it */}
        <ErrorMessage isShowingMessage={!!showError || !!showWarning} errorId={errorUniqueId} className={messageClassName} error={showError ? error : warning} withoutErrorDataAttribute />
      </div>
    );
  }
}
