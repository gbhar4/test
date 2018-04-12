import Immutable from 'seamless-immutable';

let defaultErrorsStore = Immutable([]);

const setError = function (errorLogs, id, errorCode = '', errorMessage = '', networkStatusCode = '', stackTrace = '') {
  return Immutable([...errorLogs, { functionCall: id, errorCode, errorMessage, networkStatusCode, stackTrace }]);
};

const errorLogsReducer = function (errorLogs = defaultErrorsStore, action) {
  switch (action.type) {
    case 'GENERAL_ERRORLOGS_SET_ERROR':
      return setError(errorLogs, action.id, action.errorCode, action.errorMessage, action.networkStatusCode, action.stackTrace);
    default:
      return errorLogs;
  }
};

export * from './actionCreators';
export {errorLogsReducer};
