import Immutable from 'seamless-immutable';

export function getStoreStateFromImage (stateImage) {
  let preloadedStoreState = {};
  for (let nodeName of Object.keys(stateImage)) {
    // mutable part of store contains things that are not simple objects and can not be loaded from image
    if (nodeName !== 'mutable') {
      preloadedStoreState[nodeName] = Immutable(stateImage[nodeName]);
    }
  }
  return preloadedStoreState;
}
