import {findElementPosition} from './findElementPosition.js';
import {isScrollable} from './isScrollable.js';
const FIXED_HEADER_DATA_ATTRIBUTE_NAME = 'data-scrolling-fixed-header';

let fixedHeaderHeight = null;

export const FIXED_HEADER_DATA_ATTRIBUTE = {[FIXED_HEADER_DATA_ATTRIBUTE_NAME]: true};
export const MAIN_CONTENT_SELECTOR = 'main';

export function scrollToElement (element, increase, verticalOffset = 0) {
  if (fixedHeaderHeight === null || fixedHeaderHeight === 0) {
    getFixedHeaderHeight();
  }

  let elementPosition = findElementPosition(element);
  window.scrollTo(elementPosition.left, elementPosition.top - fixedHeaderHeight + verticalOffset - increase);
}

export function scrollToFirstMatchingElement (attributeName, attributeValue, verticalOffset = 0, focusElement = true) {
  if (fixedHeaderHeight === null || fixedHeaderHeight === 0) {
    getFixedHeaderHeight();
  }

  let firstMatchingElement = document.querySelector('[' + attributeName + '="' + attributeValue + '"]');
  if (firstMatchingElement) {
    let elementPosition = findElementPosition(firstMatchingElement);

    let scrollingElement = findFirstScrollableParent(firstMatchingElement);

    if (scrollingElement === window) {
      scrollingElement.scrollTo(elementPosition.left, elementPosition.top - fixedHeaderHeight + verticalOffset);
    } else {
      let scrollingElementPosition = findElementPosition(scrollingElement);
      scrollingElement.scrollTop = elementPosition.top - scrollingElementPosition.top;
      scrollingElement.scrollLeft = elementPosition.left - scrollingElementPosition.left;
    }

    if (focusElement) {
      firstMatchingElement.focus();
    }
  }
}

// setTiemout to force this to happen in the next event loop (after the components have time to re-render and new attribute values appear in the DOM elements)
export function scrollToFirstMatchingElementInSetTimeout (attributeName, attributeValue, verticalOffset = 0, focusElement = true) {
  setTimeout(() => scrollToFirstMatchingElement(attributeName, attributeValue, verticalOffset, focusElement), 0);
}

export function findFirstScrollableParent (element) {
  var elem = element;

  while (elem && !isScrollable(elem)) {
    elem = elem.parentNode;

    if (elem === window || elem === document) {
      elem = null;
    }
  }

  return elem || window;
}

function getFixedHeaderHeight () {
  let fixedHeaderElements = document.querySelectorAll('[' + FIXED_HEADER_DATA_ATTRIBUTE_NAME + ']');
  if (fixedHeaderElements === []) {
    return;
  }
  fixedHeaderHeight = 0;
  for (let element of fixedHeaderElements) {
    fixedHeaderHeight += element.offsetHeight;
  }
}
