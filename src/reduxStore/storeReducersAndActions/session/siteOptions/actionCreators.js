export function getSetAvailableSitesActn (sitesTable) {
  return {
    sitesTable: sitesTable,
    type: 'SESSION_SITEOPTIONS_SET_AVAILABLE_SITES'
  };
}

export function getSetAvailableCurrenciesActn (availableCurrency) {
  return {
    availableCurrency: availableCurrency,
    type: 'SESSION_SITEOPTIONS_SET_AVAILABLE_CURRENCY'
  };
}

export function getSetAvailableCountriesActn (availableCountries) {
  return {
    availableCountries: availableCountries,
    type: 'SESSION_SITEOPTIONS_SET_AVAILABLE_COUNTRIES'
  };
}
