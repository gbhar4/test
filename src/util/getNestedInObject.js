/**
 * Returns a nested element inside an object
 * @param  {object} srcObject the object to get the nested element from.
 * @param  {string} path      a path to the requested element. a dot ('.') designates a nested object.
 * @return {any}           the requested element, or <code>undefined</code> is not found.
 *
 * @example <caption>returns 'John'</caption>
 *          getNestedInObject({x: 7, a: {b: 'john'}}, 'a.b')
 */
export function getNestedInObject (srcObject, path) {
  if (!path) return srcObject;
  let pathParts = path.split('.');
  let currentObject = srcObject;
  for (let nestedObjectName of pathParts) {
    if (!currentObject[nestedObjectName]) {
      return {};
    } else {
      currentObject = currentObject[nestedObjectName];
    }
  }
  return currentObject;
}
