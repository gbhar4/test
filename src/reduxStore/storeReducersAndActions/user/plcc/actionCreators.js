export function getSetPlccApplicationCardActn (application) {
  return {
    application,
    type: 'USER_PLCC_SET_CARD_APPLICATION'
  };
}

export function getSetPlccEligibleActn (eligible) {
  return {
    eligible,
    type: 'USER_PLCC_SET_ELIGIBLE'
  };
}

export function getSetPlccPrescreenCodeActn (code) {
  return {
    code,
    type: 'USER_PLCC_SET_CODE'
  };
}

export function getSetPlccStatusActn (status) {
  return {
    status,
    type: 'USER_PLCC_SET_STATUS'
  };
}

export function getSetPlccApplicationStatusActn (status) {
  return {
    status,
    type: 'USER_PLCC_APPLICATION_SET_STATUS'
  };
}
