export function getLoadSitePromoAction (sitePromos) {
  return {
    sitePromos: sitePromos,
    type: 'COUPONSANDPROMOS_LOAD_PROMOS'
  };
}

export function setStatus (promoCode, status) {
  return {
    promoCode: promoCode,
    status: status,
    type: 'COUPONSANDPROMOS_SET_STATUS'
  };
}

export function remove (promoCode) {
  return {
    promoCode: promoCode,
    type: 'COUPONSANDPROMOS_REMOVE'
  };
}

export function setError (promoCode, error) {
  return {
    promoCode: promoCode,
    error: error,
    type: 'COUPONSANDPROMOS_SET_ERROR'
  };
}

export function getSetIsLoadedActn (isLoaded) {
  return {
    isLoaded: isLoaded,
    type: 'COUPONSANDPROMOS_SET_IS_LOADED'
  };
}
