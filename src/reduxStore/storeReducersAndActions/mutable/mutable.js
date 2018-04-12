/* This stores any mutable data one needs in the store.
 * PLEASE note that mutable data should not be passed as a prop to any react component!
 *
 * The reson we need this is that seemless-immutable can only wrap plain objects (i.e., objects without methods).
 */

import {defaultApiHelper} from 'service/WebAPIServiceAbstractors/apiHelper';

const defaultMutableStore = {
  apiHelper: defaultApiHelper
  // history
};

export function mutableReducer (mutableStore = Object.assign({}, defaultMutableStore), action) {
  switch (action.type) {
    case 'GENERAL_MUTABLE_SET_API_HELPER':
      mutableStore.apiHelper = action.apiHelper;
      return mutableStore;
    case 'GENERAL_MUTABLE_SET_HISTORY':
      mutableStore.history = action.history;
      return mutableStore;
    case 'GENERAL_MUTABLE_CLEAR':
      return {};
    default:
      return mutableStore;
  }
}

export * from './actionCreators';
