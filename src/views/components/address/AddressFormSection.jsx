/** @module AddressFormSection
 * @summary A FormSection component rendering a partial address form, with Google auto-completion.
 *
 * The default name (for use by a containing redux-form) of this form section is 'address'.
 *
 * Provides fields with the following names:
 *   firstName, lastName, addressLine1, addressLine2, city, state, zipCode, country.
 *
 * Provide a static defaultValidation property that is an object that can be passed to
 *  util/formsValidation/createValidateMethod.
 *
 *  This component extends redux-form's FormSection component.
 *
 * @author Ben
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledInputGoogleAutoComplete} from 'views/components/common/form/LabeledInputGoogleAutoComplete.jsx';
import {AdaptiveField} from 'reduxStore/util/AdaptiveField';
import {FormValuesChangeTrigger} from 'reduxStore/util/FormValuesChangeTrigger.jsx';
import {InstrumentedFormSection} from 'reduxStore/util/InstrumentedFormSection.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ModalFormCountrySelectContainer} from 'views/components/formCountrySelect/ModalFormCountrySelectContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';

const EMPTY_MAP = [];

if (DESKTOP) { // eslint-disable-line
  require('./_d.address-form-section.scss');
} else {
  require('./_m.address-form-section.scss');
}

// note that we are extending InstrumentedFormSection (and not React.Component) just so that we can provide a default 'name' prop.
class AddressFormSection extends InstrumentedFormSection {

  static propTypes = {
    /** A map of the available countries to choose from */
    countriesOptionsMap: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    })),

    /** A table of states by country.
     * This is a symbol-table, i.e., it is an object whose properties are country codes;
     * and the value of each such property is an array of the states in that country.
     */
    countriesStatesTable: PropTypes.objectOf(
      PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired
      }))
    ),

    /** Flags if a "Shipping Internationally?" button should appear below the country field */
    isShowInternationalShippingButton: PropTypes.bool,

    /** Flags if the country field is disabled */
    isDisableCountry: PropTypes.bool,

    /** Flags if Google autocomplete should be disabled */
    isDisableAutoComplete: PropTypes.bool,

    /** Flags if the Google autocompletion should not restrict suggestions to the current country */
    isUnrestrictedAutoCompletionToCountry: PropTypes.bool,

    /** callback to call whenever the user changes state, zipCode, addressLine1 or addressLine2
     * accepts an object with that maps these field names to thewri current values
     * and a second object with the field names of the fields that changed to trigger this call
     **/
    onStateZipOrLineChange: PropTypes.func,

    /**
     * callback to trigger when the user clicks the "shipping internationally?" button
     **/
    onShippingInternationallyClick: PropTypes.func.isRequired,

    /**
     * This prop says if the page loads with parents united states
     **/
    isCountryUS: PropTypes.bool
  }

  static defaultProps = {
    /** the default name of this form section */
    name: 'address'
  }

  static defaultValidation = getStandardConfig([
    'firstName',
    'lastName',
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'zipCode',
    'country'
  ])

  constructor (props, context) {
    super(props, context);
    this.handlePlaceSelected = this.handlePlaceSelected.bind(this);
    this.mapValuesToStateProps = this.mapValuesToStateProps.bind(this);
    this.mapValuesToZipcodeProps = this.mapValuesToZipcodeProps.bind(this);
    this.mapValuesToAutocompleteProps = this.mapValuesToAutocompleteProps.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleZipcodeChange = this.handleZipcodeChange.bind(this);
    this.handleAddressLine1Change = this.handleAddressLine1Change.bind(this);
    this.handleAddressLine2Change = this.handleAddressLine2Change.bind(this);
  }

  mapValuesToStateProps (values) {
    let statesOptionsMap = values.country ? this.props.countriesStatesTable[values.country] || EMPTY_MAP : EMPTY_MAP;

    return {
      optionsMap: statesOptionsMap,
      title: values.country === 'US' ? 'State' : 'Province'
//      disabled: !statesOptionsMap,
       // reset state if country changed.
       // null indicates to validation that the user should select a state
       // '' indicates to validation that there are no states associated with this country
    //  _newValue: statesOptionsMap ? null : ''
    };
  }

  mapValuesToZipcodeProps (values) {
    return {
      type: values.country === 'US' ? 'tel' : 'text',
      title: values.country === 'US' ? 'Zip Code' : 'Postal Code',
      maxLength: values.country === 'US' ? '5' : '6'
    };
  }

  mapValuesToAutocompleteProps (values) {
    if (values.country) {
      // restrict autocomplete predictions to the current country
      return ({componentRestrictions: {country: values.country}});
    }
  }

  handleZipcodeChange (values, _, syncValidityInfo) {
    if (syncValidityInfo.zipCode) {  // if zipCode passes synchronous validation
      this.props.onStateZipOrLineChange(values, {zipCode: true});
    }
  }

  handleStateChange (values) {
    this.props.onStateZipOrLineChange(values, {state: true});
  }

  handleAddressLine1Change (values) {
    this.props.onStateZipOrLineChange(values, {addressLine1: true});
  }

  handleAddressLine2Change (values) {
    this.props.onStateZipOrLineChange(values, {addressLine2: true});
  }

  render () {
    let {
      isShowInternationalShippingButton,
      isDisableCountry,
      isUnrestrictedAutoCompletionToCountry,
      isDisableAutoComplete,
      countriesOptionsMap,
      onStateZipOrLineChange,
      onShippingInternationallyClick,
      isCountryUS,
      className
    } = this.props;

    className = cssClassName('fieldset-address-editable ', className);

    return (
      <fieldset className={className}>
        <legend className="sr-only">Address Details</legend>

        {onStateZipOrLineChange &&
          <FormValuesChangeTrigger adaptTo={'state'} extraFields="country, zipCode, addressLine1, addressLine2" doNotTriggerOnMount onChange={this.handleStateChange} doNotTriggerOnMount />
        }

        {onStateZipOrLineChange &&
          <FormValuesChangeTrigger adaptTo={'zipCode'} extraFields="country, state, addressLine1, addressLine2" onChange={this.handleZipcodeChange} doNotTriggerOnMount includeValidityInfo />
        }

        {onStateZipOrLineChange &&
          <FormValuesChangeTrigger adaptTo={'addressLine1'} extraFields="country, state, zipCode, addressLine2" onChange={this.handleAddressLine1Change} doNotTriggerOnMount includeValidityInfo />
        }

        {onStateZipOrLineChange &&
          <FormValuesChangeTrigger adaptTo={'addressLine2'} extraFields="country, state, zipCode, addressLine1" onChange={this.handleAddressLine2Change} doNotTriggerOnMount includeValidityInfo />
        }

        <Field name="firstName" component={LabeledInput} className="input-first-name" title="First Name" />
        <Field name="lastName" component={LabeledInput} className="input-last-name" title="Last Name" />
        {isDisableAutoComplete
          ? <Field name="addressLine1" component={LabeledInput} className="input-address-line1" title="Address Line 1" />
          : isUnrestrictedAutoCompletionToCountry
            ? <Field name="addressLine1" component={LabeledInputGoogleAutoComplete} className="input-address-line1"
              title="Address Line 1" onPlaceSelected={this.handlePlaceSelected} />
            : <AdaptiveField name="addressLine1" component={LabeledInputGoogleAutoComplete} className="input-address-line1"
              title="Address Line 1" onPlaceSelected={this.handlePlaceSelected}
              adaptTo="country" mapValuesToProps={this.mapValuesToAutocompleteProps} />
        }
        <Field name="addressLine2" component={LabeledInput} className="input-address-line2" title="Address Line 2 (Optional)" />

        <Field name="city" component={LabeledInput} className="input-city" title="City" />
        <AdaptiveField name="state" component={LabeledSelect} className="select-state"
          adaptTo="country" mapValuesToProps={this.mapValuesToStateProps} optionsMap={EMPTY_MAP} isHideIfEmptyOptionsMap />

        <AdaptiveField name="zipCode" component={LabeledInput} className="input-zip-code" maxLength={isCountryUS ? '5' : '6'}
          adaptTo="country" mapValuesToProps={this.mapValuesToZipcodeProps} />

        <Field name="country" component={LabeledSelect} className="select-country" title="Country"
          optionsMap={countriesOptionsMap} disabled={isDisableCountry}>
          {isShowInternationalShippingButton &&
            <button type="button" className="button-shipping-internationally" onClick={onShippingInternationallyClick}>Shipping internationally?</button>
          }
        </Field>

        <ModalFormCountrySelectContainer />
      </fieldset>
    );
  }

  handlePlaceSelected (place, inputValue) {
    let address = LabeledInputGoogleAutoComplete.getAddressFromPlace(place, inputValue);     // obtain a new address object based on the given place
    let country = this.props.countriesOptionsMap.find((country) =>
      country.id.toUpperCase() === address.country.toUpperCase() ||
      country.displayName.toUpperCase() === address.country.toUpperCase()
    );
    if (!country) {
      return;             // service returned an address in another country -> ignore
    }

    // dispatch actions to the redux store to change the values of the relevant form fields
    this.changeSectionField('addressLine1', address.street);
    this.changeSectionField('city', address.city);
    this.changeSectionField('country', country.id); // note: country first
    this.changeSectionField('state', address.state);
    this.changeSectionField('zipCode', address.zip);
  }
}

export {AddressFormSection};
