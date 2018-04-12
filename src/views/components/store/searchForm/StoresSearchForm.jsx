/** @module Store Map location
 *  @summary A speficif component to display google maps in a section
 *   @author Damián Rossi <drossi@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {LabeledInputGoogleAutoComplete, getAddressLocationInfo} from 'views/components/common/form/LabeledInputGoogleAutoComplete.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';

if (DESKTOP) { // eslint-disable-line
  require('./_d.store-search.scss');
} else {
  require('./_m.store-search.scss');
}

const INITIAL_STORE_LIMIT = 5;

class _StoresSearchForm extends React.Component {
  static propTypes = {
    /** the country to restrict the autocomplete functionality */
    country: PropTypes.string.isRequired,

    /** flags if we are in mobile */
    isMobile: PropTypes.bool,
    /** callback to load the stores near certain coordinates */
    loadStoresByLatLng: PropTypes.func.isRequired,
    /**
     * Function to call when the Show Only BOPIS Stores checkbox changes. This
     * function will receive one boolean parameter with the status of the Show
     * Only Bopis Stores checkbox.
     */
    onShowOnlyBopisStoresChange: PropTypes.func.isRequired,
    /**
     * Function to call when the Show Only Outlet Stores checkbox changes. This
     * function will receive one boolean parameter with the new status of the
     * checkbox.
     */
    onShowOnlyOutletStoresChange: PropTypes.func.isRequired,
    onMapClick: PropTypes.func.isRequired,
    onListClick: PropTypes.func.isRequired,
    /* Quantity of filtered stores */
    filteredStoresQuantity: PropTypes.number,
    ...reduxFormPropTypes
  }

  state = {
    isExpanded: !this.props.isMobile
  }

  constructor (props) {
    super(props);

    this.handlePlaceSelected = this.handlePlaceSelected.bind(this);
    this.handleInstorePickupChange = (event, newValue) => this.props.onShowOnlyBopisStoresChange(newValue);
    this.handleOutletStoresChange = (event, newValue) => this.props.onShowOnlyOutletStoresChange(newValue);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleFilterExpanded = this.handleFilterExpanded.bind(this);
  }

  handleFilterExpanded () {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded
    }));
  }

  componentDidMount () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        this.props.loadStoresByLatLng(
          Promise.resolve({lat: () => pos.coords.latitude, lng: () => pos.coords.longitude}), INITIAL_STORE_LIMIT)
      );
    }
  }

  handlePlaceSelected (place) {
    if (!place.geometry && !place.location || this.props.submitting) {
      return;
    }
    let {lat, lng} = place.geometry ? place.geometry.location : place.location;
    this.props.loadStoresByLatLng(Promise.resolve({lat, lng}), INITIAL_STORE_LIMIT);
  }

  onSubmit (formData) {
    if (!this.props.submitting) {
      this.setState({ errorNotFound: null });
      return this.props.loadStoresByLatLng(getAddressLocationInfo(formData.addressLocation).catch(() => this.setState({ errorNotFound: true })), INITIAL_STORE_LIMIT);
    }
  }

  render () {
    let { isMobile, onListClick, onMapClick, isShowStoresMap,
      filteredStoresQuantity, handleSubmit, error, country } = this.props;
    let { isExpanded, errorNotFound } = this.state;

    let listClassName = cssClassName('display-list ', {'disabled': isShowStoresMap});
    let mapClassName = cssClassName('display-map ', {'disabled ': !isShowStoresMap});
    let errorMessage = errorNotFound ? 'Please enter a valid address and try again.' : error;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="search-store-form">
        <div className="search-store-input">
          <button type="submit" title="search" className="button-search-store" />
          <Field name="addressLocation" component={LabeledInputGoogleAutoComplete} title="Enter Address, City, State, or Zip Code"
            onPlaceSelected={this.handlePlaceSelected} componentRestrictions={{country: country}} />
        </div>

        {errorMessage && <ErrorMessage error={errorMessage} />}

        {isMobile && <div className="toggle-list-map">
          <span className={listClassName} onClick={onListClick}>List</span>
          <span className={mapClassName} onClick={onMapClick}>Map</span>
        </div>}

        {isMobile
          ? <span className="filter-store" onClick={this.handleFilterExpanded}>Filter ({filteredStoresQuantity})</span>
          : <span className="show-only">Show Only: </span>
        }

        {isExpanded && <div className="content-filters">
          {/* NOTE: DT-24896 (change's requirement: DT-588, "In-store Pickup Available" filter disabled) */}
          {/* <Field component={LabeledCheckbox} className="in-store-pick-up-option" name="instore-pickup"
            title="In-store Pickup Available" onChange={this.handleInstorePickupChange} /> */}
          <Field component={LabeledCheckbox} className="outlet-stores-option" name="outlet-stores"
            title="Outlet stores" onChange={this.handleOutletStoresChange} />
        </div>}
      </form>
    );
  }
}

let validateMethod = createValidateMethod({
  rules: {
    addressLocation: {
      required: true,
      address: true,
      minLength: 5
    }
  },
  messages: {
    addressLocation: {
      required: 'Please enter a valid street address',
      address: 'The value entered in the street address has special character',
      minLength: 'Please enter a valid street address'
    }
  }
});

let StoresSearchForm = reduxForm({
  form: 'storessearchform',
  ...validateMethod
})(_StoresSearchForm);

export {StoresSearchForm};
