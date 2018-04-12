import Immutable from 'seamless-immutable';

export const NEW_MOBILE_NAV_VARIANTS = {
  VARIANT_A: 'variantA',
  VARIANT_B: 'variantB',
  VARIANT_C: 'variantC'
};

let defaultAbTests = Immutable({
  isPocTestActive: false,
  isNewMobileNavActive: {
    [NEW_MOBILE_NAV_VARIANTS.VARIANT_A]: false,
    [NEW_MOBILE_NAV_VARIANTS.VARIANT_B]: false,
    [NEW_MOBILE_NAV_VARIANTS.VARIANT_C]: false
  },
  isNewMobileFilterForm: false
});

const abTestReducer = function (abTests = defaultAbTests, action) {
  switch (action.type) {
    case 'AB_TEST_SET_POC_TEST':
      return Immutable.merge(abTests, { isPocTestActive: action.isActive });
    case 'AB_TEST_SET_NEW_MOBILE_NAVIGATION_TEST':
      return Immutable.set(abTests, ['isNewMobileNavActive'], {
        ...defaultAbTests.isNewMobileNavActive, // reset all other tests
        [action.variant]: action.isActive
      });
    case 'AB_TEST_SET_NEW_MOBILE_FILTER':
      return Immutable.merge(abTests, { isNewMobileFilterForm: action.isActive });
    default:
      return abTests;
  }
};

export { abTestReducer };
