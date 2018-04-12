/** @mudule bindAllClassMethodsToThis
 * @author Ben
 * @summary a convenience method for inserting into an ES6 class instance
 * fields that hold bound versions of all its methods (except the constructor, of course).
 * Support is also given to limit this binding only to methods who's name starts
 * with a given prefix.
 *
 * @example binding example:
 * class Test {
 *   constructor () {
 *     bindAllClassMethodsToThis(this);
 *   }
 *   someMethod {
 *     // whatever
 *   }
 *   anotherMethod {
 *     // whatever
 *   }
 *   yetAnotherMethod {
 *     // whatever
 *   }
 * }
 *
 * // The above is equivalent to the following:
 *
 * class Test {
 *   constructor () {
 *     this.someMethod.bind(this);
 *     this.anotherMethod.bind(this);
 *     this.yetAnotherMethod.bind(this);
 *   }
 *   someMethod {
 *     // whatever
 *   }
 *   anotherMethod {
 *     // whatever
 *   }
 *   yetAnotherMethod {
 *     // whatever
 *   }
 * }
 *
 */

/**
 * For every function (except 'constructor') found in the prototype of the given object,
 * inserts a field with the same name who's value is that function bound to the object.
 *
 * @param  {Object}    obj        the object to insert the bound methods into
 * @param  {string}    namePrefix an optional prefix that, if present, applies the above procedure
 *                                only to functions who's name does/doesn't start with that prefix.
 * @parm   {boolean}   isExclude flags if functions starting with namePrefix should be the only ones
 *                               bound (if false) or the only ones not bound (if true)
 */
export function bindAllClassMethodsToThis (obj, namePrefix = '', isExclude = false) {
  let prototype = Object.getPrototypeOf(obj);
  for (let name of Object.getOwnPropertyNames(prototype)) {
    let descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    let isGetter = descriptor && typeof descriptor.get === 'function';
    if (isGetter) continue;
    if (typeof prototype[name] === 'function' && name !== 'constructor' &&
        isExclude ? !name.startsWith(namePrefix) : name.startsWith(namePrefix)) {
      obj[name] = prototype[name].bind(obj);
    }
  }
}
