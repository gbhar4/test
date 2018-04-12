import Immutable from 'seamless-immutable';

let defaultRecommendationsStore = Immutable({
  products: [],
  outfits: []
});

const recommendationsReducer = function (recommendations = defaultRecommendationsStore, action) {
  switch (action.type) {
    case 'RECOMMENDATIONS_SET_OUTFITS_RECOMMENDATIONS':
      return Immutable.merge(recommendations, {outfits: action.outfits});
    case 'RECOMMENDATIONS_SET_PRODUCT_RECOMMENDATIONS':
      return Immutable.merge(recommendations, {products: action.products});
    default:
      return recommendations;
  }
};

export * from './actionCreators';
export {recommendationsReducer};
