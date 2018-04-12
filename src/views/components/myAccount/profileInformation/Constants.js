// TODO: this should be moved somewhere else when integration of this components is done.
// I (Miguel) am putting it hear now because I couldn't figure out a better place.
import Immutable from 'seamless-immutable';

export const MYACCOUNT_PROFILE_INFO_VIEWS = Immutable({
  PROFILE: 'profile-information',
  BIRTHDAYS_SAVINGS: 'birthdays-savings'
});

export const MY_ACCOUNT_PROFILE_CHILD_GENDERS = Immutable({
  MALE: 'MALE',
  FEMALE: 'FEMALE'
});

// FIXME: (took this from checkoutStoreView) im expecting this to be moved to the proper internationalization namespace
export const MONTH_SHORT_FORMAT = Immutable({JAN: 'Jan',
  FEB: 'Feb',
  MAR: 'Mar',
  APR: 'Apr',
  MAY: 'May',
  JUN: 'Jun',
  JUL: 'Jul',
  AUG: 'Aug',
  SEP: 'Sep',
  OCT: 'Oct',
  NOV: 'Nov',
  DEC: 'Dec'
});
export const MONTH_OPTIONS_MAP = [
  {id: '1', displayName: MONTH_SHORT_FORMAT.JAN},
  {id: '2', displayName: MONTH_SHORT_FORMAT.FEB},
  {id: '3', displayName: MONTH_SHORT_FORMAT.MAR},
  {id: '4', displayName: MONTH_SHORT_FORMAT.APR},
  {id: '5', displayName: MONTH_SHORT_FORMAT.MAY},
  {id: '6', displayName: MONTH_SHORT_FORMAT.JUN},
  {id: '7', displayName: MONTH_SHORT_FORMAT.JUL},
  {id: '8', displayName: MONTH_SHORT_FORMAT.AUG},
  {id: '9', displayName: MONTH_SHORT_FORMAT.SEP},
  {id: '10', displayName: MONTH_SHORT_FORMAT.OCT},
  {id: '11', displayName: MONTH_SHORT_FORMAT.NOV},
  {id: '12', displayName: MONTH_SHORT_FORMAT.DEC}
];
