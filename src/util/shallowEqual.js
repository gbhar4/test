/** @module shallowEqual
 * @summary compares two objects by performing a shallow equal of their own enumerable properties
 *
 * @param  {object} objA - the first object to compare
 * @param  {object} objB - the second object to compare
 * @return {Boolean} <code>true</code> if the objects are shallowly equal; <code>false</code> otherwise
 *
 * @author Ben
 */
export default function shallowEqual (objA, objB) {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}
