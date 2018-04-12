/**
* @module WishlistItems
* @summary It displays the actual wishlist
* @author Gabriel Gomez
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {WishlistItem} from 'views/components/favorites/WishlistItem.jsx';
import {WishlistHeaderContainer} from './WishlistHeaderContainer.js';
import {getVisibleWishlistItems, getNonEmptyFiltersList, getSortsList, NO_FILTER_ID} from 'reduxStore/storeViews/favoritesStoreView';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {WISHLIST_PROP_TYPE, WISHLIST_SUMMARIES_PROP_TYPE} from 'views/components/common/propTypes/favoritesPropTypes';
// import {BopisModalContainerQuick} from 'views/components/bopis/BopisModalContainerQuick';

export class Wishlist extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /* indicates the user opened from an email link */
    isReadOnly: PropTypes.bool.isRequired,

    wishlist: WISHLIST_PROP_TYPE.isRequired,
    currencySymbol: PropTypes.string,

    /** the itemId of the item (if any) requesting quickView to show */
    showQuickViewForItemId: PropTypes.string,
    /** callback for clicks on quickView CTAs. Accepts a generalProductId, colorProductId, itemId */
    onQuickViewOpenClick: PropTypes.func.isRequired,
    /** callback for clicks on quickView CTAs. Accepts a generalProductId, initialValues, colorProductId, itemId */
//    onQuickBopisOpenClick: PropTypes.func.isRequired,

    /** callback to remove item from the wishlist */
    onRemoveItem: PropTypes.func.isRequired,
    /** callback to edit wishlist item  */
    onEditItem: PropTypes.func.isRequired,
    /** callback to add item to bag */
    onAddItemToBag: PropTypes.func.isRequired,
    /** callback to add item to bag */
    onAddItemToBagSuccess: PropTypes.func.isRequired,

    /** list that represent all wishlist available to the logged in user */
    wishListsSummaries: WISHLIST_SUMMARIES_PROP_TYPE.isRequired
    /** Flags whether the BOPIS modal should be visible */
//    isShowBopisModal: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.state = {filterId: 'ALL', sortId: 'UNSORTED'};
    this.sortsList = getSortsList();
    this.filtersList = getNonEmptyFiltersList(props.wishlist.items);
    this.visibleItems = getVisibleWishlistItems(props.wishlist.items, this.state.filterId, this.state.sortId);

    this.handleFilterChange = (filterId) => this.adaptToFilterAndSort(this.props, filterId, this.state.sortId);
    this.handleSortChange = (sortId) => this.adaptToFilterAndSort(this.props, this.state.filterId, sortId);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
//    this.handleQuickBopisOpenClick = this.handleQuickBopisOpenClick.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.wishlist !== nextProps.wishlist) {
      this.filtersList = getNonEmptyFiltersList(nextProps.wishlist.items);
      // apply old filter if it is still available (may not be if no items pass this filter); otherwise set no filter
      let filterId = this.filtersList.find((filter) => filter.id === this.state.filterId && !filter.disabled) ? this.state.filterId : NO_FILTER_ID;
      this.adaptToFilterAndSort(nextProps, filterId, this.state.sortId);
    }
  }

  handleRemoveItem (wishlistItemId) {
    return this.props.onRemoveItem(wishlistItemId);
  }

  // handleQuickBopisOpenClick (generalProductId, itemId, initialValues) {
  //   this.initialBopisValues = initialValues;
  //   this.props.onQuickBopisOpenClick(generalProductId, {}, generalProductId, itemId);
  // }

  render () {
    let {isMobile, currencySymbol, isReadOnly, wishListsSummaries, onQuickViewOpenClick, onEditItem,
      showQuickViewForItemId, /* isShowBopisModal, */onAddItemToBag, onAddItemToBagSuccess} = this.props;
    let {filterId, sortId} = this.state;
    let classNameWishlist = cssClassName('wishlist-container ', {'viewport-container ': !isMobile, 'item-read-only-container ': isReadOnly});

    return (
      <div className={classNameWishlist}>
        <WishlistHeaderContainer itemsCount={this.visibleItems.length}
          filtersList={this.filtersList} selectedFilterId={filterId} sortsList={this.sortsList} selectedSortId={sortId}
          onApplyFilter={this.handleFilterChange} onApplySort={this.handleSortChange} isMobile={isMobile} />
        <ul className="wishlist-list-container">
          {this.visibleItems.map((item) =>
            <WishlistItem isMobile={isMobile} key={item.itemInfo.itemId} wishlistItem={item} wishListsSummaries={wishListsSummaries}
              currencySymbol={currencySymbol} isReadOnly={isReadOnly} onRemoveItem={this.handleRemoveItem}
              onQuickViewOpenClick={onQuickViewOpenClick} onQuickBopisOpenClick={this.handleQuickBopisOpenClick}
              isShowQuickView={showQuickViewForItemId === item.itemInfo.itemId} onEditItem={onEditItem}
              onAddItemToBag={onAddItemToBag} onAddItemToBagSuccess={onAddItemToBagSuccess} />
          )}
        </ul>

        {/* isShowBopisModal && <BopisModalContainerQuick isShowAddItemSuccessNotification initialValues={this.initialBopisValues} /> */ }
      </div>
    );
  }

  // --------------- private methods --------------- //

  adaptToFilterAndSort (props, filterId, sortId) {
    this.visibleItems = getVisibleWishlistItems(props.wishlist.items, filterId, sortId);
    this.setState({filterId, sortId});
  }

}
