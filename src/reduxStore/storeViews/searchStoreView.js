export const searchStoreView = {
  getSearchSuggestions
};

function getSearchSuggestions (state) {
  return state.globalComponents.header.searchSuggestions;
}
