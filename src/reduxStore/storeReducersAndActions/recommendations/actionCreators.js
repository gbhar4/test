export function getSetOutfitRecommendationsActn (outfits) {
  return {
    outfits: outfits,
    type: 'RECOMMENDATIONS_SET_OUTFITS_RECOMMENDATIONS'
  };
}

export function getSetProductRecommendationsActn (products) {
  return {
    products: products,
    type: 'RECOMMENDATIONS_SET_PRODUCT_RECOMMENDATIONS'
  };
}
