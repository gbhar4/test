export const routingInfoStoreView = {
  getIsMobile,
  getApiHelper,
  getHistory,
  getOriginSettings
};

function getIsMobile (state) {
  return state.session.siteDetails.isMobile;
}

function getApiHelper (state) {
  return state.mutable.apiHelper;
}

function getHistory (state) {
  return state.mutable.history;
}

function getOriginSettings (state) {
  return state.session.siteDetails.originSettings;
}
