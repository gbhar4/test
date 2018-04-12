/** @module CancellablePromise
 * @summary exposes a promise that can be cancelled.
 *
 *  The main use of such a promise is to make sure that the promise does not call a callback that is no
 *  longer relevant.
 *
 *  This is inspired by the discussion in (though the implementation is much simpler and cleaner):
 *  https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
 *  Pleas note, however, that this blog post (and associated React issue discussion) is in error regarding
 *  the effect this has on garbage collection. Indeed, any object in the closure of the callbacks (then/catch)
 *  passed to any implementation of a cancellablePromise will not be eligible for garbage collection until the
 *  promise resolves (even if it was previously cancelled).
 */

export const PROMISE_CANCELLED = {};      // we need this to be a unique value, different from anything else (according to ===)

export function getCancellablePromise (wrappedPromise, storeCancelCallback) {
  let helperPromise = new Promise((resolve, reject) => {
    storeCancelCallback(() => reject(PROMISE_CANCELLED));
  });

  return Promise.race([wrappedPromise, helperPromise]);
}
