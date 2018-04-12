import Immutable from 'seamless-immutable';

let defaultPersonalDataStore = Immutable({
  contactInfo: {
    emailAddress: '',
    phoneNumber: '',
    firstName: '',
    lastName: ''
  },
  userId: null,
  isGuest: true,
  isRemembered: false,
  isPlcc: false, // FIXME:
  plccCardId: null,
  plccCardNumber: null,
  children: [],
  associateId: null
});

export function personalDataReducer (personalData = defaultPersonalDataStore, action) {
  switch (action.type) {
    case 'USER_PERSONALDATA_SET_CONTACT_INFO':
      return Immutable.merge(personalData, {contactInfo: action.contactInfo});
    case 'USER_PERSONALDATA_SET_ISGUEST':
      return Immutable.merge(personalData, {isGuest: action.isGuest});
    case 'USER_PERSONALDATA_SET_ISREMEMBERED':
      return Immutable.merge(personalData, {isRemembered: action.isRemembered});
    case 'USER_PERSONALDATA_SET_ISPLCC':
      return Immutable.merge(personalData, {isPlcc: action.isPlcc});
    case 'USER_PERSONALDATA_SET_ASSOCIATE_ID':
      return Immutable.merge(personalData, {associateId: action.associateId});
    case 'USER_PERSONALDATA_SET_IS_EXPRESS_ELIGIBLE':
      return Immutable.merge(personalData, {isExpressEligible: action.isExpressEligible});
    case 'USER_PERSONALDATA_CHILDREN_SET':
      return Immutable.merge(personalData, {children: action.children});
    case 'USER_PERSONALDATA_CHILDREN_ADD_CHILD':
      return Immutable.merge(personalData, {children: [...personalData.children, action.newChild]});
    case 'USER_PERSONALDATA_CHILDREN_DELETE_CHILD':
      return Immutable.merge(personalData, {children: personalData.children.filter((item) => item.childId !== action.childId)});
    case 'USER_PERSONALDATA_SET_PLCC_CARD_ID':
      return Immutable.merge(personalData, {plccCardId: action.plccCardId});
    case 'USER_PERSONALDATA_SET_PLCC_CARD_NUMBER':
      return Immutable.merge(personalData, {plccCardNumber: action.plccCardNumber});
    case 'USER_PERSONALDATA_SET_USER_ID':
      return Immutable.merge(personalData, {userId: action.userId});
    default:
      return personalData;
  }
}

export * from './actionCreators';
