/**
 * @module SiteStoresList
 *
 * @author Florencia <facosta@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {StoreSummaryCondensed} from 'views/components/store/detail/StoreSummaryCondensed.jsx';
import {STORE_SUMMARY_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/storesPropTypes';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {scrollToFirstMatchingElement, scrollToElement} from 'util/viewUtil/scrollingAndFocusing';
import {Accordion} from 'views/components/accordion/Accordion.jsx';
import {getPositionFromEvent} from 'util/viewUtil/getPositionFromEvent.js';
import {findElementPosition} from 'util/viewUtil/findElementPosition.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.store-search.scss');
} else {
  require('./_m.store-search.scss');
}
let alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'k', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
];

const COUNTRY_STORES_BY_STATE_PROP_TYPES = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    storesList: PropTypes.arrayOf(STORE_SUMMARY_PROP_TYPES_SHAPE).isRequired
  }));

class SiteStoresList extends React.Component {
  static propTypes = {
    usStoresByState: COUNTRY_STORES_BY_STATE_PROP_TYPES,
    caStoresByState: COUNTRY_STORES_BY_STATE_PROP_TYPES,
    isMobile: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      selectedState: ''
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleScrollToLetter = this.handleScrollToLetter.bind(this);
    this.captureLetterContainerRef = this.captureLetterContainerRef.bind(this);
  }

  handleStateChange (event) {
    this.setState({selectedState: event.target.value});
    scrollToFirstMatchingElement('data-state', event.target.value);
  }

  captureLetterContainerRef (ref) {
    this.letterContainer = ref;
  }

  handleScrollToLetter (e) {
    e.preventDefault();
    e.stopPropagation();

    let position = getPositionFromEvent(e); // get the position of the finger
    let containerPosition = findElementPosition(this.letterContainer); // get the position of the container for letters
    let percentage = (position.top - containerPosition.top) / this.letterContainer.offsetHeight; // calculate the percentage offset of finger position vs container height
    let childCount = this.letterContainer.children.length;
    let currChild = this.letterContainer.children[Math.round(childCount * percentage)]; // look for the button located at the calculated percentaje
    let closestButton = currChild.querySelector('button');
    let elems = document.querySelectorAll('.country-or-state-list h4');
    let targetLetter = (closestButton.innerText || '').toLowerCase();

    // and scroll to that letter
    for (var i = 0; i < elems.length; i++) {
      let letter = (elems[i].innerText || '').trim().substr(0, 1).toLowerCase();

      if (letter === targetLetter) {
        scrollToElement(elems[i], 15);
        break;
      }
    }
  }

  render () {
    let { usStoresByState, caStoresByState, isMobile, isCanada } = this.props;
    let { selectedState } = this.state;

    let usStoresByStatePrefixedState = usStoresByState.map((state) => ({
      ...state,
      id: 'us-' + state.id
    }));
    let caStoresByStatePrefixedState = caStoresByState.map((state) => ({
      ...state,
      id: 'ca-' + state.id
    }));

    let storesByState = usStoresByStatePrefixedState
      .concat([{id: '--', displayName: '-----------', disabled: true}])
      .concat(caStoresByStatePrefixedState);
    let locationType = isCanada ? 'Province' : 'State';
    return (
      <section className="store-search-container stores-info">

        {isMobile
          ? <div className="container-header-search">
            <p className="container-button">
              <HyperLink destination={PAGES.storeLocator} className="button-return"> Return to Store Finder</HyperLink>
            </p>
            <h1 className="store-search-title">Find a store by state or province</h1>
          </div>
          : <div className="container-header-search">
            <HyperLink destination={PAGES.storeLocator} className="button-return"> Return to Store Finder</HyperLink>
            <form className="search-container">
              <h1 className="store-search-title">Search for stores by {locationType}</h1>
              <LabeledSelect name="searchType" title="" placeholder={'Choose a ' + locationType} className="select-store"
                optionsMap={storesByState} input={{value: selectedState}} onChange={this.handleStateChange} />
            </form>
          </div>
          }

        <div className="country-or-state-list-container">
          {storesByState.map((state) => (
            state.id === '--'
            ? (
              <div key={state.id} className="country-or-state-list" data-state={state.id}>
                --------------------
              </div>
            ) : (
              isMobile ? <Accordion key={state.id} title={state.displayName} className="country-or-state-list">
                <div className="store-list">
                  {state.storesList.map((store) => {
                    return (<StoreSummaryCondensed key={store.basicInfo.id} store={store} isShowCtas={false} isStoreNameLink isMobile={isMobile} />);
                  })}
                </div>
              </Accordion>
              : <div key={state.id} className="country-or-state-list" data-state={state.id}>
                <h3 className="country-or-state-name">{state.displayName}</h3>
                <div className="store-list">
                {state.storesList.map((store) => {
                  return (<StoreSummaryCondensed key={store.basicInfo.id} store={store} isShowCtas={false} isStoreNameLink isMobile={isMobile} />);
                })}
                </div>
              </div>
            )
          ))}
        </div>

        {isMobile && <ul ref={this.captureLetterContainerRef} className="list-alphabet" onTouchStart={this.handleScrollToLetter} onTouchMove={this.handleScrollToLetter}>
          { alphabet.map((letter) => <li className="letter"><button type="button">{letter.toUpperCase()}</button></li>) }
        </ul>}
      </section>
    );
  }
}

export {SiteStoresList};
