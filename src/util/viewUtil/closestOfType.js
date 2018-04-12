/**
 * A utility function to return the closest element of a specific type
 *
 * @example
 * // returns <div id='b'>
 * <div id='a'><div id='b'><a>something</a></div></div>
 * closestOfType(<a>, "div")
**/
const closestOfType = function (base, type) {
  var elem = base;

  while (elem && elem.nodeName !== type) {
    elem = elem.parentNode;
  }

  return elem;
};

export {closestOfType};
