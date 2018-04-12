/** @module BopisInventoryStoresSearchForm
 *
 * @summary A form allowing selecting the editable details of a cart item to search for stores inventory in a given area.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm, Field, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getAddressLocationInfo} from 'views/components/common/form/LabeledInputGoogleAutoComplete.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {BopisProductFormPart, BOPIS_PRODUCT_INFO_PROP_TYPES} from './BopisProductFormPart.jsx';
import {BopisProductFormPartContainer} from './BopisProductFormPartContainer';
import {getSkuId} from 'util/viewUtil/productsCommonUtils';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {BopisStoresListContainer} from './BopisStoresListContainer';

export const DISTANCES_MAP_PROP_TYPE = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired
}));

class _BopisInventoryStoresSearchForm extends React.Component {
  static propTypes = {
    /** the whole product details */
    ...BOPIS_PRODUCT_INFO_PROP_TYPES,
    /** The map of distances options to select the radius of search */
    distancesMap: DISTANCES_MAP_PROP_TYPE.isRequired,
    /** flags if to search in current cart stores (if true)
     * or offer user to enter location to look for nearby stores (if false)
     */
    isSearchOnlyInCartStores: PropTypes.bool.isRequired,
    /** Callback for submitting this form. its parameters depend on the value of the prop
     * isSearchOnlyInCartStores as follows:
     * if true then it accepts skuId, quantity;
     * if false then it accepts locationPromise, skuId, quantity;
     * where locationPromise resolves to a location object with lat() and lng() methods that return the
     * latitude and longitude around which to search.
     */
    onSubmit: PropTypes.func.isRequired,
    /**
     * Callback for adding an item to cart for pickup isn the selected store.
     * Accepts: storeId, skuId (of the selected color/fit/size combination), quantity
     */
    onAddItemToCart: PropTypes.func.isRequired,

    /** We need to differentiate if Bopis Modal is open from cart or other place to change select item button's message (DT-27100) */
    isShoppingBag: PropTypes.bool,

    /** indicates the 'extended' sizes not available for bopis notification needs to show
     * (only when user attempted to select it)
     */
    isShowExtendedSizesNotification: PropTypes.bool.isRequired,

    /**
     * indicates the modal is shown because of an error trying to add to the preferred store
     * (required only in PDP)
     */
    isPreferredStoreError: PropTypes.bool,

    /** Props passed by the redux-form Form HOC. */
    ...reduxFormPropTypes
  }

  constructor (props) {
    super(props);

    this.place = null;
    this.formData = null;

    this.onSearch = this.onSearch.bind(this);
    // this.handlePlaceSelected = (place) => { this.place = place; };
    // this.handleAddressLocationChange = () => { this.place = null; /* forget place whenever the user types in address line */ };
    this.handleStoreSelect = (storeId) => this.props.onAddItemToCart({ ...this.formData, storeId });
    this.untouch = this.untouch.bind(this);
  }

  untouch () {
    this.props.untouch('color');
    this.props.untouch('size');
    this.props.untouch('fit');
    this.props.untouch('quantity');
    this.props.untouch('addressLocation');
    this.props.untouch('distance');
  }

  onSearch (formData) {
    let skuId = getSkuId(this.props.colorFitsSizesMap, formData.color, formData.fit, formData.size);
    if (this.props.isSearchOnlyInCartStores) {
      return this.props.onSubmit(skuId, formData.quantity)
      .then(() => {
        this.formData = { ...formData, skuId };
        this.untouch();
      });
    } else {
      let locationPromise = this.place
        ? Promise.resolve(this.place.geometry.location)
        : getAddressLocationInfo(formData.addressLocation);
      return this.props.onSubmit(skuId, formData.quantity, formData.distance, locationPromise)
      .then(() => {
        this.formData = { ...formData, skuId };
        this.untouch();
      });
    }
  }

  render () {
    let {isShoppingBag, isShowExtendedSizesNotification, isPreferredStoreError, submitting, pristine, handleSubmit, error, change, touch, isSearchOnlyInCartStores, distancesMap,
      name, listPrice, offerPrice, imagePath, colorFitsSizesMap, onCloseClick} = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSearch)} className="bopis-product-container">
        <BopisProductFormPartContainer colorFitsSizesMap={colorFitsSizesMap} name={name}
          isShowExtendedSizesNotification={isShowExtendedSizesNotification}
          isPreferredStoreError={isPreferredStoreError}
          listPrice={listPrice} offerPrice={offerPrice} imagePath={imagePath} change={change} touch={touch}
          isShowSubmitButton={isSearchOnlyInCartStores} isDisabledSubmitButton={submitting} />

        {!isSearchOnlyInCartStores &&
            <div className="search-store">
              <Field title="Zip or City, State" name="addressLocation" className="address-location-input" component={LabeledInput}
                placeholder="Zip or City, State" />
              <Field name="distance" component={LabeledSelect} optionsMap={distancesMap} className="distance-input" title="Distance" />
              <button type="submit" title="search" className="button-search-bopis" disabled={pristine || submitting}>Search</button>
            </div>
          }

        {submitting
          ? <Spinner />
          : this.formData && !this.props.anyTouched && (
            <BopisStoresListContainer isShoppingBag={isShoppingBag} onStoreSelect={this.handleStoreSelect}
              isResultOfSearchingInCartStores={isSearchOnlyInCartStores} onCancel={onCloseClick} />
          )
        }

        {error && <div className="error-box-bopis">
          <p className="error-message">{error}</p>
          <button onClick={onCloseClick} className="button-cancel">Cancel</button>
        </div>}
      </form>
    );
  }
}

let validateMethod = createValidateMethod(BopisProductFormPart.defaultValidation);

let BopisInventoryStoresSearchForm = reduxForm({
  form: 'bopisSearchStoresForm',
  ...validateMethod,
  keepDirtyOnReinitialize: true, // [https://github.com/erikras/redux-form/issues/3690] redux-forms 7.2.0 causes bug that forms will reInit after mount setting changed values back to init values 
  touchOnChange: true,   // to show validation error messageas even if user did not touch the fields
  touchOnBlur: false    // to avoid hidding the search results on blur of any field without changes
})(_BopisInventoryStoresSearchForm);
BopisInventoryStoresSearchForm.displayName = 'BopisInventoryStoresSearchForm';

export {BopisInventoryStoresSearchForm};
