/** @module storeObserver
 * @summary a function for registering as an obserever of a slice of the redux-store
 *
 * Shamelessly adapted from a post by Dan Abramov
 * @author Ben
 */

/**
 * @summary Subscribes a given method as an observer of a slice of the store.
 * Wehenever the slice of the store selected by the <code>select</code> method
 * provided is changed, the <code>onChange</code> callback is called.
 *
 * Note: a change is detected as follows: <code>===</code> is used to compare slices that are not objects,
 * and <code>shallowEqual</code> is used to compare slices that are objects.
 * This allows one to combine multiple parts of an immutable store as fields of a plain object, and have changes
 * detected correctly.
 *
 * Note: the old an new values of the selected store slice are compared using ===
 * In other words, non-primitive parts of the store are assumed to be immutable.
 * @param  {object}   store    The Redux-store to subsrivbe to
 * @param  {function} select   A method that selects a slice of the store to monitor.
 *                             This method accepts a single parameter that is the state of the whole store,
 *                             and should return the part of it that is of interest. For example:
 *                             (state) => state.cart.summary
 * @param  {function} onChange The method to call when the selected slice of the store changes.
 *                             This function accepts two parameters: the old and the new values of the selected slice.
 * @param  {boolean} noTriggerOnChangeNow indicates that the onChange method should not be called at the end of this
 *                                        method call, as part of this subscribe process.
 * @return {function}          A function to call in order to unsbscribe.
 */
import shallowEqual from 'util/shallowEqual';

export function observeStore (store, select, onChange, noTriggerOnChangeNow) {
  let oldSliceState = select(store.getState());

  function handleChange () {
    let currentSliceState = select(store.getState());
    if (oldSliceState === currentSliceState ||
        typeof oldSliceState === 'object' && typeof currentSliceState === 'object' && shallowEqual(oldSliceState, currentSliceState)) {
      oldSliceState = currentSliceState;
      return;
    }

    // note that onChange may trigger a change in the redux store
    // which will call this method again, so we have to flag that
    // we already detected this change on oldSliceState before calling onChange
    let _oldSliceState = oldSliceState;
    oldSliceState = currentSliceState;
    onChange(_oldSliceState, currentSliceState);
  }

  let unsubscribe = store.subscribe(handleChange);
  if (!noTriggerOnChangeNow) {
    handleChange();
  }
  return unsubscribe;
}
