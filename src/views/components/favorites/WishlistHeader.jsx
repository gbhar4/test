/** @module WishlistHeader
 * @summary a header for a wishlist.
 * provides some info on the list, and allows selecting filtering and sort criteria for the wishlist items.
 *
 *  @author Ben
 *  @author Florencia <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {LabeledRadioButtonGroup} from 'views/components/common/form/LabeledRadioButtonGroup.jsx';
import {StickyNotification} from '../common/StickyNotification.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';
// import {WISHLIST_FILTERS, WISHLIST_SORTS} from 'reduxStore/storeViews/favoritesStoreView';

if (DESKTOP) { // eslint-disable-line
  require('./_d.header-wishlist.scss');
} else {
  require('./_m.header-wishlist.scss');
}

export class WishlistHeader extends React.Component {
  static propTypes = {
    /** count of items displayed on the screen */
    itemsCount: PropTypes.number.isRequired,

    /** list of available filters */
    filtersList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      disabled: PropTypes.bool
    })).isRequired,
    selectedFilterId: PropTypes.string.isRequired,

    /** list of available filters. Assumes WISHLIST_SORTS.UNSORTED is one of them */
    sortsList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    })).isRequired,
    selectedSortId: PropTypes.string.isRequired,

    /** callback for when the filter selection changes. accepts the new filter id */
    onApplyFilter: PropTypes.func.isRequired,
    /** callback for when the sort selection changes. accepts the new sort id */
    onApplySort: PropTypes.func.isRequired,

    isReadOnly: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this.filtersOptionsMap = getFiltersOptionsMap(props.filtersList);

    this.handleFilterChange = props.isMobile ? (event) => this.props.onApplyFilter(event.target.value) : (value) => this.props.onApplyFilter(value);
    this.handleSortChange = (event) => this.props.onApplySort(event.target.value);

    this.filterInputProp = {value: props.selectedFilterId, name: 'displayMode', onChange: this.handleFilterChange};
    this.sortInputProp = {value: props.selectedSortId, onChange: this.handleSortChange};
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.filtersList !== nextProps.filtersList) {
      this.filtersOptionsMap = getFiltersOptionsMap(nextProps.filtersList);
    }
    if (this.props.selectedFilterId !== nextProps.selectedFilterId) {
      // note that we do not do this.filterInputProp.value = nextProps.selectedFilterId
      // because we need to create a new object (recall that props should be immutable)
      this.filterInputProp = {...this.filterInputProp, value: nextProps.selectedFilterId};
    }
    if (this.props.selectedSortId !== nextProps.selectedSortId) {
      this.sortInputProp = {...this.sortInputProp, value: nextProps.selectedSortId};
    }
  }

  render () {
    let {isMobile, itemsCount, sortsList, filtersList, isReadOnly, itemDeletedId} = this.props;

    let wishlistHeaderClassName = cssClassName(
      'favorite-filter-container ',
      {'favorite-filter-read-only-container ': isReadOnly}
    );

    return (
      <div className={wishlistHeaderClassName}>
        {isMobile
          ? <LabeledSelect className="display-filter" title="Display: " placeholder="All" optionsMap={filtersList} input={this.filterInputProp} />
          : <LabeledRadioButtonGroup className="display-filter" title="Display: " optionsMap={this.filtersOptionsMap} input={this.filterInputProp} />
        }
        <div className="favorite-results-count">{itemsCount} item{itemsCount > 1 && 's'}</div>
        <LabeledSelect className="sort-by" title="Sort By:" placeholder="Recently Added" optionsMap={sortsList} input={this.sortInputProp} />
        {itemDeletedId && <StickyNotification handleScroll={true} message="Your favorites list has been updated." />}
      </div>
    );
  }

}

function getFiltersOptionsMap (list) {
  return list.map((item) => ({
    value: item.id,
    title: item.displayName,
    content: <span>{item.displayName}</span>,
    disabled: item.disabled
  }));
}
