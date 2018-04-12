export const RECOMMENDATIONS_SECTIONS = {
  PDP: 'pdp',
  BAG: 'cart',
  HOMEPAGE: 'homepage',
  PLP: 'plp',
  FAVORITES: 'favorites',
  DEPARTMENT_LANDING: 'dlp',
  CHECKOUT: 'checkout',
  OUTFIT: 'outfit'
};

// #if !STATIC2
export * from './WebAPIServiceAbstractors/vendorDynamicAbstractors';
// #endif

// #if STATIC2
export * from './staticServiceAbstractors/vendorStaticAbstractors';
// #endif
