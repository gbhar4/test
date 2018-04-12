import {validatorDefaultMessages} from './validatorDefaultMessages.js';
import {validatorMethods} from './validatorMethods.js';
import {asyncValidatorMethods} from './asyncValidatorMethods.js';
import invariant from 'invariant';
import {getNestedInObject} from 'util/getNestedInObject';

export const GENERAL_ERROR_FIELD_NAME = '_error';

// The configuration object passed to createValidateMethod can contain the following keys:
// options, asyncValidators, rules, messages, where:
//
//  options: is a plain object of key/value pairs used to customize the validation, as follows:
//    stopOnFirstError: a boolean indicating whether validation should stop when the first error is found or not.
//
//  asyncValidators: is a plain object mapping form field names to asynchronous validation method names
//    (these are keys into the asyncValidatorMethods object exported by asyncValidatorMethods.js).
//
//  rules: is a plain object mapping form field names to objects that specify one or more synchronous validation rules.
//    I.e., each field may have multiple rules associated with it. Each rule is a plain object that maps a validation method
//    name (these are either keys into the validatorMethods object exported by validatorMethods.js, or custom names
//    which must begin with the string 'custom'), to a parameter that provides the information needed to invoke the validation method.
//    In simple cases parameter is just a value passed to the validator method: e.g., the rule: {maxLength: 7} specifies that the
//    maxLength validation method should be invoked with 7 as the maximum allowed length. In very simple cases, parameter is simply a
//    Boolean passed to the validation method that turns it on or off (e.g., in the rule {required: true}). In more complicated
//    cases parameter is a plain object that has any of the following keys: depends, linkedFields, linkedProps, param; where:
//      depends: is a plain object with the same (recursive) structure as the 'rules' key of this config object, which
//                serves as a more fancy on-off switch than the mere Boolean switch used in the simple case: if all the nested
//                rules found inside the 'depends' key evaluate to true then the validation method of this rule will be called,
//                and otherwise it will not be called;
//      linkedFields: (relevant only for non-custom validation methods) an array of form field names whose values will be passed
//                    to the validation method;
//      linkedPropss:  (relevant only for non-custom validation methods) an array of form prop names whose values will be passed
//                    to the validation method;
//      param: this can be one of three things, depending on whether the validator method is standard or custom:
//              (1) a value to be passed to the validation method --- note that this is useful when we cannot have
//                parameter take this role since we need to use it to specify depends, linkedFields or linkedProps --- e.g., the
//                rule {maxLength: {depends: {name: {required: true}}} param: 7} specifies that the maxLength validation method
//                will be called with a maximum length of 7 (but only if the name field passes the 'required' validation method).
//              (2) a function that accepts the parameters linkedPropsValues, linkedFieldsValues (see the description of standard
//                validation methods parameters below for more on these) and returns a value that will be used as in item (1).
//                E.g., {maxLength : {linkedFields: ['x'], param: (linkedFieldsValues) => linkedFieldsValues.x + 1}}
//              (3) For a custom validation method, options (1) and (2) are not available, and the value of param.param should be
//                the custom validation method. Note that this is only needed if parameter could not be used for this purpose
//                since it had to be an object in order to specify 'depends'.
//
// messages: is a plain object mapping form field names to error descriptions. Each error description is either:
//            (1) a string specifying an error message to be shown when the field failed validation, regardless of the reason
//              (e.g. {name: 'Please enter a (valid) name'});
//            (2) a plain object that maps validation method names (as used in the rules key above), or the special name 'async',
//            to an error message string (or a custom function returning such a string --- see below for its parameters)
//            specific to that validation method's failure (e.g. name: {requird: 'Please enter a name', maxLength:
//            'Please enter a shorter name'});
//            Note that the special name 'async' can only accept an error string, not a function, and that if it is specified
//            then this string will take precedence over the error message which the async. validation my reject with.
//
// Async. validation methods accept the following parameters: fieldValue, values, dispatch, props, blurredField; where:
//    fieldValue: is the value of the field the validation method is called for (the name of this field is found in BlurredField);
//    values: is an object mapping every field name in the form to its value;
//    dispatch: is the dispatch method of the redux-store;
//    props: are the props passed to the form;
//    blurredField: is the name of the field whoes blurring triggered the async. call (usefull mainly in case the
//                    same async. method is associated with more than one form field).
// Async. validation methods should return a Promise that is resolved if the validation passed (the resolved value is ignored),
//  and otherwise reject with an optional error message string.
//
// Custom validation methods accept the following prameters: values, props, validatorMethods; where
//    values: is an object mapping every field name in the form to its value;
//    props: the props passed to the form;
//    validatorMethods: the table of built in validator methods (see validatorMethods.js). Used to invoke such methods as helpers.
// Custom validation methods should return a Boolean that is true if the validation was passed, and false otherwise.

// Standard validation methods (i.e., ones corresponding to rule names found in the validatorMethods
// table) accept the following parameters: fieldValue, param, linkedPropsValues, linkedFieldsValues; where
//    fieldValue: is the value of the field the validation method is called for;
//    param: a custom extra parameter. This is either the value associated with the ruleName (see parameter and parameter.param
//            in the description of the 'rules' key above). For example, the rule name: {required: true} will pass true as the
//            param to the 'required' validator method) or, if that value is itself an object and it contains a 'param' key, then
//            it will be the value of that key (e.g., the rule name: {required: {linkedProps: 'x', param: 7}} will pass 7 as the param).
//    linkedPropsValues: an array containing the values of the form props specified by the 'linkedProps' array (in the same order)
//    linkedFieldsValues: an array containing the values of the form fields specified by the 'linkedFields' array (in the same order);
// Standard validation methods should return a Boolean that is true if the validation was passed, and false otherwise.
//
// Custom error-message functions accept the parameters: linkedPropsValues, linkedFieldsValues (see the description of standard
//  validation methods parameters above for more on these), and return an error-message string.
//  These methods are called only if the associated validation was not passed.
/**
let validator = createValidateMethod({
  asyncValidators: {
    emailAddress: 'asyncEmail'
  },
  messages: {
    email: {
      required: 'Please enter an email address',
      async: 'Please eneter a valid email address'
    }
    firstName: {
      required: 'Please enter your first name',
      name: 'Please enter a valid first name',
      minLength: 'Please enter a valid first name'
    },
    lastName: {
      required: 'Please enter your last name',
      name: 'Please enter a valid last name',
      minLength: 'Please enter a valid last name'
    }
  }
  rules: {
    firstName: {required: true, minLength: 5, maxLength: 30, name: true},
    lastName: {required: true, minLength: 5, maxLength: 30, name: true},
    address1: {
      required: true,
      address: {
        depends: {
          pobox: {checked: true}
        }
      },
      number: {
        depends: {
          pobox: {checked: false}
        }
      }
    },
    expMM: {
      required: true,
      expiration: {
        linkedFields: ['expMM', 'expYY'],
        depends: {
          expYY: {required: true}
        }
      }
    },
    expYY: {
      required: true,
      expiration: {linkedFields: ['expMM', 'expYY']}
    },
    zipCode: {
      required: true,
      zipcode: {
        linkedProps: ['country']      // the zipcode validator will get the value of this.props.country
      }
    },
    confirmPassword: {
      custom: function (formValues) {
        return formValues.password === formValues.confirmPassword;
      },
      // equivalent way to write it (based on pre-existing rules)
      equalTo: {
        linkedFields: ['password']
      },
      // more complex example (with depends)
      custom_additionalLengthRule: {
        depends: {password: {required: true}},
        param: function (values) {
          // some custom validation
          values.confirmPassword.length === 6;
        }
      },
      // equivalent way to write custom + depends as a single custom
      custom_anotherOptionForAdditionalLengthRule: function (formValues) {
        return (formValues.password || '').length === 0 || (formValues.confirmPassword || '').length === 6;
      }
    }
  },
});

  Example with FormSections:
    Assume form has a firstName and lastName fields, and a FormSection called 'shippingAddress'
    that has inside it an address1 field:

  let validator = createValidateMethod({
    rules: {
      firstName: {required: true},
      lastName: {required: true}
    },
    messages: {
      firstName: {required: 'Please enter your first name'},
      lastName: {required: 'Please enter your last name'}
    },
    shippingAddress: {
      rules: {
        address1: {required: true, address: true}
      },
      messages: {
        address1: {required: 'Please enter your street address'}
      }
    }
  }
);
*/

const EMPTY_ARRAY = [];
const DEFAULT_OPTIONS = {
  stopOnFirstError: false
};

// TODO: rename to getValidateionMethods
export function createValidateMethod (config) {
  let asyncRules = getFlatAsyncRules({fullFieldNames: [], validatorsTable: {}}, '', config);
  if (asyncRules.fullFieldNames.length <= 0) {
    return {
      validate: validateSection.bind(null, config)
    };
  } else {
    return {
      validate: validateSection.bind(null, config),
      asyncValidate: combineAsyncValidators(asyncRules.validatorsTable),
      asyncBlurFields: asyncRules.fullFieldNames
    };
  }
}

// extract all async rules in the given section and store them in the accumulator object
// under the full path name of each field.
function getFlatAsyncRules (accumulator, fieldNamesPrefix, sectionConfig) {
  let {rules, messages, asyncValidators, options, ...subSections} = sectionConfig;    // eslint-disable-line no-unused-vars

  if (asyncValidators) {
    // for every async validator specified for this section
    for (let fieldName of Object.keys(asyncValidators)) {
      let fullFieldName = fieldNamesPrefix + fieldName;
      let message = messages && (messages[fieldName] && messages[fieldName]['async']);
      invariant(!message || typeof message === 'string',
        'createValidateMethod, getFlatAsyncRules: messages.async must be a string ' +
        '(consider having the asynchronous validation method reject with the required error message instead)');
      // associate in acumulator the validator method and optional error message with the full field name
      accumulator.validatorsTable[fullFieldName] = {
        validatorName: asyncValidators[fieldName],
        message: message
      };
      // add full field name to list of fields with async validation
      accumulator.fullFieldNames.push(fullFieldName);
    }
  }
  for (let sectionName of Object.keys(subSections)) {     // for every subSections
    // accumulate the async rules of that sub-section
    getFlatAsyncRules(accumulator,
      fieldNamesPrefix + sectionName + '.', subSections[sectionName]);
  }
  return accumulator;
}

/**
 * @summary combines multiple async. validation methods into a single one
 * (similar to combineReducers in redux).
 *
 * This function accepts a table mapping form field names to asynchronous validation methods.
 * Each such method should return a promise that resolves if the validation succeeded,
 * or reject with an error message.
 * The mothod will receive the following parameters:
 *  <code>value, values, dispatch, props, blurredField</code> where:
 *  <code>value</code> is the value of the field that triggered the validation call;
 *  <code>allValues</code>: are all the values of all the form fields;
 *  <code>dispatch</code> is the redux store dispatch method;
 *  <code>props</code> are the props passed to the form;
 *  <code>blurredField</code> is the full field name.
 *  @see the <code>asyncValidate</code> prop of redux-form for more info.
 *
 * @example <caption>creating an async. validation method that runs <code>validateEmail</code>
 *          when the email field blurs, and <code>validateName</code> when userName changes.
 *          </caption>
 *          let asyncValidator = combineAsyncValidators({email: validateEmail, userName:validateName});
 *
 * @param  {Object} ValidatorsTable a plain object mapping form field names to methods, and error messages.
 *                                  Note that if the form contains sections, then an absolute name
 *                                  (like 'shipping.address.') should be used
 * @return {function}   an asynchronous validation method that will run the appropriate method
 *                      when the relevant field blurs.
 */
function combineAsyncValidators (validatorsTable) {
  return function (values, dispatch, props, blurredField) {
    // FIXME: Ben, it's triggering on hit of submit and on blur when on int3 / uatlive3, but not in local.
    // We need to look into this issue, but as of now I need to get it working.
    // I'm not sure what would cause this issue.
    if (!blurredField || !validatorsTable[blurredField]) {
      return Promise.resolve();
    }

    let {validatorName, message} = validatorsTable[blurredField];
    let validator = asyncValidatorMethods[validatorName];
    if (validator) {
      return validator(getNestedInObject(values, blurredField), values, dispatch, props, blurredField)
      .catch((error) => {
        throw (getAsyncErrorObject(blurredField, getAsyncErrorMessage(message, error)));
      });
    } else {
      return Promise.resolve();
    }
  };
}

function getAsyncErrorObject (fullFieldName, value) {
  let pathParts = fullFieldName.split('.');
  let result = Object.create(null);
  let currentSection = result;
  for (let i = 0; i < pathParts.length - 1; i++) {
    let sectionName = pathParts[i];
    currentSection[sectionName] = Object.create(null);
    currentSection = currentSection[sectionName];
  }
  currentSection[pathParts[pathParts.length - 1]] = value;
  return result;
}

function validateSection (sectionConfig, values, props) {
  let {rules, messages, asyncValidators, options, ...subSections} = sectionConfig;    // eslint-disable-line no-unused-vars

  let errors = evaluateAllSyncRules(rules, messages, options, values, props);     // get errors for this section
  if (values) {
    for (let sectionName of Object.keys(subSections)) {     // for every subSections
      // get errors for subsection and insert them into our errors under the subsection's name
      // values[sectionName] || {} in case no such section exists inside values
      // (e.g., if section has no default values and user did not change any field in it)
      errors[sectionName] = validateSection(subSections[sectionName], values[sectionName] || {}, props);
    }
  }
  return errors;
}

function evaluateAllSyncRules (rules = {}, messages = {}, options = DEFAULT_OPTIONS, values = {}, props) {
  // returns true iif evaluation of all rules is true
  let errors = {};

  // note that we do not use a for-in loop, since the order of traversal is not guaranteed by it
  for (let fieldName of Object.keys(rules)) {
    let fieldRules = rules[fieldName];

    // note that we do not use a for-in loop, since the order of traversal is not guaranteed by it
    for (let ruleName of Object.keys(fieldRules)) {
      let validator = validatorMethods[ruleName];
      invariant(typeof validator === 'function' || isCustomRule(ruleName),
        `createValidateMethod, evaluateAllSyncRules: unknown validation rule name '${ruleName}'`);
      let param = fieldRules[ruleName];
      invariant(!isCustomRule(ruleName) || typeof param === 'function' || (param && typeof param.param === 'function'),
        `createValidateMethod, evaluateAllSyncRules: custom validation rule '${ruleName}' has value of type '${typeof param}', expected 'function' or an object with a 'param' field that is a function`);

      let linkedRulesValidated = true;
      if (param.depends) {
        invariant(typeof param.depends === 'string' || typeof param.depends === 'object',
          `createValidateMethod, evaluateAllSyncRules: custom validation rule '${ruleName}' has a 'depends' field of type '${typeof param}', expected a field name or an object of nested rules`);
        let dependencyRules = (typeof param.depends === 'string') ? {[param.depends]: rules[param.depends]} : param.depends;
        // recursive call (the flag is true if the recursive call returned an empty object, i.e., no errors)
        linkedRulesValidated = Object.keys(evaluateAllSyncRules(dependencyRules, messages, {...options, stopOnFirstError: true}, values, props)).length === 0;
      }

      let linkedFieldsValues = param.linkedFields ? param.linkedFields.map((linkedFieldName) => values[linkedFieldName]) : EMPTY_ARRAY;
      let linkedPropsValues = param.linkedProps ? param.linkedProps.map((linkedPropName) => props[linkedPropName]) : EMPTY_ARRAY;
      let isFieldInvalid = false;
      if (isCustomRule(ruleName)) {
        if (typeof param === 'function') {
          isFieldInvalid = linkedRulesValidated && !param(values, props, validatorMethods);
        } else if (typeof param.param === 'function') {
          isFieldInvalid = linkedRulesValidated && !param.param(values, props, validatorMethods);
        }
      } else {        // standard (i.e., not custom validator)
        let validationParam = param.param || param;
        if (typeof param.param === 'function') {
          // for standard validators, if param.param is a method then it returns the extra param for the validator
          validationParam = param.param(linkedPropsValues, linkedFieldsValues);
        }
        isFieldInvalid = linkedRulesValidated &&
          !validator(values[fieldName] || '', validationParam, linkedPropsValues, linkedFieldsValues);
      }

      if (isFieldInvalid) {
        errors[fieldName] = getErrorMessage(messages, fieldName, ruleName, linkedPropsValues, linkedFieldsValues);
        break;        // we only need the first error for each field
      }
    }
    if (options.stopOnFirstError && errors[fieldName]) break;
  }
  return errors;
}

function isCustomRule (ruleName) {
  return ruleName.startsWith('custom');
}

function getErrorMessage (messages, fieldName, ruleName, linkedPropsValues, linkedFieldsValues) {
  let specificMessage = (messages[fieldName] && messages[fieldName][ruleName]) || messages[fieldName];
  if (typeof specificMessage === 'function') {
    return specificMessage(linkedPropsValues, linkedFieldsValues);
  } else {
    return specificMessage || validatorDefaultMessages[ruleName] || validatorDefaultMessages.genericError;
  }
}

function getAsyncErrorMessage (configMessage, validatorReturnedMessage) {
  return configMessage || validatorReturnedMessage || validatorDefaultMessages.genericError;
}
