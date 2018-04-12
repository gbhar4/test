export function getSetIsLoadingActn (isLoading) {
  return {
    isLoading,
    type: 'GENERAL_FLAGS_SET_LOADING'
  };
}

export function getSetOpenModalIdActn (openModalId) {
  return {
    openModalId: openModalId,
    type: 'GENERAL_SET_OPEN_MODAL_ID'
  };
}

export function getSetConfirmationModalCallbacks (okCallback, cancelCallback) {
  return {
    okCallback: okCallback,
    cancelCallback: cancelCallback,
    type: 'GENERAL_SET_CONFIRM_MODAL_CALLBACKS'
  };
}
