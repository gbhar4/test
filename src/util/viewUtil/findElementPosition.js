/**
 * A utility function to return the position of a DOM element
 *
 * @example
 * fundElementPosition(document.getElementBy('element')) === { left: [number], top: [number] }
**/
function findElementPosition (obj) {
  let curleft = 0;
  let curtop = 0;

  do {
    curleft += obj.offsetLeft;
    curtop += obj.offsetTop;
    obj = obj.offsetParent;
  } while (obj);

  return {
    left: curleft,
    top: curtop
  };
}

export {findElementPosition};
