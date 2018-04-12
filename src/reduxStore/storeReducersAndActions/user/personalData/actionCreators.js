// TODO: rename actions to start with get and end with actions
// TODO: combine isRemembered and isGuest into a single enum.
export function setContactInfo (contactInfo) {
  return {
    contactInfo,
    type: 'USER_PERSONALDATA_SET_CONTACT_INFO'
  };
}

export function setIsGuest (isGuest) {
  return {
    isGuest,
    type: 'USER_PERSONALDATA_SET_ISGUEST'
  };
}
export function setIsRemembered (isRemembered) {
  return {
    isRemembered,
    type: 'USER_PERSONALDATA_SET_ISREMEMBERED'
  };
}

export function setIsPlcc (isPlcc) {
  return {
    isPlcc,
    type: 'USER_PERSONALDATA_SET_ISPLCC'
  };
}

export function getSetPlccCardIdActn (plccCardId) {
  return {
    plccCardId,
    type: 'USER_PERSONALDATA_SET_PLCC_CARD_ID'
  };
}

export function getSetPlccCardNumberActn (plccCardNumber) {
  return {
    plccCardNumber,
    type: 'USER_PERSONALDATA_SET_PLCC_CARD_NUMBER'
  };
}

export function setIsExpressEligible (isExpressEligible) {
  return {
    isExpressEligible,
    type: 'USER_PERSONALDATA_SET_IS_EXPRESS_ELIGIBLE'
  };
}

export function getSetChildrenActn (children) {
  return {
    children,
    type: 'USER_PERSONALDATA_CHILDREN_SET'
  };
}

export function getAddChildActn (newChild) {
  return {
    newChild,
    type: 'USER_PERSONALDATA_CHILDREN_ADD_CHILD'
  };
}

export function getDeleteChildActn (childId) {
  return {
    childId,
    type: 'USER_PERSONALDATA_CHILDREN_DELETE_CHILD'
  };
}

export function getSetAssociateIdActn (associateId) {
  return {
    associateId,
    type: 'USER_PERSONALDATA_SET_ASSOCIATE_ID'
  };
}

export function setUserId (userId) {
  return {
    userId,
    type: 'USER_PERSONALDATA_SET_USER_ID'
  };
}
