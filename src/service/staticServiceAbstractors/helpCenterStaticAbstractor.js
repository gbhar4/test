/**
@module Help Center Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';

export function getHelpCenterAbstractor () {
  return HelpCenterStaticAbstractor;
}

const HelpCenterStaticAbstractor = {
  sendEmailForContactUs: function (formData) {
    return editJsonPopup('sendEmailForContactUs', {success: true}, formData);
  }
};
