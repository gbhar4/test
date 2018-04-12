/** @module
 * @summary action creators for manipulating ab testing related information.
 *
 * @author Michael Citro
 */

export function getSetPocAbTestActn (isActive) {
  return {
    isActive: isActive,
    type: 'AB_TEST_SET_POC_TEST'
  };
}

export function getSetNewMobileNavActn ({ isActive, variant }) {
  return {
    isActive,
    variant,
    type: 'AB_TEST_SET_NEW_MOBILE_NAVIGATION_TEST'
  };
}

export function getSetNewMobileFilterActn (isActive) {
  return {
    isActive: isActive,
    type: 'AB_TEST_SET_NEW_MOBILE_FILTER'
  };
}
