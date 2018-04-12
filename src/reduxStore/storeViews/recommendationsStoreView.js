export const recommendationsStoreView = {
  getAllRecommendations,
  getRecommendationByName,
  getAllOutfitRecommendations
};

function getAllRecommendations (state) {
  return state.recommendations.products;
}

function getAllOutfitRecommendations (state) {
  return state.recommendations.outfits;
}

function getRecommendationByName (state, id) {
  return state.recommendations.products[id];
}
