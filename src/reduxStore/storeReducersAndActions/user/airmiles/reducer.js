import Immutable from 'seamless-immutable';

let studDefaultAirmilesStore = Immutable({
  promoId: null,
  accountNumber: null
});

const airmilesReducer = function (airmiles = studDefaultAirmilesStore, action) {
  switch (action.type) {
    case 'USER_PERSONALDATA_SET_AIRMILES_PROMO':
      return Immutable.merge(airmiles, { promoId: action.promoId });
    case 'USER_PERSONALDATA_SET_AIRMILES_ACCOUNT':
      return Immutable.merge(airmiles, { accountNumber: action.accountNumber });
    default:
      return airmiles;
  }
};

export * from './actionCreators';
export {airmilesReducer};
