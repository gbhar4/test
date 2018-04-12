import Immutable from 'seamless-immutable';

export const FLASH_TYPES = Immutable({
  SUCCESS: 'success',
  ERROR: 'error'
});

let defaultFlashStore = Immutable({
  message: null,
  type: null,
  expiresNow: null
});

const flashReducer = function (flash = defaultFlashStore, action) {
  switch (action.type) {
    case 'GENERAL_FLASH_SET_MESSAGE':
      return Immutable.merge(flash, {
        message: action.message,
        type: action.flashType,
        expiresNow: false
      });
    case 'GENERAL_FLASH_SET_EXPIRES_NOW':
      return Immutable.merge(flash, {expiresNow: action.expire});
    default:
      return flash;
  }
};

export * from './actionCreators';
export {flashReducer};
