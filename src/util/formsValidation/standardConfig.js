import {GENERAL_ERROR_FIELD_NAME} from 'util/formsValidation/createValidateMethod';

export const formAsyncValidators = {
  emailAddress: 'asyncEmail'
};

// */ comment
export const formValidationRules = {
  distance: {
    required: true
  },
  addressLine1: {
    required: true,
    address: true,
    minLength: 5,
    maxLength: 30
  },
  addressLine2: {
    address: true,
    maxLength: 30
  },
  airMilesAccountNumber: {
    number: true,
    exactLength: 11
  },
  associateId: {
    required: true,
    number: true
  },
  cardNumber: {
    required: true,
    cardNumberForType: {
      linkedProps: ['cardType', 'isPLCCEnabled']
    },
    plccEnabled: {
      linkedProps: ['cardType', 'isPLCCEnabled']
    }
  },
  giftCardNumber: {
    number: true,
    required: true,
    exactLength: 19
  },
  cardPin: {
    required: true,
    number: true,
    exactLength: 4
  },
  currency: {
    required: true
  },
  couponCode: {
    required: true
  },
  city: {
    nonEmpty: true,
    city: true,
    maxLength: 20
  },
  state: {
    stateRequired: {
      linkedFields: ['country']
    }
  },
  cvv: {
    required: true,
    number: true,

    // not amex validation, validates length === 3 only if type is non amex, otherwise it passes validation
    cvvLengthThree: {
      linkedProps: ['cardType']
    },
    // amex validation, validates length === 4 only if type is amex, otherwise it passes validation
    cvvLengthFour: {
      linkedProps: ['cardType']
    }
  },
  confirmEmailAddress: {
    required: true,
    email: true,
    equalToTrimmed: {
      linkedFields: ['emailAddress']
    }
  },
  confirmPassword: {
    required: true,
    equalTo: {
      linkedFields: ['password']
    }
  },
  country: {
    required: true
  },
  emailAddress: {
    required: true,
    email: true
  },
  emailAddressNoAsync: {
    required: true,
    email: true
  },
  expMonth: {
    required: true,
    expiration: {
      linkedFields: ['expMonth', 'expYear'],
      depends: {
        expYY: {required: true}
      }
    }
  },
  expYear: {
    required: true,
    expiration: {linkedFields: ['expMonth', 'expYear']}
  },
  firstName: {
    nonEmpty: true,
    name: true,
    maxLength: 50
  },
  language: {
    required: true
  },
  wishlistName: {
    required: true
  },
  lastName: {
    nonEmpty: true,
    name: true,
    maxLength: 50
  },
  orderNumber: {
    required: true,
    minLength: 6,
    number: true
  },
  trackingNumber: {
    required: true,
    number: true
  },
  reservationOrderId: {
    required: true,
    minLength: 6,
    number: true
  },
  currentPassword: {
    required: true,
    password: true
  },
  password: {
    required: true,
    password: true
  },
  legacyPassword: {
    required: true
  },
  phoneNumber: {
    required: true,
    phone: true
  },
  productQuantity: {
    required: true
  },
  recaptchaToken: {
    required: true
  },
  productInventory: {
    productAvailable: {linkedProps: ['colorFitsSizesMap']}
  },
  productInventoryForAddToBag: {
    productAvailable: {linkedProps: ['colorFitsSizesMap']}
  },
  productColor: {
    required: {depends: GENERAL_ERROR_FIELD_NAME},
    productColorAvailable: {linkedProps: ['colorFitsSizesMap']}
  },
  productFit: {
    required: {
      linkedFields: ['color'],
      linkedProps: ['colorFitsSizesMap'],
      param: (linkedPropsValues, linkedFieldsValues) => {
        let currentColorInfo = linkedPropsValues[0].find((entry) => entry.color.name === linkedFieldsValues[0]);
        return currentColorInfo && currentColorInfo.hasFits;
      }
    },
    productFitAvailable: {linkedProps: ['colorFitsSizesMap'], linkedFields: ['color']}
  },
  productSize: {
    required: true,
    productSizeAvailable: {linkedProps: ['colorFitsSizesMap'], linkedFields: ['color', 'fit']}
  },
  shippingMethodId: {
    required: true
  },
  storeNumber: {
    required: true,
    minLength: 4,
    maxLength: 4,
    number: true
  },
  ssn: {
    required: true,
    exactLength: 4,
    number: true,
    nonSequentialNumber: true
  },
  mni: {
    name: true,
    maxLength: 3
  },
  termsAndConditions: {
    checked: true
  },
  plccAddressLine1: {
    required: true,
    address: true,
    isNotPobox: true,
    minLength: 5,
    maxLength: 30
  },
  plccAddressLine2: {
    address: true,
    isNotPobox: true,
    maxLength: 30
  },
  plccTermsAndConditions: {
    checked: true
  },
  zipCode: {
    required: true,
    zipcode: {
      linkedFields: ['country']
    }
  },
  zipcodeForUSorCA: {
    required: true,
    anyZipcode: true
  },
  zipCodeWithPropCountry: {
    required: true,
    zipcode: {
      linkedProps: ['country']
    }
  },

  phoneNumberWithAlt: {
    phone: true,
    eitherRequired: {
      linkedFields: ['altPhoneNumber']
    }
  },

  altPhoneNumber: {
    phone: true,
    eitherRequired: {
      linkedFields: ['phoneNumber']
    },
    notEqualTo: {
      linkedFields: ['phoneNumber']
    }
  },

  birthDate: {
    required: true,
    olderThan18: {
      linkedFields: ['birthYear', 'birthMonth', 'birthDay']
    }
  },

  prescreenCode: {
    exactLength: 12,
    number: true
  },

  message: {
    required: true
  },

  shareToEmailAddresses: { // FIXME: add validation as per requirements
    required: true,
    multipleEmails: true
  },

  shareFromEmailAddresses: { // FIXME: add validation as per requirements
    required: true,
    email: true
  },

  shareSubject: { // FIXME: add validation as per requirements
    required: true
  },

  shareMessage: { // FIXME: add validation as per requirements
    required: true
  },

  subject: {
    required: true
  },

  reasonCode: {
    required: true
  },

  bopisSearchColor: {
    required: true
  },

  bopisSearchFit: {
    required: {
      linkedFields: ['color'],
      linkedProps: ['colorFitsSizesMap'],
      param: (linkedPropsValues, linkedFieldsValues) => {
        let currentColorInfo = linkedPropsValues[0].find((entry) => entry.color.name === linkedFieldsValues[0]);
        return currentColorInfo && currentColorInfo.hasFits;
      }
    }
  },

  bopisSearchSize: {
    required: true
  },

  bopisSearchQuantity: {
    required: true
  }
};

export const formValidationMessages = {
  distance: 'Please select a distance',
  addressLine1: {
    required: 'Please enter a valid street address',
    address: 'The value entered in the street address has special character',
    minLength: 'Please enter a valid street address',
    maxLength: 'Please shorten the street address'
  },
  addressLine2: {
    address: 'The value entered in the street address has special character',
    maxLength: 'Please enter a valid street address'
  },
  airMilesAccountNumber: 'Please enter a valid 11 digit Air Miles ID',
  associateId: 'The Associate ID you entered does not exist. Please try again',
  cvv: {
    required: 'Please enter a valid security code',
    number: 'Please enter a valid security code',
    cvvLengthThree: 'Security code must be a 3-digit number without any spaces',
    cvvLengthFour: 'Security code must be a 4-digit number without any spaces'
  },
  cardNumber: {
    required: 'Please enter a valid credit card number',
    cardNumberForType: 'Please enter a valid credit card number',
    plccEnabled: 'This card can only be used when shopping the US store'
  },
  giftCardNumber: 'Please enter a valid gift card number',
  couponCode: {
    required: 'Please enter a valid code'
  },
  city: {
    nonEmpty: 'Please enter a valid city',
    city: 'The value entered in the city has special character',
    maxLength: 'Please enter a valid city'
  },
  country: {
    required: 'Please select a country'
  },
  confirmEmailAddress: {
    required: 'Please confirm your email address',
    email: 'Email addresses must match',
    equalToTrimmed: 'Email addresses must match'
  },
  confirmPassword: {
    required: 'Please enter a valid password.',
    equalTo: 'Passwords must match'
  },
  cardPin: 'Please enter your gift card pin number',
  currency: 'Please select a currency',
  emailAddress: {
    required: 'Please enter your email address',
    email: 'Email format is invalid.',
    async: 'Email format is invalid.'
  },
  emailAddressNoAsync: {
    required: 'Please enter a valid email',
    email: 'Email format is invalid.'
  },
  expYear: {
    required: 'Please enter a valid expiration date',
    expiration: 'Please enter a valid expiration date'
  },
  expMonth: {
    required: 'Please enter a valid expiration date',
    expiration: 'Please enter a valid expiration date'
  },
  firstName: {
    nonEmpty: 'Please enter a first name',
    name: 'First name field should not contain any special characters',
    maxLength: 'Please enter a valid first name'
  },
  language: 'Please select a language',
  wishlistName: 'Please enter name for the favorite list',
  lastName: {
    nonEmpty: 'Please enter a last name',
    name: 'Last name field should not contain any special characters',
    maxLength: 'Please enter a valid last name'
    // minLength: 'Please enter a valid last name'
  },
  orderNumber: 'Please enter the order number',
  trackingNumber: 'Please enter the order tracking number',
  reservationOrderId: {
    required: 'Please enter your reservation ID number',
    minLength: 'Please enter a valid reservation ID number',
    number: 'Please enter a valid reservation ID number'
  },
  currentPassword: {
    required: 'Please enter your password',
    password: 'Your current password is incorrect. Please try again.'
  },
  password: {
    required: 'Please enter your password',
    password: 'Please enter a valid password.'
  },
  phoneNumber: {
    required: 'Please enter your phone number',
    phone: 'Please enter a valid phone number'
  },
  phoneNumberWithAlt: {
    eitherRequired: 'Please enter your phone number',
    phone: 'Please enter a valid phone number',
    required: 'Please enter a valid phone number'
  },
  altPhoneNumber: {
    eitherRequired: 'Please enter your phone number',
    phone: 'Please enter a valid phone number',
    notEqualTo: 'Phone numbers must not match'
  },
  productInventory: {
    productAvailable: 'This item is sold out. Please remove from your bag to continue with checkout.'
  },
  productInventoryForAddToBag: {
    productAvailable: 'We\'re sorry, this item is out of stock.'
  },
  productColor: {
    required: 'Please select a Color',
    productColorAvailable: 'Error: We\'re sorry, this item is out of stock.'
  },
  productFit: 'Please select a fit',
  productSize: 'Please select a size',
  recaptchaToken: 'Please check the recaptcha value',
  state: {
    stateRequired: (linkedPropsValues, linkedFieldsValues) =>
    linkedFieldsValues[0] === 'US' ? 'Please select a state' : 'Please select a province'
  },
  shippingMethodId: 'Please select a shipping method',
  storeNumber: {
    required: 'Please enter the store number',
    maxLength: 'Please enter a valid store number',
    minLength: 'Please enter a valid store number',
    number: 'Please enter a valid store number'
  },
  ssn: {
    number: 'Please enter the last 4 digits of your social security number',
    exactLength: 'Please enter the last 4 digits of your social security number',
    required: 'Please enter the last 4 digits of your social security number',
    nonSequentialNumber: 'Please enter the last 4 digits of your social security number'
  },
  termsAndConditions: 'You must agree to the Terms and Conditions of the My Place Rewards program to create an account',
  agreeTermAndConditions: 'Please accept the terms by selecting the box above.',
  zipCode: {
    required: 'Please enter your zip code',
    zipcode: 'Please enter a valid zip code'
  },
  zipcodeForUSorCA: {
    required: 'Please enter your zip code',
    anyZipcode: 'Please enter a valid zip code'
  },
  zipCodeWithPropCountry: {
    required: 'Please enter your zip code',
    zipcode: 'Please enter a valid zip code'
  },
  plccAddressLine1: {
    isNotPobox: 'Please enter a valid address (no P.O. Boxes)',
    required: 'Please enter a valid street address',
    address: 'The value entered in the street address has special character',
    minLength: 'Please enter a valid value',
    maxLength: 'Please shorten the street address'
  },
  plccAddressLine2: {
    isNotPobox: 'Please enter a valid address (no P.O. Boxes)',
    address: 'The value entered in the street address has special character',
    maxLength: 'Please enter a valid value'
  },
  plccTermsAndConditions: 'You must agree to the Terms and Conditions to submit the form',
  birthDate: 'Please enter a valid date of birth',
  childName: {
    nonEmpty: 'Please enter a name',
    name: 'Child\'s name field should not contain any special characters',
    maxLength: 'Please enter a valid name'
  },
  digitalSignatureFirstName: {
    nonEmpty: 'Please enter a name',
    name: 'Child\'s name field should not contain any special characters',
    maxLength: 'Please enter a valid name'
  },
  gender: {
    required: 'Please select a gender'
  },
  message: {
    required: 'Please enter a message'
  },

  birthMonth: {
    required: 'Please select a month'
  },

  birthYear: {
    required: 'Please select a year'
  },
  mni: {
    name: 'The value has a special character',
    maxLength: 'Please enter a valid value'
  },

  shareToEmailAddresses: {
    required: 'Please enter one or more email addresses, separated by commas',
    multipleEmails: 'Please enter one or more email addresses, separated by commas'
  },

  shareFromEmailAddresses: {
    required: 'Please enter an email address', // FIXME: check copy deck,
    email: 'Email format is invalid'
  },

  shareSubject: 'Please enter a subject line for the email', // FIXME: check copy deck

  shareMessage: 'Please enter a message for the email', // FIXME: check copy deck

  subject: 'Please select a Subject',

  reasonCode: {
    required: 'Please select a Reason'
  },

  prescreenCode: {
    exactLength: 'Please enter a valid pre-screen code',
    number: 'Please enter a valid pre-screen code'
  },

  bopisSearchColor: 'Please select a color',
  bopisSearchFit: 'Please select a fit',
  bopisSearchSize: 'Please select a size'

};
