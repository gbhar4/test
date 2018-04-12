/**
 * @module CountrySelector
 * @author Florencia Acosta
 * @author Miguel Alvarez Igarzábal
 * Shows currently selected country and language, and serves as CTA for opening
 * the modal to change these.
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ModalFormCountrySelectContainer} from 'views/components/formCountrySelect/ModalFormCountrySelectContainer.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.country-selector.scss');
} else {
  require('./_m.country-selector.scss');
}

class CountrySelector extends React.Component {
  static propTypes = {
    /** Language code currently selected by the user. */
    currentLanguage: PropTypes.string.isRequired,

    /** Array of language codes. */
    languages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired
    })).isRequired,

    /** The currently selected country. */
    currentCountry: PropTypes.string.isRequired,

    /** Image url for the flag of the currently selected country. */
    currentCountryImage: PropTypes.string.isRequired,

    /** callback for opening the country selection modal */
    onOpenCountrySelectModalClick: PropTypes.func.isRequired
  }

  render () {
    let {currentLanguage, languages, currentCountry, currentCountryImage, onOpenCountrySelectModalClick} = this.props;
    let buttonLabel = `Ship to ${currentCountry}. Select button to choose a different country.`;
    return (
      <div className="country-selector">
        <h3 className="title-country-selector">Ship To</h3>
        <button type="button" onClick={onOpenCountrySelectModalClick} aria-label={buttonLabel}>
          <img className="flag-coutry-selector" src={currentCountryImage} alt={`${currentCountry} flag`} />
        </button>
        <div className="content-language">
          {languages.map((language) => { // render each language
            return <button onClick={onOpenCountrySelectModalClick}
              key={language.id}
              className={language.id === currentLanguage ? 'selected-language' : ''}
              aria-label={language.displayName}>{language.id}</button>;
          })}
        </div>
        <ModalFormCountrySelectContainer />
      </div>
    );
  }
}

export {CountrySelector};
