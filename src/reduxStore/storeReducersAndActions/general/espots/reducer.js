/** @module espots (aka content-slots) reducer
 *
 * @author Ben
 */
import Immutable from 'seamless-immutable';

export const ESPOT_TYPES = Immutable({
  GUEST: 'guest',
  REGISTERED: 'registered'
});

export const CONTENT_PAGE_CUSTOM_ESPOT_NAME = 'contentPage_a90f682c';

export function espotReducer (espots = Immutable({}), action) {
  switch (action.type) {
    case 'ESPOT_SET_VALUE':
      return setEspotValue(espots, action);
    case 'ESPOT_SET_TABLE':
      return Immutable({...espots, ...action.espotsTable});
    default:
      return espots;
  }
}

function setEspotValue (espots, action) {
  if (espots[action.name]) {
    // overwrite the value and type, but maintain the other table info
    return Immutable.set(espots, action.name, {...espots[action.name], value: action.value, currentType: action.typeOfValue, extraInfo: action.extraInfo});
  } else {
    // espots that have no prior data associated with them (i.e., not loaded during ESPOT_SET_TABLE)
    // have the same nameOnServer as the local name
    return Immutable.set(espots, action.name, {nameOnServer: action.name, value: action.value, currentType: action.typeOfValue, extraInfo: action.extraInfo});
  }
}

/*
// Initial table with no values
espots = {
   "bag_empty_banner": {
    "nameOnServer": "bag-empty-banner",
    "guest": "1",
    "registered": "1"
  },
  "bag_ledger_banner": {
    "nameOnServer": "bag-ledger-promo-banner",
    "guest": "1",
    "registered": "2"
  }
}

// table with values set using the ESPOT_SET_VALUE action
// plus an extra espot not in the original table that was set using ESPOT_SET_VALUE
espots = {
   bag_empty_banner: {
    nameOnServer: "bag-empty-banner",
    guest: "1",
    registered": "1"
    value: "<p>hi</p>",
    currentType: "guest"
  },
  "bag_ledger_banner": {
    nameOnServer: "bag-ledger-promo-banner",
    guest: "1",
    registered: "2"
    value: "<p>bye</p>",
    currentType: "guest"
  },
  "espot_not_in_table": {
    value: "<p>bye</p>",
    currentType: "guest"
  }
}
 */
