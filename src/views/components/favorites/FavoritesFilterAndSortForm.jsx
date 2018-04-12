// FIXME: delete this component
/**
* @module FavoritesFilterAndSortToolbar
* @summary It determines the sorting order and the filtering applied to the active wishlist
* @author Gabriel Gomez
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {LabeledRadioButton} from 'views/components/common/form/LabeledRadioButton.jsx';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';

/*
if (DESKTOP) { // eslint-disable-line
  require('./.scss');
} else {
  require('./.scss');
}
*/

const ALL = 'ALL';
const AVAILABLE = 'AVAILABLE';
const SOLDOUT = 'SOLDOUT';
const PURCHASED = 'PURCHASED';

export const AVAILABLE_FILTERS = {
  [ALL]: 'all',
  [AVAILABLE]: 'available',
  [SOLDOUT]: 'sold out',
  [PURCHASED]: 'purchased'
};

export class _FavoritesFilterAndSortForm extends React.Component {

  static propTypes = {
    /** count of items displayed on the screen */
    activeWishlistItemCount: PropTypes.number.isRequired,

    /** callback for favorite filter */
    onApplyFilter: PropTypes.func.isRequired,

    /** callback for favorite list remove click */
    onApplySort: PropTypes.func.isRequired,

    ...reduxFormPropTypes
  };

  constructor (props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
  }

  sortByOptionMap () {
    return [
      {
        id: 'all',
        displayName: 'All'
      },
      {
        id: 'recentlyAdded',
        displayName: 'Recently Added'
      },
      {
        id: 'available',
        displayName: 'Available'
      },
      {
        id: 'soldOut',
        displayName: 'Sold Out'
      },
      {
        id: 'purchased',
        displayName: 'Purchased'
      }
    ];
  }

  render () {
    let {activeWishlistItemCount, onApplyFilter, onApplySort} = this.props;

    return (
      <form className="filter-wishlist" name="filterWishlist" onSubmit={this.handleSubmit}>
        <div className="favorite-filter-container">
          <Field component={LabeledRadioButton} title={AVAILABLE_FILTERS.ALL} value={ALL} onChange={onApplyFilter} />
          <Field component={LabeledRadioButton} title={AVAILABLE_FILTERS.AVAILABLE} value={AVAILABLE} onChange={onApplyFilter} />
          <Field component={LabeledRadioButton} title={AVAILABLE_FILTERS.SOLDOUT} value={SOLDOUT} onChange={onApplyFilter} />
          <Field component={LabeledRadioButton} title={AVAILABLE_FILTERS.PURCHASED} value={PURCHASED} onChange={onApplyFilter} />
        </div>
        <div className="favorite-results-count">{activeWishlistItemCount} item/s</div>
        <Field component={LabeledSelect} name="sortBy" className="sort-by" optionsMap={this.sortByOptionMap()} title="Sort By:" placeholder="Recently Added" onChange={onApplySort} />
      </form>
    );
  }
}

let FavoritesFilterAndSortForm = reduxForm({
  form: 'favoriteFilterForm'
})(_FavoritesFilterAndSortForm);

export {FavoritesFilterAndSortForm};
