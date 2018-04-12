// TODO: rename actions to start with get and end with actions
export function _errorLogReporter (id, errorCode, errorMessage, networkStatusCode, stackTrace) {
  return {
    id,
    errorCode,
    errorMessage,
    networkStatusCode,
    stackTrace,
    type: 'GENERAL_ERRORLOGS_SET_ERROR'
  };
}
