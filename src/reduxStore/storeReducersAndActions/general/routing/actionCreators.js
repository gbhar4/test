export function getSetCurrentPageActn (currentPage) {
  return {
    currentPage: currentPage,
    type: 'GENERAL_ROUTING_SET_CURRENT_PAGE'
  };
}

export function getSetServerErrorCodeActn (errorCode) {
  return {
    errorCode: errorCode,
    type: 'GENERAL_ROUTING_SET_ERROR_CODE'
  };
}
