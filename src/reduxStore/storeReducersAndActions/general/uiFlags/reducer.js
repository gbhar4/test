import Immutable from 'seamless-immutable';

/** a function that does nothing (to use instead of null or undefined) */
export const NOP = () => {};

let defaultUiFlags = Immutable({
  isLoading: false,
  modals: {
    // A string id of a modal to open; a falsy value indicates none to open.
    // By convention, this id starts with the full path of the component that renders/controls the modal.
    // This way, we can avoid collisions.
    openModalId: '',
    okCallback: NOP,
    cancelCallback: NOP
  }
});

const flagsReducer = function (uiFlags = defaultUiFlags, action) {

  switch (action.type) {
    case 'GENERAL_FLAGS_SET_LOADING':
      return Immutable.merge(uiFlags, {isLoading: action.isLoading});
    case 'GENERAL_SET_OPEN_MODAL_ID':
      return Immutable.setIn(uiFlags, ['modals', 'openModalId'], action.openModalId);
    case 'GENERAL_SET_CONFIRM_MODAL_CALLBACKS':
      return Immutable.merge(uiFlags, {modals:
        {...uiFlags.modals, okCallback: action.okCallback || NOP, cancelCallback: action.cancelCallback || NOP}});
    default:
      return uiFlags;
  }
};

export {flagsReducer};
