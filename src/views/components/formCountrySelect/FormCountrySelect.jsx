/**
 * @module FormCountrySelect
 * Modal form to allow the user to change current country, language and currency
 * settings for the site.
 *
 * @author Oliver Ramírez
 * @author Miguel Alvarze Igarzábal
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {AdaptiveField} from 'reduxStore/util/AdaptiveField';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

require('./_form-country-selector.scss');

if (DESKTOP) { // eslint-disable-line
  require('./_d.form-country-selector.scss');
}

const EMPTY_MAP = [];

class _FormCountrySelect extends React.Component {

  static propTypes = {
    /** flags if we should render for mobile. */
    isMobile: PropTypes.bool,

    /** a map of available couuntries to choose from */
    countriesMap: PropTypes.arrayOf(PropTypes.shape({
      /** country code like "GR" */
      id: PropTypes.string.isRequired,
      /** country name like "Greece" */
      displayName: PropTypes.string.isRequired,
      /** the site code of the site that serves users from this country (see the stitesTable prop) */
      siteId: PropTypes.string.isRequired,
      /** the code of the currency used in this country (e.g., "USD") */
      currencyId: PropTypes.string.isRequired,
      /** flags if the currencyId above is the only one we supoport for users from this country  */
      disallowOtherCurrencies: PropTypes.bool
    })).isRequired,

    /** A table of the sites we have.
     * This is a symbol-table, i.e., it is an object whose properties are site codes;
     * and the value of each such property is an array of languages supported by that site.
     */
    sitesTable: PropTypes.objectOf(
      PropTypes.shape({
        /** the list of languages supported by this site */
        languages: PropTypes.arrayOf(PropTypes.shape({
          /** the code of this languge (e.g., "EN") */
          id: PropTypes.string.isRequired,
          /** the name of this language (e.g., "English") */
          displayName: PropTypes.string.isRequired
        })).isRequired
      })
    ).isRequired,

    /** a map of available currencies to choose from */
    currenciesMap: PropTypes.arrayOf(PropTypes.shape({
      /** the code of this currency (e.g., "USD") */
      id: PropTypes.string.isRequired,
      /** the name of this currency (e.g., "Euro") */
      displayName: PropTypes.string.isRequired
    })).isRequired,

    /** Props passed by the redux-form Form HOC. */
    ...reduxFormPropTypes
  }

  constructor (props) {
    super(props);

    this.mapValuesToLanguageProps = this.mapValuesToLanguageProps.bind(this);
    this.mapValuesToCurrencyProps = this.mapValuesToCurrencyProps.bind(this);
  }

// ----- beginning of  protected methods

  /**
   * @protected
   * @return the countriesMap entry for the given country
   */
  getCountryEntry (countryID) {
    return this.props.countriesMap.find((country) => country.id === countryID);
  }

  /**
   * @protected
   * @return the optionsMap to be used by languages dropdown
   */
  getLangaugesMap (countryEntry) {
    if (!countryEntry) return EMPTY_MAP;     // this should never happen
    if (!countryEntry.siteId || !this.props.sitesTable[countryEntry.siteId]) return EMPTY_MAP;     // this should never happen
    return this.props.sitesTable[countryEntry.siteId].languages;
  }

  mapValuesToLanguageProps (values) {
    let countryEntry = this.getCountryEntry(values.country);
    let languagesMap = this.getLangaugesMap(countryEntry);

    if (!languagesMap.find((language) => language.id === values._myValue)) {
      return {
        optionsMap: languagesMap,
        // select the first available language
        _newValue: languagesMap.length > 0 ? languagesMap[0].id : ''
      };
    } else {      // current language is valid for the new country
      return {optionsMap: languagesMap};
    }
  }

  mapValuesToCurrencyProps (values) {
    let countryEntry = this.getCountryEntry(values.country);

    return {
      _newValue: countryEntry.currencyId,
      disabled: countryEntry && countryEntry.disallowOtherCurrencies
    };
  }

// ----- end of module protected code

  render () {
    let {countriesMap, currenciesMap, error, handleSubmit, onCloseClick} = this.props;

    // REVIEW: this 'if' doesn't look right. the deeplink for country selector (us/home/ship-to)
    // will trigger before the country service returns, so we cannot render this component yet
    // we'll need to wait (return null) until we get values on countriesMap
    // only needed for local testing, as the server-rendered version will have the map already
    if (!this.props.countriesMap.length) {
      return null;
    }

    return (
      <form className="container-popup" onSubmit={handleSubmit}>
        <ModalHeaderDisplayContainer title="Ship to" subtitle="Change Shipping Preference" onCloseClick={onCloseClick} />

        {error && <ErrorMessage error={error} />}

        <fieldset className="country-selector-elements">
          <Field component={LabeledSelect} name="country" className="select-country" optionsMap={countriesMap} title="Country" />
          <AdaptiveField name="language" component={LabeledSelect} className="select-language" title="Language"
            adaptTo="country" mapValuesToProps={this.mapValuesToLanguageProps} optionsMap={EMPTY_MAP} />
          <AdaptiveField name="currency" component={LabeledSelect} className="select-currency" optionsMap={currenciesMap} title="Currency"
            adaptTo="country" mapValuesToProps={this.mapValuesToCurrencyProps} />
          <button className="button-primary" type="submit">Save</button>

          <p className="note-clarification">
            <span className="note-clarification-title">Note: </span>
            {/* FIXME: use map for links instead of hardcoding */}
            If you change your shipping destination, your shopping bag will be emptied and you’ll have to add your items again. Coupons and promotions may vary based on shipping destinations. Please read applicable <HyperLink destination={PAGES.helpCenter} pathSuffix="#termsAndConditionsli" target="_blank">Terms & Conditions</HyperLink>.
          </p>
        </fieldset>
      </form>
    );
  }

}

let validateMethod = createValidateMethod(getStandardConfig(['country', 'language', 'currency']));

let FormCountrySelect = reduxForm({
  form: 'countrySelectForm',
  ...validateMethod
})(_FormCountrySelect);

export {FormCountrySelect};
