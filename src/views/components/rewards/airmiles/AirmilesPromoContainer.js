/**
 * @author Oliver Ramirez
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {AirmilesPromo} from './AirmilesPromo.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  let airmilesDetails = userStoreView.getAirmilesDetails(state);

  return {
    onSubmit: storeOperators.checkoutFormOperator.submitAirmilesData,
    airmilesNumber: cartStoreView.getEstimatedAirMiles(state),
    initialValues: {
      ...airmilesDetails
    },
    buttonTextNumber: 'Look for your 11-digit Collector Number on your AIR MLES® Card or on your digital AIR MILES® Card in the AIR MILES® app',
    buttonTextId: 'Promo IDs are provided during limited time bonus events and help you earn AIR MILES® reward miles even faster. Promo ID is not required to earn AIR MILES®.'
  };
}

let AirmilesPromoContainer = connectPlusStoreOperators({
  checkoutFormOperator: getCheckoutFormOperator
}, mapStateToProps)(AirmilesPromo);

export {AirmilesPromoContainer};
