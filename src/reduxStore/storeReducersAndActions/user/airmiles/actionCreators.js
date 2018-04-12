export function getSetAirmilesPromoIdActn (promoId) {
  return {
    promoId,
    type: 'USER_PERSONALDATA_SET_AIRMILES_PROMO'
  };
}

export function getSetAirmilesAccountActn (accountNumber) {
  return {
    accountNumber,
    type: 'USER_PERSONALDATA_SET_AIRMILES_ACCOUNT'
  };
}
