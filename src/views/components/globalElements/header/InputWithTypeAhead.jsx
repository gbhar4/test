/** @module InputWithTypeAhead
 * @summary  A form that shows search suggestions to the user as he/she types.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {Combobox} from 'views/components/common/form/ComboBox.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.header-typeahead.scss');
} else {
  require('./_m.header-typeahead.scss');
}

class InputWithTypeAheadForm extends React.Component {

  static propTypes = {
    /* indicates device is mobile (results should not close on blur) */
    isMobile: PropTypes.bool.isRequired,

    /**
     * Array of pairs, where each pair has a suggestion headings and an array of
     * suggested strings.
     */
    suggestionsMap: PropTypes.arrayOf(PropTypes.shape({
      heading: PropTypes.string.isRequired,
      suggestions: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        url: PropTypes.string
      })).isRequired
    })).isRequired,

    /** a callback for when the user types a new text (used to load new suggestions map) */
    onTypedTextChange: PropTypes.func.isRequired,
    /** a callback to submit a search for a keywoard */
    onSubmitKeywordSearch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.suggestionsOptionsMap = this.getSuggestionsOptionsMap(props.suggestionsMap);

    this.handleSearch = this.handleSearch.bind(this);
    this.handleTypedValueChange = this.handleTypedValueChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.suggestionsMap !== this.props.suggestionsMap) {
      this.suggestionsOptionsMap = this.getSuggestionsOptionsMap(nextProps.suggestionsMap);
    }
    if (this.props.optionsMap !== nextProps.optionsMap && this.state.highlightedIndex > 0) {
      // sync. this.state.highlightedIndex with the new optionsMap
      // (to point to the smae highlighted item as now if possible)
      this.setState({highlightedIndex: this.getIndexOfValue(nextProps.optionsMap, this.props.optionsMap[this.state.highlightedIndex].value)});
    }
  }

  render () {
    let {isMobile, handleSubmit, pristine, submitting, invalid} = this.props;
    let searchButton = <button type="submit" disabled={pristine || submitting || invalid} title="search" aria-label="Search" className="button-search" />;

    return (
      <form className="typeahead" onSubmit={handleSubmit(this.handleSearch)}>
        {isMobile && searchButton}
        <Field component={Combobox} name="typeahead" className="display-search-suggested-keywords" optionsMap={this.suggestionsOptionsMap} placeholder="Search"
          expandOnChange expandOnFocus closeOnBlur={!isMobile} onSelectCallback={this.handleSearch} onTypedValueChange={this.handleTypedValueChange} autoComplete="off" />
        {!isMobile && searchButton}
      </form>
    );
  }

  // --------------- private methods --------------- //

  handleSearch () {
    // Observe that since submission can occur by capturing the select events in the combobox
    // we need to wait for the next event loop for the value in the redux-store to reflect the one in the combobox

    setTimeout(
      this.props.handleSubmit((values) => {
        this.props.onSubmitKeywordSearch(values.typeahead);
        this.props.reset();     // clear the form, for next round (in case this component stays mounted)
      })
    );
  }

  handleTypedValueChange (event) {
    this.props.onTypedTextChange(event.target.value)
    .catch(() => {});
  }

  getSuggestionsOptionsMap (suggestionsMap) {
    let result = [];
    for (let i = 0; i < suggestionsMap.length; i++) {
      let suggestionsCategory = suggestionsMap[i];
      if (suggestionsCategory.suggestions.length > 0) {
        result.push({
          value: suggestionsCategory.heading,
          content: <CategoryHeading text={suggestionsCategory.heading} />,
          disabled: true
        });
        for (let j = 0; j < suggestionsCategory.suggestions.length; j++) {
          let suggestion = suggestionsCategory.suggestions[j];
          result.push({
            value: suggestion.text,
            content: suggestion.url ? <LinkItem text={suggestion.text} url={suggestion.url} /> : <KeywordItem text={suggestion.text} />,
            disabled: !!suggestion.url      // the double negation is to convert it to Boolean
          });
        }
      }
    }
    return result;
  }

  // --------------- end of private methods --------------- //

}

/** component to render category headings in suggestions dropdown */
function CategoryHeading (props) {
  return (
    <h4>{props.text}</h4>
  );
}

/** component to render keywords in suggestions dropdown */
function KeywordItem (props) {
  return (
    <span>{props.text}</span>
  );
}

/** component to render category links in suggestions dropdown */
function LinkItem (props) {
  return (
    <a title={props.text} href={props.url}>{props.text}</a>
  );
}

let validateMethod = createValidateMethod({
  rules: {
    typeahead: {
      required: true,
      nonEmpty: true
    }
  }
});

let InputWithTypeAhead = reduxForm({
  form: 'searchWithTypeaheadForm',  // a unique identifier for this form
  ...validateMethod,
  touchOnBlur: false          // this prevents validation errors from showing when the user exits the input field
})(InputWithTypeAheadForm);

export {InputWithTypeAhead};
