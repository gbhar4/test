/** @module ShareModalsContainer
 * @author Agu
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ShareModals} from './ShareModals.jsx';
import {getFavoritesFormOperator} from 'reduxStore/storeOperators/formOperators/favoritesFormOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    initialValues: {
      shareFromEmailAddresses: userStoreView.getUserEmail(state) || ''
    },
    onSubmit: storeOperators.favoritesFormOperator.submitShareWishlistByEmail
  };
}

let ShareModalsContainer = connectPlusStoreOperators({
  favoritesFormOperator: getFavoritesFormOperator
}, mapStateToProps)(ShareModals);

export {ShareModalsContainer};
