/**
 * @author Michael Citro
 * @summary (WIP)
 * @example (WIP)
 */
import { getSetPocAbTestActn, getSetNewMobileNavActn, getSetNewMobileFilterActn } from 'reduxStore/storeReducersAndActions/abTests/actionCreators';
import {NEW_MOBILE_NAV_VARIANTS} from 'reduxStore/storeReducersAndActions/abTests/abTests';

let currentInstance = null;

export function initializeABTestingHook (store) {
  if (!currentInstance) {
    currentInstance = new _ABTestRegistration(store);
  }

  window.ABTestRegistration = {
    activatePOCTest: currentInstance.activatePOCTest.bind(currentInstance),
    setNewMobileNav: {
      variantA: currentInstance.setNewMobileNavVariantA.bind(currentInstance),
      variantB: currentInstance.setNewMobileNavVariantB.bind(currentInstance),
      variantC: currentInstance.setNewMobileNavVariantC.bind(currentInstance)
    },
    toggleNewMobileFilter: currentInstance.toggleNewMobileFilter.bind(currentInstance)
  };
}
class _ABTestRegistration {

  constructor (store) {
    this.store = store;
  }

  activatePOCTest () {
    let action = getSetPocAbTestActn(true);
    this.store.dispatch(action);
  }

  deactivatePOCTest () {
    let action = getSetPocAbTestActn(false);
    this.store.dispatch(action);
  }

  setNewMobileNavVariantA (isActive) {
    this.store.dispatch(getSetNewMobileNavActn({
      isActive,
      variant: NEW_MOBILE_NAV_VARIANTS.VARIANT_A
    }));
  }

  setNewMobileNavVariantB (isActive) {
    this.store.dispatch(getSetNewMobileNavActn({
      isActive,
      variant: NEW_MOBILE_NAV_VARIANTS.VARIANT_B
    }));
  }

  setNewMobileNavVariantC (isActive) {
    this.store.dispatch(getSetNewMobileNavActn({
      isActive,
      variant: NEW_MOBILE_NAV_VARIANTS.VARIANT_C
    }));
  }

  toggleNewMobileFilter (isActive) {
    this.store.dispatch(getSetNewMobileFilterActn(isActive));
  }

}
