export function getSetIsMobileActn (isMobile) {
  return {
    isMobile: isMobile,
    type: 'SESSION_SITEDETAILS_SET_ISMOBILE'
  };
}
export function getSetIsRopisEnabledActn (isRopisEnabled) {
  return {
    isRopisEnabled: isRopisEnabled,
    type: 'SESSION_SITEDETAILS_SET_IS_ROPIS_ENABLED'
  };
}

export function getSetCurrentSiteActn (siteId) {
  return {
    siteId: siteId,
    type: 'SESSION_SITEDETAILS_SET_SITE'
  };
}

export function getSetCurrentCountryActn (countryCode) {
  return {
    countryCode: countryCode,
    type: 'SESSION_SITEDETAILS_SET_COUNTRY'
  };
}

export function getSetCurrentLanguageActn (language) {
  return {
    currentLanguage: language,
    type: 'SESSION_SITEDETAILS_SET_LANGUAGE'
  };
}

export function getSetCurrentCurrencyActn (currency) {
  return {
    currentCurrency: currency,
    type: 'SESSION_SITEDETAILS_SET_CURRENT_CURRENCY'
  };
}

export function getSetIsRecapchaEnabledActn (isRecapchaEnabled) {
  return {
    isRecapchaEnabled: isRecapchaEnabled,
    type: 'GIFT_CARD_RECAPTCHA_ENABLED'
  };
}

export function getSetIsBopisEnabledActn (isBopisEnabled) {
  return {
    isBopisEnabled,
    type: 'SESSION_SITEDETAILS_SET_BOPIS_ENABLED'
  };
}

export function getSetIsBopisClearanceProductEnabledActn (isBopisClearanceProductEnabled) {
  return {
    isBopisClearanceProductEnabled,
    type: 'SESSION_SITEDETAILS_SET_BOPIS_CLEARANCE_ENABLED'
  };
}

export function getSetIsWicFormEnabledActn (isWicFormEnabled) {
  return {
    isWicFormEnabled,
    type: 'SESSION_SITEDETAILS_SET_WIC_ENABLED'
  };
}

export function getSetIsPrescreenFormEnabledActn (isPrescreenFormEnabled) {
  return {
    isPrescreenFormEnabled,
    type: 'SESSION_SITEDETAILS_SET_PRESCREEN_ENABLED'
  };
}

export function getSetIsCommunicationPreferencesEnabled (isCommunicationPreferencesEnabled) {
  return {
    isCommunicationPreferencesEnabled: isCommunicationPreferencesEnabled,
    type: 'SESSION_SITEDETAILS_SET_COMMUNICATION_PREFERENCES'
  };
}

export function getSetOriginSettingsAtcn (settings) {
  return {
    settings,
    type: 'SESSION_SITEDETAILS_SET_ORIGIN_SETTINGS'
  };
}
