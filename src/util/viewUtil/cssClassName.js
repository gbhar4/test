/**
 * A utility function to create a CSS class name string from multiple parts.
 *
 * The basic use is to take one or more objects and concatenate the names of all the
 * (enumerable own) properties of the object that have a "truthy" value.
 * @example
 * // returns 'helloworld'
 * cssClassName({hello: true, big: false, world: true})
 *
 * @example
 * // returns <code>undefined</code> (<strong>not</strong> the empty string)
 * cssClassName({hello: false, big: false, world: false})
 *
 * The reason <code>undefined</code> is returned to indicate an empty result is so that when assigning the return value of cssClassName
 * to the className prop of a React element will suppress that prop if the result is empty (instead of resulting with an HTML element with class="")
 *
 * Parmerters that are strings or numbers are simply appended.
 * @example
 * // returns 'helloworld'
 *   cssClassName({hello: true}, 'world')
 *
 * Parameters that are arrays are recursed into (also observe that multiple spaces are replaced by a single space).
 * @example
 * // returns 'a bdef'
 *  cssClassName(['a    ', {b: true, c: false }, {d: true, e: true}, 'f']))
 *
 * Note that arrays as values of object keys are not recursed into, and simply serve to decide
 * whether the object key is "truthy" or "falsy".
 * @example
 * // returns 'a'
 *   cssClassName({ a: ['b', 'c', {d: true}])
 *
 * It is important to note that pieces are concatenated by traversing the parameters list in order
 * (i.e. left to right), that arrays are traversed in order, and that Object properties are traversed
 * in the order returned by the <code>Object.keys()</code> method. In particular, this means that object
 * properties are traversed in the order that they were added to the object,
 * <strong>with the exception of properties with names that are numbers which always appear first</strong>.
 * @example
 * // returns '12ab'
 *   cssClassName({a: true, 2: true, b: true, 1: true})
 *
 * @param {...(string | number | Array | Object)} pieces - the pieces to concatenate.
 *
 * @author Ben
*/
const cssClassName = function () {
  let classNameParts = [];    // the pieces are accumulatred here

  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    if (!arg) {     // skip falsy arguments
      continue;
    }

    let argType = typeof arg;
    if (argType === 'string' || argType === 'number') {
      classNameParts.push(arg);     // strings and numbers are simply added
    } else if (Array.isArray(arg)) {
      classNameParts.push(cssClassName.apply(null, arg));   // recurse into arrays
    } else if (argType === 'object') {
      let argKeys = Object.keys(arg);
      // note that we do not use a for-in loop, since the order of traversal is not guaranteed by it
      for (let i = 0; i < argKeys.length; i++) {
        if (arg[argKeys[i]]) {
          classNameParts.push(argKeys[i]);
        }
      }
    }
  }

  let result = classNameParts.join('').replace(/ +(?= )/g, '').trim();      // join all parts and replace multiple spaces with a single space
  return result.length > 0 ? result : undefined;      // if result is empty return undefined instead of empty string.
};

export default cssClassName;
