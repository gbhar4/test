import moment from 'moment';

export const validatorMethods = {
  required: requiredValidator,
  nonEmpty: nonEmptyValidator,
  checked: checkedValidator,
  regexValidator: regexValidator,
  email: emailValidator,
  multipleEmails: emailsValidator,
  minLength: minLengthValidator,
  maxLength: maxLengthValidator,
  exactLength: lengthValidator,
  number: numberValidator,
  phone: phoneValidator,
  zipcode: zipcodeValidator,
  stateRequired: stateRequiredValidator,
  anyZipcode: anyZipcodeValidator,
  address: addressValidator,
  message: messageValidator,
  name: nameValidator,
  city: cityNameValidator,
  expiration: expirationValidator,
  equalTo: equalToValidator,
  notEqualTo: notEqualToValidator,
  equalToTrimmed: equalToTrimmedValidator,
  cvvLength: cvvForTypeValidator,
  password: passwordValidator,
  legacyPassword: legacyPasswordValidator,
  cvvLengthThree: cvvLengthThreeValidator,
  cvvLengthFour: cvvLengthFourValidator,
  cardNumberForType: cardNumberForTypeValidator,
  plccEnabled: plccEnabledValidator,
  productColorAvailable: productColorAvailableValidator,
  productFitAvailable: productFitAvailableValidator,
  productSizeAvailable: productSizeAvailableValidator,
  productAvailable: productAvailableValidator,
  isPobox: poboxValidator,
  isNotPobox: notPoboxValidator,
  date: dateValidator,
  eitherRequired: eitherRequiredValidator,
  olderThan18: olderThan18Validator,
  maxDate: maxDateValidator,
  nonSequentialNumber: nonSequentialNumberValidator
};

function nonSequentialNumberValidator (value) {
  if (!value) {
    return true;
  }

  let isInvalid = /^([0-9])(\1\1\1)$/gi.test(value) || '0123456789012'.indexOf(value) > -1 || '9876543210987'.indexOf(value) > -1;
  return !isInvalid;
}

function requiredValidator (value, isRequired) {
  return !isRequired || (value || '').toString().length > 0;
}

function nonEmptyValidator (value, isRequired) {
  return !isRequired || (value.trim() || '').toString().length > 0;
}

function checkedValidator (value, checkedValue) {
  return value === checkedValue;
}

function regexValidator (value, regex) {
  return regex.test(value);
}

function emailValidator (value) {
  return /^(\s*)([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*)$/.test(value);
}

function emailsValidator (values) {
  let valuesArr = (values || '').split(',');
  let isValid = true;

  valuesArr.map((value) => {
    value = value.trim();
    isValid = isValid && (!value || emailValidator(value));
  });

  return isValid;
}

function cardNumberForTypeValidator (value, param, linkedProps) {
  let cleanValue = (value || '').replace(/\D/g, '');
  // no type, invalid CC numbr
  if (!linkedProps[0]) {
    return false;
  }

  return cleanValue.length === 0 ||
    (cleanValue.length === 15 && linkedProps[0] === 'AMEX') ||        // new amex card
    (/[\*]{11}\d{4}$/.test(value) && linkedProps[0] === 'AMEX') ||    // editing amex card

    (cleanValue.length === 16 && linkedProps[0] !== 'AMEX') ||        // new non-amex card
    (/[\*]{12}\d{4}$/.test(value) && linkedProps[0] !== 'AMEX' && linkedProps[0] !== null); // editing amex card
}

function plccEnabledValidator (value, param, linkedProps) {
  let cleanValue = (value || '').replace(/\D/g, '');
  return !(cleanValue.length > 0 && linkedProps[0] === 'PLACE CARD' && !linkedProps[1]);
}

function cvvLengthThreeValidator (value, param, linkedProps) {
  return (linkedProps[0] !== 'AMEX') ? (value || '').length === 3 : true;
}

function cvvLengthFourValidator (value, param, linkedProps) {
  return (linkedProps[0] === 'AMEX') ? (value || '').length === 4 : true;
}

function minLengthValidator (value, minLength) {
  return (value || '').length >= minLength;
}

function maxLengthValidator (value, maxLength) {
  return (value || '').length <= maxLength;
}

function lengthValidator (value, length) {
  var len = (value || '').length;
  return len === 0 || len === length;
}

function numberValidator (value) {
  return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
}

function zipcodeValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  value = (value || '').toUpperCase();
  let country = linkedFieldsValues[0] || linkedPropsValues[0];

  return (
    (country === 'US' && /^\d{5}-\d{4}$|^\d{5}$/.test(value) && value.substr(0, 5) !== '00000') ||
    (country === 'CA' && /^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/.test(value))
  );
}

function anyZipcodeValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  value = (value || '').toUpperCase();
  return /^\d{5}-\d{4}$|^\d{5}$/.test(value) || /^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/.test(value);
}

function phoneValidator (value) {
  if ((value || '').length === 0) {
    return true; // otherwise it's always mandatory
  }
  // (ddd) ddd-dddd or ddd-ddd-dddd
  let validFormat = /^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})[\- ]?[2-9]\d{2}-?\d{4}$/.test(value);

  if (!validFormat) {
    return false;
  }

  let numbersOnly = value.replace(/\D/g, '');
  let isInvalid = /^(\d)\1\1\1\1\1\1\1\1\1$/gi.test(numbersOnly) || '0123456789012345678'.indexOf(value) > -1 || '9876543210987654321'.indexOf(numbersOnly) > -1;
  return !isInvalid;
}

function addressValidator (value) {
  return /^[0-9a-zA-Z '\#\.\-\,]*$/.test(value);
}

function messageValidator (value) {
  return true; // FPO: need regex specs
}

function nameValidator (value) {
  return /^[a-zA-Z áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ]*$/.test(value);
}

function cityNameValidator (value) {
  return /^[a-zA-Z áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ '\#\.\-]*$/.test(value);
}

function passwordValidator (value) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[$@#%\^$<>.,!%*?&\-_\~\`\(\)\+\=\{\}\[\]\|\:;\"\'\/])[A-Za-z\d$@#%\^$<>.,!%*?&\-_\~\`\(\)\+\=\{\}\[\]\|\:;\"\'\/]{8,}$/g.test(value);
}

function legacyPasswordValidator (value) {
  return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@#%\^$<>.,!%*?&\-_\~\`\(\)\+\=\{\}\[\]\|\:;\"\'\/]{8,}$/g.test(value);
}

function expirationValidator (value, param, linkedPropsValues, datePieces) {
  let now = new Date();
  let nowYear = now.getFullYear();
  let nowMonth = now.getMonth();
  let month = datePieces[0] * 1;
  let year = datePieces[1] * 1;

  return !(year < nowYear || (year === nowYear && month < nowMonth + 1));
}

function equalToValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  return value === linkedFieldsValues[0];
}

function notEqualToValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  return value !== linkedFieldsValues[0];
}

function equalToTrimmedValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  return (value || '').trim() === (linkedFieldsValues[0] || '').trim();
}

function cvvForTypeValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  let typeFieldValue = linkedFieldsValues[0];
  let type = (typeFieldValue || '').toLowerCase();

  if (type === 'americanexpress' || type === 'amex') {
    return value.length === 4;
  } else {
    return value.length === 3;
  }
}

function productAvailableValidator (_, param, linkedPropsValues) {
  let colorFitsSizesMap = linkedPropsValues[0];
  return colorFitsSizesMap.findIndex((colorEntry) => colorEntry.maxAvailable > 0) >= 0;
}

function productColorAvailableValidator (value, param, linkedPropsValues) {
  let colorFitsSizesMap = linkedPropsValues[0];
  let currentColorInfo = colorFitsSizesMap.find((entry) => entry.color.name === value);
  return currentColorInfo && currentColorInfo.maxAvailable > 0;
}

function productFitAvailableValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  let colorFitsSizesMap = linkedPropsValues[0];
  let currentColorName = linkedFieldsValues[0];
  let currentColorInfo = colorFitsSizesMap.find((entry) => entry.color.name === currentColorName);
  // if the whole color is unavilable we consider the fit availability-wise valid (the color will fail availability validation)
  if (!currentColorInfo.hasFits || currentColorInfo.maxAvailable <= 0) {
    return true;
  }
  let currentFitEntry = currentColorInfo.fits.find((entry) => entry.fitName === value);
  return currentFitEntry && currentFitEntry.maxAvailable > 0;
}

function productSizeAvailableValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  let colorFitsSizesMap = linkedPropsValues[0];
  let currentColorName = linkedFieldsValues[0];
  let currentFitName = linkedFieldsValues[1];
  let currentColorInfo = colorFitsSizesMap.find((entry) => entry.color.name === currentColorName);
  if (!currentColorInfo) {
    return true;
  }
  let currentFitEntry = currentColorInfo.fits.find((entry) => entry.fitName === currentFitName);
  // if the whole fit is unavilable we consider the size availability-wise valid (the fit will fail availability validation)
  if (!currentFitEntry || currentFitEntry.maxAvailable <= 0) {
    return true;
  }
  let currentSizeEntry = currentFitEntry.sizes.find((entry) => entry.sizeName === value);
  return currentSizeEntry && currentSizeEntry.maxAvailable > 0;
}

function stateRequiredValidator (value, param, _, linkedFieldsValues) {
  return value || (linkedFieldsValues[0] !== 'US' && linkedFieldsValues[0] !== 'CA');
}

function poboxValidator (value) {
  // REVIEW: got the regex from: https://gist.github.com/gregferrell/7494667 seems to cover most use cases; not in the mood to write it from scratch
  return value.search(/\bbox(?:\b$|([\s|\-]+)?[0-9]+)|(p[\-\.\s]*o[\-\.\s]*|(post office|post)\s)b(\.|ox|in)?\b|(^p[\.]?(o|b)[\.]?$)/igm) >= 0;
}

function notPoboxValidator (value) {
  return !poboxValidator(value);
}

function dateValidator (value) {
  let check = false;
  let re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (re.test(value)) {
    let adata = value.split('/');
    let mm = parseInt(adata[0], 10);
    let dd = parseInt(adata[1], 10);
    let yyyy = parseInt(adata[2], 10);
    let xdata = new Date(yyyy, mm - 1, dd);
    if ((xdata.getFullYear() === yyyy) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === dd)) {
      check = true;
    } else {
      check = false;
    }
  } else {
    check = false;
  }
  return check;
}

function eitherRequiredValidator (value, param, linkedPropsValues, linkedFieldsValues) {
  return (value || linkedFieldsValues[0] || '').length > 0;
}

function olderThan18Validator (value, param, linkedPropsValues, linkedFieldsValues) {
  if (!linkedFieldsValues[0] || !linkedFieldsValues[1] || !linkedFieldsValues[2]) {
    return false;
  }

  let age = 18;
  let year = parseInt(linkedFieldsValues[0]);
  let month = parseInt(linkedFieldsValues[1]) - 1; // js counts month from 0
  let day = parseInt(linkedFieldsValues[2]);
  let mydate = new Date(year, month, day);

  if (mydate.getFullYear() !== year || mydate.getMonth() !== month || mydate.getDate() !== day) {
    return false;
  }

  var currdate = new Date();
  var setDate = new Date();
  setDate.setFullYear(mydate.getFullYear() + age, month, day);

  return ((currdate - setDate) > 0);
}

function maxDateValidator (e) {
  let value = moment(e);
  let maxDate = moment();

  if (value > maxDate) {
    return false;
  }

  return true;
}
