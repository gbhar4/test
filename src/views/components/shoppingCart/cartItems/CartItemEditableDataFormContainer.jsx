/** @module CartItemEditableDataFormContainer
 *
 * @summary A container component for {@linkcode CartItemEditableDataForm}.
 *
 * The main purpose of this component is to inject as props to CartItemEditableDataForm the
 * current values the user selected in that form for the color and fit. This allows the fit and size dropdowns
 * to adapt to the color and fir selections, respectively.
 *
 * @author Ben
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CartItemEditableDataForm} from './CartItemEditableDataForm.jsx';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';

const FORM_NAME_PREFIX = 'Cart Edit ';

const PROP_TYPES = {
  /** the id of this item in the cart */
  itemId: PropTypes.string.isRequired,

  /** This identifies the product regardless of color/fit/size (i.e., changing size/fit/color does not change this value) */
  generalProductId: PropTypes.string.isRequired,

  /** The color/pattern to pre-populate the form with */
  initialColor: PropTypes.shape({
    /** The color's name (e.g. 'Clay') */
    name: PropTypes.string.isRequired,
    /** The url to an image displaying this color/pattern */
    imagePath: PropTypes.string
  }),

  /** The fit (e.g. 'slim') to pre-populate the form with */
  initialFit: PropTypes.string,

  /** The size (e.g. '5S') to pre-populate the form with */
  initialSize: PropTypes.string.isRequired,

  /** The quantity of this item in the cart to pre-populate the form with */
  initialQuantity: PropTypes.number.isRequired
};

let getFormName = function (itemId) {
  return FORM_NAME_PREFIX + itemId;
};

function mapStateToProps (state, ownProps, storeOperators) {
  let {itemId, initialColor, initialFit, initialSize, initialQuantity } = ownProps;  // eslint-disable-line

  let formName = getFormName(itemId);
  return {
    onSubmit: storeOperators.cartFormOperator.submitUpdateCartItem,
    onCancelClick: storeOperators.cartOperator.resetCartItemEditMode,
    onColorChange: storeOperators.cartOperator.updateItemDetailsOptionsMap,
    form: formName,     // a unique name for the wrapped redux form
    initialValues: {                        // the initial values for the wrapped redux form
      color: initialColor.name,
      fit: initialFit,
      size: initialSize,
      quantity: initialQuantity.toString()
    },
    colorFitsSizesMap: cartStoreView.getItem(state, itemId).miscInfo.detailsOptionsMap
  };
}

// we need this to prevent the extra props of this container object from being propagated to the contained form
function mergeProps (stateProps, dispatchProps, ownProps) {
  let {generalProductId, initialColor, initialFit, initialSize, initialQuantity, // eslint-disable-line no-unused-vars
    ...otherProps} = ownProps;
  return {...stateProps, ...dispatchProps, ...otherProps};
}

let CartItemEditableDataFormContainer = connectPlusStoreOperators({
  cartOperator: getCartOperator,
  cartFormOperator: getCartFormOperator
}, mapStateToProps, null, mergeProps)(CartItemEditableDataForm);
CartItemEditableDataFormContainer.propTypes = {...CartItemEditableDataFormContainer.propTypes, ...PROP_TYPES};

export {CartItemEditableDataFormContainer};
