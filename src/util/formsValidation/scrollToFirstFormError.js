import {scrollToFirstMatchingElementInSetTimeout} from 'util/viewUtil/scrollingAndFocusing.js';
import {ERROR_FORM_NAME_DATA_ATTRIBUTE} from 'views/components/common/ErrorMessage.jsx';

export {ERROR_FORM_NAME_DATA_ATTRIBUTE};

export function scrollToFirstFormError (formName) {
  // setTiemout to force this to happen in the next event loop (after the components have time to re-render and the ERROR_FORM_NAME_DATA_ATTRIBUTE appear in the DOM elements)
  scrollToFirstMatchingElementInSetTimeout(ERROR_FORM_NAME_DATA_ATTRIBUTE, formName);
}
