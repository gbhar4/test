/** @module LabeledRadioButton
 * @summary A React component rendering an RadioButton field
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import invariantWarning from 'warning';

/**
 * @summary A React component rendering an checkbox field with a  optional data .
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 * Any extra props (i.e., other than <code>title, subTitle, type, className, meta</code>),
 * e.g., <code>value, disabled, placeholder</code>, passed to this component will be passed along to the rendered <code>input</code> element.
 */
export class LabeledRadioButton extends React.Component {

  static propTypes= {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    className: PropTypes.string,
    /** The value of the radioButton (i.e., the value of the associated form field when this radio button is checked) */
    selectedValue: PropTypes.string.isRequired
  }

  static labeledRadioButtonCounter = 0;

  constructor (props) {
    super(props);

    this.state = {
      isFocused: false
    };

    this.labeledRadioButtonCounter = LabeledRadioButton.labeledRadioButtonCounter++;
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
      title,
      subtitle,
      className,
      input,                       // When using redux-form, is passed implicitly by a wrapping Field component
      meta,                        /* When using redux-form, is passed implicitly by a wrapping Field component */ // eslint-disable-line
      children,
      disabled,
      selectedValue,
      checked,
      style,
      ...otherProps               // all the extra props passed to this component (or the wrapping Field component when using redux-form)
    } = this.props;

    invariantWarning(!this.props.input || (typeof this.props.checked === 'undefined' && typeof this.props.defaultChecked === 'undefined'),
     'LabeledRadioButton: props contains an `input` prop (probably since inside a redux-form `Field`)' +
     ', in which case it should not have the `checked` or `defaultChecked` props');

    let {isFocused} = this.state;
    let inputChecked = (input && selectedValue === input.value || checked);
    let containingClassName = cssClassName('label-radio input-radio ', className);
    let inputContainerClassName = cssClassName({'input-radio-disabled ': disabled, 'input-radio-icon-checked ': inputChecked, 'input-radio-icon-unchecked ': !inputChecked, 'input-radio-focused': !children && isFocused});
    let inputChildrenClassName = cssClassName({'input-radio-title ': true, 'input-radio-focused ': children && isFocused});
    let name = (input && input.name) ? input.name : otherProps.name;
    let id = `${name}_${this.labeledRadioButtonCounter}`;

    return (
      <label htmlFor={id} className={containingClassName} style={style}>
        <div className={inputContainerClassName}>
          <input {...input} {...otherProps} id={id} disabled={disabled} type="radio" className={disabled ? 'disabled' : null}
            value={selectedValue} checked={input ? selectedValue === input.value : checked} onFocus={this.handleFocus} onBlur={this.handleBlur} />
        </div>
        {children && <div className={inputChildrenClassName}>{children}</div>}
        {title && <span className="input-radio-title">{title}</span>}
        {subtitle && <span className="input-subtitle">{subtitle}</span>}
      </label>
    );
  }

}
