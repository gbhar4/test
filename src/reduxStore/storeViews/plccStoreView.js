import Immutable from 'seamless-immutable';

export const plccStoreView = {
  getApplication,
  isApplicationApproved,
  isApplicationPending,
  isApplicationExisting,
  isApplicationError,
  isApplicationTimeout,
  getBirthDateOptionMap,

  isEligible,
  getStatus,
  getPrescreenCode,
  getCurrentCountry
};

// FIXME: im expecting this to be moved to the proper internationalization namespace
let MONTH_SHORT_FORMAT = Immutable({JAN: 'Jan',
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
  DEC: 'Dec'});

function getApplication (state) {
  return state.user.plcc.application;
}

function isApplicationApproved (state) {
  let app = getApplication(state);

  return !!app && app.status === 'APPROVED';
}

function isApplicationPending (state) {
  let app = getApplication(state);

  return !!app && app.status === 'PENDING';
}

function isApplicationExisting (state) {
  let app = getApplication(state);

  return !!app && app.status === 'EXISTING';
}

function isApplicationError (state) {
  let app = getApplication(state);

  return !!app && app.status === 'ERROR';
}

function isApplicationTimeout (state) {
  let app = getApplication(state);

  return !!app && app.status === 'TIMEOUT';
}

function isEligible (state) {
  return state.user.plcc.prescreenVerificationData.eligible;
}

function getStatus (state) {
  return state.user.plcc.prescreenVerificationData.status;
}

function getPrescreenCode (state) {
  return state.user.plcc.prescreenVerificationData.prescreenCode;
}

function getCurrentCountry (state) {
  return state.session.siteDetails.country;
}

function getBirthDateOptionMap () {
  let monthOptionsMap = [
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
    {id: '12', displayName: MONTH_SHORT_FORMAT.DEC}];

  let yearOptionsMap = [];
  let dayOptionsMap = [];
  let nowYear = (new Date()).getFullYear();

  for (let i = 1900; i < nowYear - 17; i++) {
    yearOptionsMap.push({id: i.toString(), displayName: i.toString()});
  }

  for (let i = 1; i < 32; i++) {
    if (i <= 9) { i = '0' + i; }
    dayOptionsMap.push({id: i.toString(), displayName: i.toString()});
  }

  return {
    daysMap: dayOptionsMap,
    monthsMap: monthOptionsMap,
    yearsMap: yearOptionsMap
  };
}
