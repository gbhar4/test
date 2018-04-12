/** @module GoogleAutoCompleteAddressInput
 * @summary a LabeledInput element that provides an address auto completion hook using
 *  the Google places API (https://developers.google.com/maps/documentation/javascript/places-autocomplete)
 *
 * Any extra props (i.e., other than <code>onPlaceSelected, types, componentRestrictions, bounds/code>),
 * e.g., <code>name, title, showErrorIfUntouched, meta</code>, passed to this component (either directly or by a wrapping HOC)
 * will be passed along to the rendered <code>LabeledInput</code> element.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {requireNamedOnlineModule} from 'util/resourceLoader';
import {LabeledInput} from './LabeledInput.jsx';

/* global google */      // this comment prevents linting errors

export function getAddressLocationInfo (address) {
  return requireNamedOnlineModule('google.maps')
  .then(() => {
    let geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({address: address}, (results, status) => {
        if (status === 'OK') {
          let country = results[0].address_components.find((component) => {
            return component.types && component.types.find((type) => type === 'country');
          });

          resolve({
            ...results[0].geometry.location,
            country: country && country.short_name
          });
        } else {
          reject(status);
        }
      });
    });
  });
}

export class LabeledInputGoogleAutoComplete extends React.Component {

  static propTypes = {
    /** invoked whenever the user selects a new place in this component
     * Accepts a single parameter describing the selected place as returned by
     * google.maps.places.Autocomplete.getPlace().
     * @see {@link https://developers.google.com/maps/documentation/javascript/reference#PlaceResult.
     */
    onPlaceSelected: PropTypes.func.isRequired,

    /** @see {@link https://developers.google.com/maps/documentation/javascript/reference#AutocompleteOptions}
     * default value is ['(address)']
     */
    types: PropTypes.arrayOf(PropTypes.string),

    /** @see {@link https://developers.google.com/maps/documentation/javascript/reference#AutocompleteOptions}
     * The main use (actually the only use as of Jan. 2017) is to restrict the autocomplete results to a specific
     * country. This is done by passing a simple object with a 'country' field containing the 2-letter country code.
     */
    componentRestrictions: PropTypes.object,

    /** @see {@link https://developers.google.com/maps/documentation/javascript/reference#ComponentRestrictions} */
    bounds: PropTypes.object
  }

  static defaultProps = {
    types: ['address']
  }

  /** An object that describes how the place parts returned by Google are mapped to fields in the returned value of
   * the method getAddressFromPlace().
   * @see {@link https://developers.google.com/maps/documentation/javascript/reference#PlaceResult}.
   */
  static GOOGLE_PLACE_PARTS = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    sublocality_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  /**
   * A method that parses the place result returned by Google auto complete to address fields.
   *
   * @param  {object} place  a place object to parses.
   * @see {@link https://developers.google.com/maps/documentation/javascript/reference#PlaceResult.
   *
   * @return  a plain object with the address, or undefined if autocomplete cannot provide an address for this place.
   * See the static property GOOGLE_PLACE_PARTS for the structure of the returned object.
   */
  static getAddressFromPlace (place, inputValue) {
    let address = {street: '', city: '', state: '', country: '', zip: ''};
    let streetNumber = '';
    let streetName = '';

    if (typeof place.address_components === 'undefined') {
      // FIXME: see http://stackoverflow.com/questions/26622160/google-map-places-api-getplace-only-return-name-attribute-for-some-addresses
      // on ideas how to handle addresses that only contain a name
      return address;
    }

    // Open Issue: for some address google returns wrong city, refer to https://productforums.google.com/forum/#!topic/websearch/8E0TZuSv5fw;context-place=forum/websearch
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      if (LabeledInputGoogleAutoComplete.GOOGLE_PLACE_PARTS[addressType]) {
        let val = place.address_components[i][LabeledInputGoogleAutoComplete.GOOGLE_PLACE_PARTS[addressType]];
        switch (addressType) {
          case 'street_number': streetNumber = val; break;
          case 'route': streetName = val; break;
          case 'locality': address.city = val; break;
          case 'sublocality_level_1': address.city = val; break; // DT-31306 not all cities are under locality
          case 'administrative_area_level_1': address.state = val; break;
          case 'country': address.country = val; break;
          case 'postal_code': address.zip = val; break;
        }
      }
    }

    // DT-31167: For some addresses google does not return the street number, so we need to inject the value from the input
    // https://stackoverflow.com/questions/17936689/google-places-autocomplete-suggestions-with-unit-no-subpremise-is-not-coming-in
    if (!streetNumber) {
      // get all the user entered values before a match with the first word from the Google result
      let regex = RegExp('^(.*)' + streetName.split(' ', 1)[0]);
      let result = regex.exec(inputValue);
      let inputNum = Array.isArray(result) && result[1] && Number(result[1]);

      if (!isNaN(inputNum) && parseInt(inputNum, 10) === inputNum) {
        streetNumber = inputNum;
      }
    }

    address.street = `${streetNumber} ${streetName}`;

    return address;
  }

  constructor (props) {
    super(props);
    this.googleAutocomplete = null;
    this.refToInputElement = null;
    this.inputElementKey = '0';

    this.attachToInputRef = this.attachToInputRef.bind(this);
    this.handleOnPlaceSelected = this.handleOnPlaceSelected.bind(this);
    // this.handleOnChange = this.handleOnChange.bind(this); // unused / undefined?
  }

  componentWillUpdate (nextProps) {
    if (!this.googleAutocomplete) return;

    if (this.props.types !== nextProps.types) {
      this.googleAutocomplete.setTypes(nextProps.types);
    }
    if (this.props.bounds !== nextProps.bounds) {
      this.googleAutocomplete.setBounds(nextProps.bounds);
    }

    if (this.props.componentRestrictions !== nextProps.componentRestrictions) {
      if (nextProps.componentRestrictions) {
        this.googleAutocomplete.setComponentRestrictions(nextProps.componentRestrictions);
      } else {      // no country restriction
        //  setComponentRestrictions() cannot remove all restrictions. Thus, we must use a new autoComplete object
        //  (and stop using the old one).
        //  We do this by changing the key we will use for the LabeledInput in the next render
        //  changing the key forces a dismount from the DOM, and thus a new LabeledInput with a new ref,
        //  and thus a new call to this.attachToInputRef(), and a new autoComplete object
        this.inputElementKey = this.inputElementKey === '0' ? '1' : '0';
      }
    }
  }

  render () {
    let {
      //  not used, but here to prevent inclusion in ...otherProps
      onPlaceSelected, types, componentRestrictions, bounds,       // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    return (
      <LabeledInput {...otherProps} inputRef={this.attachToInputRef} key={this.inputElementKey} />
    );
  }

  // --------------- private methods --------------- //

  getAutoCompleteConfigObject (props) {
    let {types, bounds} = props;
    let componentRestrictions = props.componentRestrictions;
    return componentRestrictions ? {types, bounds, componentRestrictions} : {types, bounds};
    // return {
    //   types: props.types
    // };
  }

  attachToInputRef (refToInputElement) {
    this.refToInputElement = refToInputElement;       // remember the DOM element behind the input element we render

    if (refToInputElement !== null) {    // can be null for example when React unmounts this components
      if (!this.googleAutocomplete) {    // if the googleAutocomplete object was not created
        requireNamedOnlineModule('google.maps')
        .then(() => {
          this.googleAutocomplete = new google.maps.places.Autocomplete(
            refToInputElement, this.getAutoCompleteConfigObject(this.props));
          this.googleAutocomplete.addListener('place_changed', this.handleOnPlaceSelected);
        }).catch(() => null /* do nothing if unable to load googleAutocomplete */);
      } else {
        this.googleAutocomplete = new google.maps.places.Autocomplete(
          refToInputElement, this.getAutoCompleteConfigObject(this.props));
        this.googleAutocomplete.addListener('place_changed', this.handleOnPlaceSelected);
      }
    }
  }

  handleOnPlaceSelected () {
    let inputValue = this.refToInputElement != null && this.refToInputElement.value;

    // the following onChange dispatch is needed because when the user selects a place from
    // the google drop-down the input field is updated by google but no onChange event is fired (and
    // thus handleOnChange does not handle this change).
    this.refToInputElement != null && this.props.input && this.props.input.onChange(this.refToInputElement.value);

    // notify our listeners that the selected place has changed
    // Note that this event must fire after the onChange event (called above) so that we can, for example,
    // have a listener store the place information and clear it whenever the onChange event fires,
    // (if the user just types, and does not select any suggestion, the stored place is no longer relevant).
    this.props.onPlaceSelected(this.googleAutocomplete.getPlace(), inputValue);
  }

  // --------------- end of private methods --------------- //
}
