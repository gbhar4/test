import {formAsyncValidators, formValidationRules, formValidationMessages} from './standardConfig';
import warning from 'warning';
import invariant from 'invariant';

export function getStandardConfig (fieldNames, options) {
  return {
    rules: getStandardConfigRules(fieldNames, false),
    messages: getStandardConfigMessages(fieldNames, true),
    asyncValidators: getStandardConfigAsync(fieldNames, true),
    options: options
  };
}

export function getStandardConfigMessages (fieldNames, ignoreErrors) {
  let result = {};
  for (let element of fieldNames) {
    let {fieldName, configName} = getFieldAndConfigNames(element, ignoreErrors);
    if (formValidationMessages[configName]) {
      result[fieldName] = formValidationMessages[configName];
    }
  }
  return result;
}

export function getStandardConfigRules (fieldNames, ignoreErrors) {
  let result = {};
  for (let element of fieldNames) {
    let {fieldName, configName} = getFieldAndConfigNames(element, ignoreErrors);
    if (formValidationRules[configName]) {
      result[fieldName] = formValidationRules[configName];
    }
    warning(typeof result[fieldName] !== 'undefined',
      `getStandardConfigRules: could not find a standard valdation rule named '${fieldName}'.`
    );
  }
  return result;
}

export function getStandardConfigAsync (fieldNames, ignoreErrors) {
  let result = {};
  for (let element of fieldNames) {
    let {fieldName, configName} = getFieldAndConfigNames(element, ignoreErrors);
    if (formAsyncValidators[configName]) {
      result[fieldName] = formAsyncValidators[configName];
    }
  }
  return result;
}

function getFieldAndConfigNames (element, ignoreErrors) {
  if (typeof element === 'string') {
    // element is the name of the form field as well as the name of the config entry
    return {fieldName: element, configName: element};
  }
  if (typeof element === 'object') {
    // element is actually a key-value pair mapping a form field name to a config entry name
    let elementKeys = Object.keys(element);
    invariant(ignoreErrors || elementKeys.length === 1,
      `getStandardConfigRules: an object of unknown structure found in parameters array: ${JSON.stringify(element, null, 2)}` +
      'Expecting a field name or a plain object that is a key-value pair (like {formFieldName: configFieldName})'
    );
    return {fieldName: elementKeys[0], configName: element[elementKeys[0]]};
  } else {
    invariant(ignoreErrors,
      `getStandardConfigRules: entry '${element}' of unexpected type found in parameters array`
    );
  }
}
