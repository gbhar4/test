/**
 * A utility function to apply a bunch of css rules at once
 * (the intention is to work as a subset of jquery.fn.css)
 *
 * @example
 * cssSet(element, {position: "absolute", top: "25px"})
**/
const cssSet = function (element, props) {
  for (var idx in props) {
    if (props.hasOwnProperty(idx)) {
      element.style[idx] = props[idx];
    }
  }
};

export {cssSet};
