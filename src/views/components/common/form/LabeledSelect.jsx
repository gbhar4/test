/** @module LabeledSelect
 * @summary A React component rendering an HTML select with a label and optional validation error or warning.
 *
 * The currently selected item is also rendered in a <code>span</code> element that can be overlaid (using appropriate CSS)
 * on top of the <code>select</code> element to provide a custom look.
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 * Any extra props (i.e., other than <code>name, title, placeholder, alwaysShowPlaceholder, className, isHideIfEmptyOptionsMap,
 * showErrorIfUntouched, showWarningIfUntouched, input, meta</code>),
 * e.g., <code>disabled</code>, passed to this component will be passed along to the rendered <code>select</code> element.
 *
 * @example <caption>Usage</caption>
 * <LabeledSelect name="size" title="Size:" input={{value: 'XL'}} optionsMap={[{id: 'XS', displayName: 'Extra Small (XS)''}, {id: 'XL', displayName: 'Extra Large (XL)'}]}>
 *
 * @example <caption>Usage with redux-form</caption>
 * import {Field} from 'redux-form';
 * //
 * <Field component={LabeledSelect} name="size" title="Size:" optionsMap={[{id: 'XS', displayName: 'Extra Small (XS)''}, {id: 'XL', displayName: 'Extra Large (XL)'}]}>
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {ErrorMessage, ERROR_FORM_NAME_DATA_ATTRIBUTE} from '../ErrorMessage.jsx';

export class LabeledSelect extends React.Component {

  static propTypes = {
    /** The text to display in the label for this input field. */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

    /**
     * Optional placeholder text to be shown when the current value of this component does not match any option.
     * It is also used as the first (disabled) item in the dropdown (see the alwaysShowPlaceholder below)
     * defaults to 'Select'.
     */
    placeholder: PropTypes.string,

    /** Flags if the placeholder text should be visible as the first option in the dropdown
     * also when a valid option is selected. If false, the placeholder text it is only visible when the
     * current value of the select does not match any of the options, and the placeholder text is not falsy.
     */
    alwaysShowPlaceholder: PropTypes.bool,

    /** The CSS class to use for the title text (please fix this comnment to be more accurate) */
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

    /** flags to not show any errors or warnings */
    dontShowErrorOrWarning: PropTypes.bool,

    /**
     * Array with value and text for each select option.
     * Please note that the id of all entries should not be the empty string,
     * as the empty string designates that no option is selected
     */
    optionsMap: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,                // the value
      displayName: PropTypes.string.isRequired,       // the text to display
      disabled: PropTypes.bool
    })).isRequired,

    /** Flags if to hide this component when the optionsMap is empty */
    isHideIfEmptyOptionsMap: PropTypes.bool,

    /**
     * If using Redux-forms, this is passed down to this object automatically by the enclosing <code>Field</code> component.
     */
    input: PropTypes.shape({
      /**
       * The value of the selected item. Note that this value may be different than all the values in the <code>itemsMap</code> prop.
       */
      value: PropTypes.string.isRequired
    }).isRequired
  }

  static defaultProps = {
    placeholder: 'Select'
  }

  static labeledSelectCounter = 0;

  constructor (props) {
    super(props);

    this.state = {
      isFocused: false
    };

    this.labeledSelectCounter = LabeledSelect.labeledSelectCounter++;
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleFocus (event) {
    this.setState({
      isFocused: true
    });

    if (this.props.input && this.props.input.onFocus) this.props.input.onFocus(event);
  }

  handleBlur (event) {
    this.setState({
      isFocused: false
    });

    if (this.props.input && this.props.input.onBlur) this.props.input.onBlur(event);
  }

  getSelectedText () {
    let selectedOption = this.props.input && this.props.optionsMap.find((option) => option.id === this.props.input.value);
    return selectedOption && selectedOption.displayName;
  }

  render () {
    let {
      optionsMap,
      title,
      className,
      showErrorIfUntouched,
      showWarningIfUntouched,
      dontShowErrorOrWarning,
      input,                       // When using redux-form, is passed implicitly by a wrapping Field component
      meta,                        // When using redux-form, is passed implicitly by a wrapping Field component
      children,
      isHideIfEmptyOptionsMap,
      placeholder, alwaysShowPlaceholder,
      ...otherProps               // all the extra props passed to this component (or the wrapping Field component when using redux-form)
     } = this.props;

    if (isHideIfEmptyOptionsMap && optionsMap.length === 0) {
      return null;        // render nothing
    }

    meta = meta || {};            // meta may be undefined if this component is not wrapped with a redux-form Field HOC
    let selectedText = this.getSelectedText();

    let {isFocused} = this.state;
    let {touched, error, warning} = meta;

    let showError = !dontShowErrorOrWarning && error && (touched || showErrorIfUntouched);
    let showWarning = !dontShowErrorOrWarning && !showError && warning && (touched || showWarningIfUntouched);
    // If there is an error then show it; otherwise, if there is a warning then show it
    let errorMessage = showError ? error : (showWarning ? warning : null);

    let dataAttributes = showError || showWarning
      ? { [ERROR_FORM_NAME_DATA_ATTRIBUTE]: meta.form || '' }
      : {};

    let containingClassName = cssClassName('select-common ', className, {' label-error': showError, ' label-warning': showWarning, ' select-focused': isFocused});
    let inputClassName = cssClassName({'input-error': showError, 'input-warning': showWarning});
    let messageClassName = cssClassName('inline-', {'error-message': showError, 'warning-message': showWarning});
    let name = `labeled-select_${this.labeledSelectCounter}`;
    let errorUniqueId = 'error_' + name; // Unique Id to connect the error input with its error message. Both needs to be the same. Accessibility requirement. DT-30852

    return (
      <div className={containingClassName}>
        <label htmlFor={name} {...dataAttributes} tabIndex="-1">
          <span>{title}</span>

          <select {...input} {...otherProps} id={name} onFocus={this.handleFocus} onBlur={this.handleBlur} aria-describedby={errorUniqueId}>
            {placeholder && (alwaysShowPlaceholder || !selectedText) && <option value="" disabled>{placeholder}</option>}
            {optionsMap.map((optionEntry) => <option key={optionEntry.id} value={optionEntry.id} disabled={optionEntry.disabled}>{optionEntry.displayName}</option>)}
          </select>

          <span className={cssClassName('selection ', inputClassName, {' select-option-selected': selectedText})}>
            {selectedText || placeholder}
          </span>
          {children}
        </label>

        {/* If there is an error then show it; otherwise, if there is a warning then show it */}
        <ErrorMessage isShowingMessage={!!showError || !!showWarning} errorId={errorUniqueId} className={messageClassName} error={showError ? error : warning} withoutErrorDataAttribute />
      </div>
    );
  }

}
