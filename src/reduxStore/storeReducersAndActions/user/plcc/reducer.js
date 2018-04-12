import Immutable from 'seamless-immutable';

export const PLCC_OFFER_STATUS = Immutable({
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  PENDING: 'pending'
});

let studPlccApplicationCardStore = Immutable({
  application: null,
  prescreenVerificationData: {
    prescreenCode: null,
    eligible: false,
    status: PLCC_OFFER_STATUS.PENDING
  }
});

const plccReducer = function (plcc = studPlccApplicationCardStore, action) {
  switch (action.type) {
    case 'USER_PLCC_SET_CARD_APPLICATION':
      return Immutable.merge(plcc, { application: action.application });
    case 'USER_PLCC_SET_ELIGIBLE':
      return Immutable.setIn(plcc, ['prescreenVerificationData', 'eligible'], action.eligible);
    case 'USER_PLCC_SET_CODE':
      return Immutable.setIn(plcc, ['prescreenVerificationData', 'prescreenCode'], action.code);
    case 'USER_PLCC_SET_STATUS':
      return Immutable.setIn(plcc, ['prescreenVerificationData', 'status'], action.status);
    case 'USER_PLCC_APPLICATION_SET_STATUS':
      return Immutable.merge(plcc, { application: { status: action.status } });
    default:
      return plcc;
  }
};

export * from './actionCreators';
export {plccReducer};
