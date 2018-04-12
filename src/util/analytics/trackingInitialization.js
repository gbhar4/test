import {notifyAdobeDTM, triggerPageRenderEvent} from './adobeDTMTracking';
import {webServiceSubscriber, SUBSCRIBE_TO_ALL_URI} from 'service/WebAPIServiceAbstractors/webServiceSubscriber';
import {apiRegistractionDispatcher} from '../apiRegistration';

// setPageMountCallback is a function that accepts a callback (callback gets no parameters) to run when page finishes mounting into the DOM
export function trackingInitialization (setPageMountCallback) {
  // Subscribe such that on every service call if we have a mapping in DTM then we will trigger the DTM
  // call and store the data for its function can use.
  webServiceSubscriber.subscribeForServiceResponse(SUBSCRIBE_TO_ALL_URI, notifyAdobeDTM);
  webServiceSubscriber.subscribeForServiceResponse(SUBSCRIBE_TO_ALL_URI, apiRegistractionDispatcher);

  // When page complete rendering trigger call to DTM to let it know
  setPageMountCallback(triggerPageRenderEvent);
}
