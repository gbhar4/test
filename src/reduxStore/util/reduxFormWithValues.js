/** @module reduxFormWithValues
 * @summary Provides two convenience functions for injecting the current values of a form's fields as props
 * of a form wrapped by a redux-form HOC.
 *
 * Since the redux-form HOC does not provide the current values of the form fields as props to the
 * form it wraps, in order to obtain these props one has to wrap the redux-form HOC with another HOC that pulls
 * this information from the redux store. This module provides two ways to help achieve this.
 *
 *  @author Ben
 */

import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import invariant from 'invariant';

/**
 * @summary A HOC that wraps a given form with a redux-form (using reduxForm()) and then wraps that with
 * another HOC (using react-redux connect()) that injects the current values of the specified form fields
 * to the original form inside a currentValues prop.
 *
 * Note: if you have to inject other props to your form based on values stored in the redux-store
 * (i.e., you have to use the react-redux connect() HOC for other purposes anyway) then it is better
 * NOT to use this function (to save one HOC wrapping) and use the {@linkcode getFormCurrentValuesProp} function
 * of this module instead.
 *
 * @param  {object} config  the same config object that one passes to reduxForm()
 *    Observe that config must contain a <code>form</code> property with the form's name.
 * @param  {Array.string} fieldNames the names of the fields (as in the <code>name</code> prop of
 *  the corresponding form's Field component) to inject props for.
 *  Note: when mapStateToProps calls this method for the first time the wrapped redux-form
 *   does not yet exist. Hence, the redux store has no values defined for any of the form fields yet,
 *   and the initial values of the fields (as specifid by config.initialValues) will be used.
 *
 * @return  A decorator HOC which accepts a form to wrap.
 *
 * @example adds a currenValues prop with the values of 2 fields
 *     // the config parameter should be created the same way as for a direct call to reduxForm()
 *   let MyFormContainer = reduxFormWithValues(config, ["color", "fit"])(MyForm)
 *     // inside MyForm the value of the color form field is available as this.props.currentValues.color
 *     // and the value of the fit form field as this.props.currentValues.fit
 */
function reduxFormWithValues (config, fieldNames) {
  if (!config.form) {
    invariant(true, `reduxFormWithValues: no form name given in config object\n' +
      'Make sure the config object contains a 'form' property`
    );
  }
  if (!config.initialValues) {
    invariant(true, `reduxFormWithValues: no initialValues specified in the config object of the form '${config && config.form}'\n' +
      'Make sure the config object contains an 'initialValues' property`
    );
  }

  return function (formToWrap) {
    return connect(mapStateToProps)(reduxForm(config)(formToWrap));
  };

  function mapStateToProps (state) {
    let fieldsToInject = Object.create(null);
    for (let i = 0; i < fieldNames.length; i++) {
      let fieldName = fieldNames[i];
      if (config.initialValues[fieldName]) {
        fieldsToInject[fieldName] = config.initialValues[fieldName];
      } else {
        invariant(true,
          `reduxFormWithValues: no initialValue specified for field '${config.form}' of the form '${config.form}'\n' +
          'Make sure the config object of this form contains an 'initialValues[${fieldName}]' property`
        );
        fieldsToInject[fieldName] = null;
      }
    }
    return getFormCurrentValuesProp(state, config.form, fieldsToInject);
  }
}

/**
 * @summary A function that returns an object with the current values of the specified form fields
 * of a given redux-form. To be used inside mapStateToProps that is passed to a react-redux connect() method.
 *
 * @param  {object} state     the state of the redux store
 * @param  {string} formName  the name of the form
 * @param  {object} fieldsToInject this is a simple object whose property names indicate the names of the
 *  form fields (as in the <code>name</code> prop of the corresponding form's Field component) to inject props for.
 *  The value of each such property is the initial value of that prop (as passed to the <code>initialValues</code> prop of the form).
 *  Note: these initial values are needed since when mapStateToProps calls this method for the first time the wrapped redux-form
 *   does not yet exist. Hence, the redux store has no values defined for any of the form fields yet.
 * @return an Object with a property called currentValues which has a nested property for each specified
 *  field name.
 *
 * @example
 *     // declare the name of the form in the container module
 *     // if you call reduxForm() in your form module, do not specify the name of the form there
 *   const FORM_NAME = 'MyForm';
 *     //-------
 *     // inside mapStateToProps do:
 *   return {
 *       // first pass any of the other props you need
 *       //-----
 *       initialValues {          // assign any relevant initial values to the form's fields
 *        color: initialColor,
 *        fit: initialFit,
 *        size: initialSize,
 *       }
 *     form: FORM_NAME,            // pass the name of the form
 *       ...getFormCurrentValuesProp(FORM_NAME, {'color': initialColor, 'fit': initialFit})
 *   }
 *     //-------
 *     // while wrapping the redux-form do not forget to give the form name
 *   let MyFormContainer = connect(mapStateToProps)(MyFormReduxFormWrapped);
 *     // inside MyForm the value of the color form field is available as this.props.currentValues.color
 *     // and the value of the fit form field as this.props.currentValues.fit
 */
function getFormCurrentValuesProp (state, formName, fieldsToInject) {
  if (typeof fieldsToInject === 'undefined') return;
  let selector = formValueSelector(formName);
  // invariant(!selector,
  //   `getFormCurrentValuesProp: Cannot select values of the form '${formName}'.\nMake sure there is a redux-form with this name in the redux store.`
  // );

  let currentValues = Object.create(null);
  let fieldNames = Object.keys(fieldsToInject);
  for (let i = 0; i < fieldNames.length; i++) {
    let fieldName = fieldNames[i];
    let fieldValue = selector(state, fieldName);
    currentValues[fieldName] = typeof fieldValue !== 'undefined' ? fieldValue : fieldsToInject[fieldName];
  }
  return ({currentValues: currentValues});
}

export {reduxFormWithValues, getFormCurrentValuesProp};
