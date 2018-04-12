/**
 * @author Mike citro
 * @author Ben
 * (Ben provided only some band-aid fixes to mistakes about how promises behave)
 */
import {_errorLogReporter} from 'reduxStore/storeReducersAndActions/general/general';
import {SubmissionError} from 'redux-form';
import {observeStore} from 'reduxStore/util/observeStore';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {isClient} from 'routing/routingHelper';
import invariant from 'invariant';

export function getSetErrorInStateMethod (object) {
  invariant(typeof object === 'object',
    `operatorHelper:getSetErrorInStateMethod 'object' must be of type object, instead received ${typeof object}.`);
  return setInState.bind(object);
}

export function logError (store, id, err) {
  store.dispatch(_errorLogReporter(id, err.errorCodes || err.name, err.errorMessages || err.message, err.networkStatusCode || err.statusCode, err.stack));
}

export function logErrorAndServerThrow (store, id, err) {
  if (!isClient()) {
    if (process.env.NODE_ENV !== 'production') {
      if (err.networkStatusCode !== 404) {
        console.error(id);
        console.error(err);
      }

      logError(store, id, err);
    }

    throw err;
  } else {
    logError(store, id, err);
  }
}

export function getSubmissionError (store, id, err) {
  logError(store, id, err);

  return new SubmissionError(err.errorMessages ||
    {_error: 'Oops... an error occured'});         // SubmissionError expects global error messages under the _error key
}

// NOTE: given the object of error messages from the api service abstractors this will return a requested message, or default to the first message in the object
export function getErrorMessage (errorMessages, errorKey) {
  let firstErrorInList = errorMessages[Object.keys(errorMessages)[0]];
  return errorMessages[errorKey] || firstErrorInList;
}

// observes the store to see when the page finished loading, and then unsubscribes from the store and calls the callback.
export function triggerOnPageLoad (store, callback) {
  let unsubscribe = observeStore(
    store,
    (state) => generalStoreView.getIsLoading(state),
    (oldIsLoading, newIsLoading) => {
      if (!newIsLoading) {
        unsubscribe();
        callback();
      }
    },
    true
  );
}

function setInState (err) {
  this.setState({error: err && err.errors && err.errors._error});
}
