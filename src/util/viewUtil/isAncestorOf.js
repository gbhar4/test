/**
 * A utility function to return the closest element of a specific type
 *
 * @example
 * // returns <div id='b'>
 * <div id='a'><div id='b'><a>something</a></div></div>
 * isAncestorOf(<div>, <a>) => true
**/
const isAncestorOf = function (ancestor, element) {
  var elem = element;

  while (elem && elem !== ancestor) {
    elem = elem.parentNode;
  }

  return elem;
};

export {isAncestorOf};
