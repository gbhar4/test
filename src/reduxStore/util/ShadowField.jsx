/** @module ShadowField
 * @summary A component that wraps a form element <strong>that is not inside any redux-form</strong>
 * keeping its value synchronized with a given field in a given redux-form.
 *
 *  This component is mainly used to allow a display-only component, or an input element that is not inside any form, to automatically
 *  synchronize its value with a field in another form. It is possible to specify uni-directional (this component
 *  tracks the given form field but not the other way) or bi-directional tracking.
 *
 *  This component renders nothing as long as the tracked field does not have a defined non-null value (e.g., if the tracked
 *  field does not yet exist). This is not only semantically correct (how can one shadow nothnbg?) but is also prevents
 *  the rendered wrapped component from switching from being uncontrolled to being controlled (see https://reactjs.org/docs/forms.html).
 *
 *  In the rare occasion that you want a field inside one redux-form to track a field in another redux-form you should
 *  use AdaptiveFormPart instead.
 *
 *  Note that any extra props passed to this component are passed along to the wrapped component.
 *
 *  Also note that the wrapped component is assumed to be compatible with redux-form <code>Field</code>
 *
 *  @author Ben
 */
import React, {createElement} from 'react';
import {PropTypes} from 'prop-types';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart';

class _ShadowFieldWrapper extends React.Component {
  static propTypes = {
    /** the Component to wrap */
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    /** The name of the field to shadow */
    fieldName: PropTypes.string.isRequired,
    /** the name of the form containing the field to shadow */
    formName: PropTypes.string.isRequired,
    /** the tracked field's value */
    trackedFieldValue: PropTypes.any,
    /** Callback for changing a value in a form. Accepts: formName, fieldName, value  */
    changeFormField: PropTypes.func.isRequired,
    /** flags if the tracked field should also have its value track the value of this component's input.value prop */
    isBiDirectional: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this.handleWrappedElementChange = this.handleWrappedElementChange.bind(this);
  }

  handleWrappedElementChange (eventOrValue) {
    let {component, changeFormField, formName, fieldName, trackedFieldValue, isBiDirectional} = this.props;

    if (isBiDirectional) {
      let elementValue = getValue(eventOrValue);
      if (elementValue !== trackedFieldValue) {
        changeFormField(formName, fieldName, elementValue);        // update tracked field to the value of the wrapped element
      }
    }

    let onChange = (typeof component === 'string') ? this.props.onChange : this.props.input.onChange;
    onChange && onChange(eventOrValue);           // call any event listener that may have been passed down to us
  }

  render () {
    let {component, formName, fieldName, changeFormField, trackedFieldValue, isBiDirectional,   // eslint-disable-line no-unused-vars
      ...otherProps} = this.props;

    if (typeof trackedFieldValue === 'undefined' || trackedFieldValue === null) {
      return null;             // render nothing if tracked value does not exist yet
    }

    let extraInputProps = {onChange: this.handleWrappedElementChange, value: trackedFieldValue};
    if (typeof component === 'string') {           // a simple html component
      return createElement(component, {...otherProps, ...extraInputProps});
    } else {                                      // a React component - assumed to accept onChange and value inside <code>input</code>
      return createElement(component, {...otherProps, input: {...otherProps.input, ...extraInputProps}});
    }
  }

}

const ShadowFieldWrapper = getAdaptiveFormPart(_ShadowFieldWrapper, 'ShadowField');

class ShadowField extends React.Component {
  static propTypes = {
    /** the Component to wrap */
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    /** The name of the field to shadow */
    adaptToField: PropTypes.string.isRequired,
    /** the name of the form containing the field to shadow */
    adaptToForm: PropTypes.string.isRequired,
    /** flags if the tracked field should also have its value track the value of this component's input.value prop */
    isBiDirectional: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this.mapValuesToProps = this.mapValuesToProps.bind(this);
  }

  mapValuesToProps (values) {
    return {trackedFieldValue: values[this.props.adaptToField]};
  }

  render () {
    let {adaptToField, adaptToForm, ...otherProps} = this.props;
    return (
      <ShadowFieldWrapper adaptToForm={adaptToForm} adaptTo={adaptToField} mapValuesToProps={this.mapValuesToProps} includeChangeFormFieldProp
        fieldName={adaptToField} formName={adaptToForm} {...otherProps} />
    );
  }

}

function isEvent (eventOrSomethingElse) {
  return !!(eventOrSomethingElse && eventOrSomethingElse.stopPropagation && eventOrSomethingElse.preventDefault);
}

function getValue (eventOrValue) {
  if (!isEvent(eventOrValue)) {     // if parameter contains the value itself
    return eventOrValue;
  }

  let {nativeEvent, target, dataTransfer} = eventOrValue;
  if (nativeEvent && nativeEvent.text !== undefined) {
    return nativeEvent.text;
  } else if (target.type === 'checkbox') {
    return !!target.checked;
  } else if (target.type === 'file') {
    return target.files || (dataTransfer && dataTransfer.files);
  } else if (target.type === 'select-multiple') {
    let result = [];
    for (let option of target.options || []) {
      if (option.selected) {
        result.push(option.value);
      }
    }
    return result;
  } else {
    return target.value;
  }
}

export {ShadowField};
