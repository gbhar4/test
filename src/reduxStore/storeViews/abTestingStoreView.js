/** @module abTestingStoreView
 *
 * @author Michael Citro
 */

export const abTestingStoreView = {
  getIsPocTestActive,
  getNewMobileNavVariants,
  getIsNewMobileFilterActive
};

function getIsPocTestActive (state) {
  return state.abTests.isPocTestActive;
}

function getNewMobileNavVariants (state) {
  return state.abTests.isNewMobileNavActive;
}

function getIsNewMobileFilterActive (state) {
  return state.abTests.isNewMobileFilterForm;
}
