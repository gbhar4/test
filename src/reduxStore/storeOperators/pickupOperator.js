import {getAccountAbstractor} from 'service/accountServiceAbstractor';
import {logErrorAndServerThrow} from './operatorHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

let previous = null;
export function getPickupOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new PickupOperator(store);
  }
  return previous;
}

class PickupOperator {
  constructor (store) {
    this.store = store;
    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  get accountServiceAbstractor () {
    return getAccountAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  addContact (contact) {
    return this.accountServiceAbstractor.addPickupPerson(contact).then((res) => {
      return res;
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'PickupOperator.addPickupPerson', err);
      throw err;
    });
  }
}
