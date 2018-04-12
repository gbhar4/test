/**
 * @module EmptySearchResultsFormPLP
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {InputWithTypeAheadContainer} from 'views/components/globalElements/header/InputWithTypeAheadContainer.js';
import {sanitizeEntity} from 'service/apiUtil.js';
import cssClassName from 'util/viewUtil/cssClassName';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-listing-empty.scss');
} else {
  require('./_m.product-listing-empty.scss');
}

export class EmptySearchResultsFormPLP extends React.Component {
  static propTypes = {
    /** term(s) currently engaged on search as searchable key(s) (e.g., Red or Pants or Red Pants) */
    currentSearchTerm: PropTypes.string.isRequired
  }

  render () {
    let {currentSearchTerm} = this.props;
    let containerClassName = cssClassName('main-section-container ', ' search-result-empty-container');
    return (
      <main className={containerClassName}>
        <h2 className="empty-search-result-title">Nothing matched your search for <br />&quot;{sanitizeEntity(currentSearchTerm)}&quot;.</h2>
        {/* NOTE: DT-31231 Enhancement */}
        <ContentSlot contentSlotName="search_result_no_items" className="empty-search-result-slot" />

        <InputWithTypeAheadContainer />
        <div className="search-tips-message-container">
          <h4 className="search-tips-title">Tips for Searching</h4>
          <p className="search-tips-items">
            Check your spelling <br />
            Use simplified keywords (jeans, tee, top, hat, dress) <br />
            Try searching by themes/categories (dinosaur, active, uniform, pj set) <br />
            Try broader searches and then narrow your results
          </p>
        </div>
        {/** RECOMMENDATIONS IS MISSING */}
      </main>
    );
  }
}
