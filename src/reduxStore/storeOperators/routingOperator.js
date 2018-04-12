import {getSetIsMobileActn} from 'reduxStore/storeReducersAndActions/session/session';
import {getSetApiHelperActn} from 'reduxStore/storeReducersAndActions/mutable/mutable';
import {getSetCurrentPageActn} from 'reduxStore/storeReducersAndActions/general/general';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView.js';
import invariant from 'invariant';
import warning from 'warning';
import {isClient} from 'routing/routingHelper';
import {createPath} from 'history';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';

let previous = null;
export function getRoutingOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new RoutingOperator(store);
  }
  return previous;
}

class RoutingOperator {
  constructor (store) {
    this.store = store;
    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  setIsMobileSite (IsMobile) {
    return this.store.dispatch(getSetIsMobileActn(IsMobile));
  }

  /**
   * @method: pushLocation
   * @param  {object} extraInfo       (optional) A simple object specifying the parts of the returned location that are not in the path.
   *                                    Has the following (optional) fields:
   *                                      queryValues: a simple object of key-value pairs that will be used to create the urtl's query string (in the natural way).
   *                                      hash: the hash portion of the location
   *                                      state: the state portion of the location.
   *                                      pathSuffix: usually is the id of a PDP, it's last element before the token for queryString ('?').
   *
   *  Important: It's not equal to the 'extraInfo' in locationCreateMethods!!
   */
  pushLocation (destination, extraInfo) {
    let {page, section} = getPageAndSection(destination);
    let storeState = this.store.getState();
    invariant(routingStoreView.isLinkToCurrentPage(storeState, page),
      `RoutingOperator.pushLocation: the requested location is in page '${page.id}', which is not the same as the current page.`);
    routingInfoStoreView.getHistory(storeState).push(routingStoreView.getLocationFromPageInfo(storeState, {page, section, ...extraInfo}));
  }

  /**
   * @method: replaceLocation
   * @param  {object} extraInfo       (optional) A simple object specifying the parts of the returned location that are not in the path.
   *                                    Has the following (optional) fields:
   *                                      queryValues: a simple object of key-value pairs that will be used to create the urtl's query string (in the natural way).
   *                                      hash: the hash portion of the location
   *                                      state: the state portion of the location.
   *                                      pathSuffix: usually is the id of a PDP, it's last element before the token for queryString ('?').
   *
   *  Important: It's not equal to the 'extraInfo' in locationCreateMethods!!
   */
  replaceLocation (destination, extraInfo) {
    let {page, section} = getPageAndSection(destination);
    let storeState = this.store.getState();
    invariant(routingStoreView.isLinkToCurrentPage(storeState, page),
      `RoutingOperator.replaceLocation: the requested location is in page '${page.id}', which is not the same as the current page.`);
    routingInfoStoreView.getHistory(storeState).replace(routingStoreView.getLocationFromPageInfo(storeState, {page, section, ...extraInfo}));
  }

  /**
   * @method: gotoPage
   * @param  {object} extraInfo       (optional) A simple object specifying the parts of the returned location that are not in the path.
   *                                    Has the following (optional) fields:
   *                                      queryValues: a simple object of key-value pairs that will be used to create the urtl's query string (in the natural way).
   *                                      hash: the hash portion of the location
   *                                      state: the state portion of the location.
   *                                      pathSuffix: usually is the id of a PDP, it's last element before the token for queryString ('?').
   *
   *  Important: It's not equal to the 'extraInfo' in locationCreateMethods!!
   */
  gotoPage (destination, extraInfo, forceRefresh) {
    if (!isClient()) {
      warning(false, 'RoutingOperator.gotoPage: this method should only be called when running in a browser.');
      return;
    }

    let {page, section} = getPageAndSection(destination);
    let storeState = this.store.getState();
    let location = routingStoreView.getLocationFromPageInfo(storeState, {page, section, ...extraInfo});
    if (!forceRefresh && routingStoreView.isLinkAlreadyLoaded(storeState, page)) {
      routingInfoStoreView.getHistory(storeState).push(location);
    } else {
      window.location = createPath(location);
    }
  }

  gotoLegacyPage (page, ...params) {
    let storeState = this.store.getState();
    window.location = page.pathCreateMethod(storeState, ...params);
  }

  setApiHelper (apiHelper) {
    return this.store.dispatch(getSetApiHelperActn(apiHelper));
  }

  setCurrentPageId (currentPageId) {
    invariant(typeof currentPageId === 'string',
      `RoutingOperator.setCurrentPageId: 'currentPageId' is of type '${typeof currentPageId}', expecting a string!`);
    return this.store.dispatch(getSetCurrentPageActn(currentPageId));
  }

  goBack () {
    let history = routingInfoStoreView.getHistory(this.store.getState());
    history.goBack();
  }

  refreshPage () {
    // close ham,burger menu on mobile devices whenever the page needs to refresh
    getGlobalSignalsOperator(this.store).setIsHamburgerMenuOpen(false);
  }

}

function getPageAndSection (destination) {
  // destination is a page if it has no 'page' field, otherwise it is a section
  return {
    page: destination.page || destination,
    section: destination.page ? destination : undefined
  };
}
