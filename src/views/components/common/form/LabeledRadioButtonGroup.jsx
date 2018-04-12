/** @module LabeledRadioButtonGroup
 * @summary A React component rendering a radio button group.
 *
 * Note that this component is meant to be used with Redux-Forms, and will almost always be wrapped by a {@linkcode module:redux-form.Field}.
 * Also note that this is a `controlled` React component. Thus, it does not store the selected value. It only renders the selected value
 * as given by the <code>this.props.input.value</code> prop. In particular, when the user selects a new item, this component simply calls the
 * <code>this.props.input.onChange</code> event handler. In order for the user to see the new selected value rendered, this handler must
 * cause a re-render of this component, passing it an <code>input.value</code> with the new value (this is done automatically if this component
 * is wrapped by a Redux-Forms <code>Field</code>).
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 * Any extra props (i.e., other than <code>disabled, optionsMap, className, tabIndex, input, meta, isHideIfEmptyOptionsMap</code>),
 * e.g., <code>aria-label</code>, passed to this component will be passed along to the containing <code>div</code> element.
 *
 * @author Miguel (based on Ben's CustomSelect)
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {LabeledRadioButton} from './LabeledRadioButton.jsx';
import {ErrorMessage, ERROR_FORM_NAME_DATA_ATTRIBUTE} from '../ErrorMessage.jsx';

export class LabeledRadioButtonGroup extends React.Component {

  static propTypes = {
    /** an optional text to display in the label for this component. */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /** <code>true</code> if this element is disabled  */
    disabled: PropTypes.bool,

    /**
     * The CSS class to use for this element when the dropdown is expanded.
     *
     * The class names for other parts/states of this element are derived by appendig the following strings:
     * <code>'-title'</code>: the CSS class to use for the title element
     * <code>'-items-list'</code>: the CSS class to use for the container element of all the items
     * <code>'-item'</code>: the CSS class to use for an unselected item
     * <code>'-disabled'</code>: the CSS class to use for this element if the whole LabeledRadioButtonGroup is disabled
     * <code>'-selected'</code>: the CSS class to use for a selected item
     * <code>'-disabledOption'</code>: the CSS class to use for a disabled item
     *
     * Note that the -selected, -disabled and -disabledOption will be added (instead of replace), as needed.
     */
    className: PropTypes.string.isRequired,

    /**
     * The list of items to show.
     * Note that this map must be immutable. I.e., any change to the list of items in this component's radios should be performed
     * by changing the array passed as this prop.
     *
     * This is an array of plain objects, each representing one option. Each object has three fields, as follows:
     *  value: the internal value representing this item. This is not shown to the user, and is essentially the id used in javascript
     *         code to identify this item. This is similar to the <code>value</code> attribute of an HTML <code>input[type="radio"]</code> element.
     *  title: This is what the user sees if the item is the selected item.
     *         Note that this must be either a string or an inline element (i.e., one that can be rendered inside a <code>span</code>).
     *  content: Optional element to include as children of each LabeledRadioButton
     *  disabled: Flags if this option cannot be selected.
     *
     * @example <caption>Simple two gift wrapping options</caption>
     * let optionsMap = [
     *    {value: 'diy', title: 'Do It Yourself (DIY)'},
     *    {value: 'wrap', title: 'We’ll Wrap It For You', disabled: true}
     *    {value: 'message', title: 'Gift Receipt and Message'}
     * ];
     */
    optionsMap: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
      content: PropTypes.element,
      disabled: PropTypes.bool
    })).isRequired,

    /** Flags if to hide this component when the optionsMap is empty */
    isHideIfEmptyOptionsMap: PropTypes.bool,

    /**
     * If using Redux-forms, this is passed down to this object automatically by the enclosing <code>Field</code> component.
     */
    input: PropTypes.shape({
      /** The value of the selected item. */
      value: PropTypes.string.isRequired,
      /** The name for all the radio inputs to render (a random string will be appended to it to ensure uniqueness) */
      name: PropTypes.string.isRequired,
      /** Called when the selected item of this component is changed by the user. Passed in by an enclosing Redux-Form <code>Field</code> */
      onChange: PropTypes.func
    }),

    /** the HTML tabing index of the first radio button of this componet, if not defined, this component uses <code>tabindex=0</code> */
    tabIndex: PropTypes.number,

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

    /**
     * If <code>true</code>, show the selected value as part of the title in the
     * label. Defaults to true.
     */
    isShowSelectedValueInLabel: PropTypes.bool
  }

  static defaultProps = {
    isShowSelectedValueInLabel: true
  }

  static radioGroupCounter = 0;

  constructor (props) {
    super(props);
    this.containerDivRef = null;                        // the HTML DOM element of the containing div element of this component

    this.groupName = `${props.input.name}_${LabeledRadioButtonGroup.radioGroupCounter++}`;         // make sure the name of the group is different even if the parent form is reused

    // bind methods that are passed as callbacks
    this.captureContainerDivRef = this.captureContainerDivRef.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
  }

  captureContainerDivRef (ref) {
    this.containerDivRef = ref;
  }

  // returns the index of the item with the given value in the given optionsMap
  getIndexOfValue (optionsMap, value) {
    return this.props.optionsMap.findIndex((item) => item.value === value);
  }

  // returns the title of the item with the given value in the given optionsMap
  getTitleOfValue (optionsMap, value) {
    let option = this.props.optionsMap.find((item) => item.value === value);
    return option ? option.title : '';
  }

  // assign focus to this component
  focus () {
    this.containerDivRef.focus();
  }

  // handles changes of checked radio
  handleItemChange (event) {
    this.setValue(event.target.value);       // set the value of this component to the value of the clicked item
  }

  // select the item with the given value
  setValue (value) {
    if (this.props.input && this.props.input.value !== value) {       // if the value to select is not the current value of this component
      // notify our listeners that the user wants the value of this component to change
      if (this.props.input.onChange) this.props.input.onChange(value);
    }
  }

  render () {
    let {
      title,
      tabIndex,
      showErrorIfUntouched,
      showWarningIfUntouched,
      disabled,
      className,
      optionsMap,
      input: {value},
      /* we do not want the props in the next line to be part of otherProps */
      meta, // eslint-disable-line no-unused-vars
      isHideIfEmptyOptionsMap,
      isShowSelectedValueInLabel,
      ...otherProps
    } = this.props;

    if (isHideIfEmptyOptionsMap && optionsMap.length === 0) {
      return null;        // render nothing
    }

    meta = meta || {};            // meta may be undefined if this component is not wrapped with a redux-form Field HOC
    let {touched, error, warning} = meta;

    let showError = error && (touched || showErrorIfUntouched);
    let showWarning = !showError && warning && (touched || showWarningIfUntouched);
    // If there is an error then show it; otherwise, if there is a warning then show it
    let errorMessage = showError ? error : (showWarning ? warning : null);

    let messageClassName = cssClassName('inline-', {'error-message': showError, 'warning-message': showWarning});
    let dataAttributes = showError || showWarning
      ? { [ERROR_FORM_NAME_DATA_ATTRIBUTE]: meta.form || '' }
      : {};

    let appliedTabIndex = disabled ? -1 : tabIndex || 0;
    let containingClassName = cssClassName(className + '-container' + ' ', className, {'-disabled': disabled});
    let selectedOptionTitle = isShowSelectedValueInLabel ? this.getTitleOfValue(optionsMap, value) : null;
    let errorUniqueId = 'error_' + this.groupName; // Unique Id to connect the error input with its error message. Both needs to be the same. Accessibility requirement. DT-30852

    return (
      <div {...otherProps} ref={this.captureContainerDivRef} className={containingClassName} {...dataAttributes}>
        {title && <span className={className + '-title'}>{title}</span>}
        {selectedOptionTitle && <span className="selected-option">{selectedOptionTitle}</span>}
        <div className={className + '-items-list'}>
          {optionsMap.map((option, index) => (
            <LabeledRadioButton key={option.value} aria-describedby={errorUniqueId}
              name={this.groupName} checked={value === option.value} onChange={this.handleItemChange}
              selectedValue={option.value} tabIndex={appliedTabIndex + index}
              disabled={option.disabled}
              className={cssClassName(className + '-item ',
                className, {' item-selected-option': option.value === value}, {' item-disabled-option': option.disabled})}>
              {option.content}
            </LabeledRadioButton>
          ))}
        </div>

        <ErrorMessage error={errorMessage} errorId={errorUniqueId} className={messageClassName} withoutErrorDataAttribute />
      </div>
    );
  }

}
