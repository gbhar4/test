import 'babel-polyfill'; // FIXME: IE polyfill for ES6, move this to a separate file and import only for IE
import React from 'react'; // eslint-disable-line no-unused-vars, needed to interpret jsx
import Modal from 'react-modal';
import {fullPageRender} from './fullPageRender.js';
import {AppRootPageContainer} from './AppRootPageContainer.js';
// import whyDidYouUpdate from 'why-did-you-update';

import {trackingInitialization} from 'util/analytics/trackingInitialization';
import {LEGACY_PAGE_ID, getPageByPathPart} from 'routing/routes/pages';

let pageMountCallback = () => {};
function setPageMountCallback (callback) { pageMountCallback = callback; }
function onPageMount () {
  try {   // callback runs inside a sandbox
    pageMountCallback();
  } catch (ex) {
    /* just supress the error -> tracking code should do it's own try-catch if it wants */
  }
}

trackingInitialization(setPageMountCallback);

let root = document.getElementById('tcp');
Modal.setAppElement(root);

if (!LOCAL_SERVE) { // eslint-disable-line
  fullPageRender(<AppRootPageContainer onComponentDidMount={onPageMount} />, root);
} else {
  let pageName = window.location.pathname.split('/')[2];
  let page = getPageByPathPart(pageName);

  let isMobile = window.LOCAL_DEV_IS_MOBILE;
  fullPageRender(<AppRootPageContainer />, root, page ? page.id : LEGACY_PAGE_ID, {isMobile});
}
