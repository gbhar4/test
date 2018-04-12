/** @module LabeledCheckbox
 * @summary A React component rendering an checkbox field
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import invariantWarning from 'warning';
import {ErrorMessage, ERROR_FORM_NAME_DATA_ATTRIBUTE} from '../ErrorMessage.jsx';

/**
 * @summary A React component rendering an checkbox field with a  optional data .
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 * Any extra props (i.e., other than <code>type, title, subTitle, className, meta</code>),
 * e.g., <code>disabled, placeholder</code>, passed to this component will be passed along to the rendered <code>input</code> element.
 *
 * @example <caption>Usage</caption>
 * <LabeledCheckboxhButton name="fname" title="First Name" SubTitile={SubtTitle}>
 *
 * @example <caption>Usage with redux-form</caption>
 * import {Field} from 'redux-form';
 * //
 * <Field component={LabeledCheckboxhButton} className="input-first-name" name="fname" title="First Name" type="text"  />
 */
export class LabeledCheckbox extends React.Component {

  static propTypes= {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    className: PropTypes.string
  }

  static labeledCheckboxCount = 0;

  constructor (props) {
    super(props);

    this.state = {
      isFocused: false
    };

    this.labeledInputCount = LabeledCheckbox.labeledCheckboxCount++;
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

  render () {
    let {
      title, subtitle, className, input, // When using redux-form, is passed implicitly by a wrapping Field component
      showErrorIfUntouched,
      showWarningIfUntouched,
      meta, /* When using redux-form, is passed implicitly by a wrapping Field component */ // eslint-disable-line
      children,
      disabled,
      ...otherProps // all the extra props passed to this component (or the wrapping Field component when using redux-form)
    } = this.props;

    invariantWarning(!this.props.input || (typeof this.props.checked === 'undefined' && typeof this.props.defaultChecked === 'undefined'),
     'LabeledCheckbox: props contains an `input` prop (probably since inside a redux-form `Field`)' +
     ', in which case it should not have the `checked` or `defaultChecked` props');

    let {isFocused} = this.state;
    let {touched, error, warning} = meta || {};

    let showError = error && (touched || showErrorIfUntouched);
    let showWarning = !showError && warning && (touched || showWarningIfUntouched);
    // If there is an error then show it; otherwise, if there is a warning then show it
    let errorMessage = showError ? error : (showWarning ? warning : null);

    let dataAttributes = showError || showWarning
      ? { [ERROR_FORM_NAME_DATA_ATTRIBUTE]: meta.form || '' }
      : {};

    let inputChecked = (input && !!input.value);
    let containingClassName = cssClassName('label-checkbox input-checkbox ', className, {' label-error': showError, ' label-warning': showWarning});
    let inputClassName = cssClassName({'input-error': showError, 'input-warning': showWarning});
    let messageClassName = cssClassName('inline-', {'error-message': showError, 'warning-message': showWarning});
    let inputContainerClassName = cssClassName({'input-checkbox-disabled ': disabled, 'input-checkbox-icon-checked ': inputChecked, 'input-checkbox-icon-unchecked ': !inputChecked, 'input-checkbox-focused ': isFocused});
    let name = (input && input.name) ? input.name : otherProps.name;
    let uniqueId = `${name}_${this.labeledInputCount}`;
    // checked value comes from input prop (if wraped with a redux-form Field), otherwise as usual from checked attribute

    let errorUniqueId = 'error_' + uniqueId; // Unique Id to connect the error input with its error message. Both needs to be the same. Accessibility requirement. DT-30852

    /* MERDGE RESOLUTION FROM COMMIT -> https://bitbucket.org/TCP_BitBucket_Admin/thechildrensplace_ui/src/01ee9492e9fd824399d4b21702841b3beec08865/src/views/components/common/form/LabeledCheckbox.jsx?at=master&fileviewer=file-view-default */
    return (
      <div className={containingClassName}>
        <label htmlFor={uniqueId} {...dataAttributes} tabIndex="-1">
          <div className={inputContainerClassName}>
            <input {...otherProps} id={uniqueId} disabled={disabled} {...input} className={inputClassName} type="checkbox" checked={input && !!input.value} onFocus={this.handleFocus} onBlur={this.handleBlur} aria-describedby={errorUniqueId} />
          </div>
          {children && <div className="input-checkbox-title">{children}</div>}
          {title && <span className="input-checkbox-title">{title}</span>}
          {subtitle && <span className="input-subtitle">{subtitle}</span>}
        </label>
        {/* If there is an error then show it; otherwise, if there is a warning then show it */}
        <ErrorMessage isShowingMessage={!!showError || !!showWarning} errorId={errorUniqueId} className={messageClassName} error={showError ? error : warning} withoutErrorDataAttribute />
      </div>
    );
  }
}
