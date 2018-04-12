export const userStoreView = {
  getUserContactInfo,
  getUserEmail,
  getUserPhone,
  getUserIsPlcc,
  getUserPlccCardId,
  getUserPlccCardNumber,
  getUserId,
  isGuest,
  isRemembered,
  isExpressEligible,
  getAirmilesDetails,
  getChildren,
  getAssociateId,
  getPointsHistoryPages,
  getPointsHistoryTotalPages
};

function getUserContactInfo (state) {
  return state.user.personalData.contactInfo;
}

function getUserId (state) {
  return state.user.personalData.userId;
}

function getUserEmail (state) {
  return !isGuest(state) || isRemembered(state) ? getUserContactInfo(state).emailAddress : '';
}

function getUserPhone (state) {
  return !isGuest(state) ? getUserContactInfo(state).phoneNumber : '';
}

function getUserIsPlcc (state) {
  return state.user.personalData.isPlcc;
}

function getUserPlccCardId (state) {
  return state.user.personalData.plccCardId;
}

function getUserPlccCardNumber (state) {
  return state.user.personalData.plccCardNumber;
}

function isGuest (state) {
  return state.user.personalData.isGuest;
}

function isRemembered (state) {
  return state.user.personalData.isRemembered;
}

function isExpressEligible (state) {
  return !!state.user.personalData.isExpressEligible;
}

function getAirmilesDetails (state) {
  return state.user.airmiles;
}

function getAssociateId (state) {
  return state.user.personalData.associateId;
}

function getChildren (state) {
  return state.user.personalData.children;
}

function getPointsHistoryPages (state) {
  return state.user.pointsHistory.pages;
}

function getPointsHistoryTotalPages (state) {
  return state.user.pointsHistory.totalPages;
}
