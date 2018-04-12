/**
* @module Favorites Active List Select
* @summary Dropdown to select the active wishlist, or to create a new one
* @author Agu
* @link https://projects.invisionapp.com/share/C59C6U337#/screens/209377251
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {WISHLIST_PROP_TYPE, WISHLIST_SUMMARIES_PROP_TYPE} from 'views/components/common/propTypes/favoritesPropTypes';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import {CreateWishlistForm} from 'views/components/favorites/CreateWishlistForm.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import breakWordValidator from 'util/viewUtil/breakWordValidator.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.favorite-active-list.scss');
} else {
  require('./_m.favorite-active-list.scss');
}

export class FavoritesActiveListSelect extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /** available wishlists to select from */
    wishListsSummaries: WISHLIST_SUMMARIES_PROP_TYPE.isRequired,

    /** the active wishlist (there's always one) **/
    activeWishlist: WISHLIST_PROP_TYPE.isRequired,

    /** submit method for create wishlist form */
    onCreateSubmit: PropTypes.func.isRequired
  };

  constructor (props, context) {
    super(props, context);

    this.state = {
      isCreateNewList: false,
      selectedOptionValue: props.activeWishlist.id,
      optionsMapList: this.getOptionsMapList(props)
    };

    // this.optionsMapList = this.getOptionsMapList(props);

    this.handleCreateWishlist = this.handleCreateWishlist.bind(this);
    this.handleSelectWishlist = this.handleSelectWishlist.bind(this);
    this.closeCreateWishlist = this.closeCreateWishlist.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.wishListsSummaries !== nextProps.wishListsSummaries) {
      // this.optionsMapList = this.getOptionsMapList(nextProps);
      this.setState({
        optionsMapList: this.getOptionsMapList(nextProps),
        selectedOptionValue: nextProps.activeWishlist.id
      });
    }
  }

  handleSelectWishlist (wishlistId) {
    if (wishlistId === 'NONE') {
      return;
    }
    let isCreateNewList = wishlistId && wishlistId === 'NEW';
    let wishlistIdValue = isCreateNewList ? this.state.selectedOptionValue : wishlistId;

    this.setState({
      selectedOptionValue: wishlistIdValue,
      isCreateNewList: isCreateNewList
    });

    wishlistId && !isCreateNewList && wishlistId !== this.props.activeWishlist.id && this.props.onSelectWishlist(wishlistId);
  }

  closeCreateWishlist () {
    this.setState({isCreateNewList: false});
  }

  handleCreateWishlist (formData) {
    return this.props.onCreateSubmit(formData).then(() => this.closeCreateWishlist());
  }

  render () {
    let {isCreateNewList, isMobile, selectedOptionValue, optionsMapList} = this.state;

    return (
      <div className="favorite-active-list-container">
        <CustomSelect className="favorite-list" input={{value: selectedOptionValue, onChange: this.handleSelectWishlist}} optionsMap={optionsMapList} placeholder="" />
        {isCreateNewList && <CreateWishlistForm isMobile={isMobile} onSubmit={this.handleCreateWishlist} onClose={this.closeCreateWishlist} />}
      </div>
    );
  }

  // --------------- private methods --------------- //

  getOptionsMapList (props) {
    let favoriteListMap = [];

    favoriteListMap.push({
      value: '',
      title: 'My Favorites',
      content: <span className="favorite-active-list-title">My Favorites</span>,
      disabled: true
    });

    props.wishListsSummaries.map((favorite) => {
      let {id, displayName, itemsCount, isDefault} = favorite;
      let contentClassName = cssClassName('favorite-list-item-dropdown ', {'default-favorite-list-container': isDefault});
      let listTitleClassName = cssClassName('favorite-list-title ', {'favorite-item-title-one-word ': breakWordValidator(displayName)});
      displayName = displayName.replace('wishlist', 'Favorites');
      displayName = displayName.replace('Wishlist', 'Favorites');
      favoriteListMap.push({
        value: id,
        title: <span className="favorite-list-name">{displayName} {isDefault && <i className="heart-icon-container">Default</i>}</span>,
        content: <p className={contentClassName}>
          <span className={listTitleClassName}>{displayName} {isDefault && <i className="heart-icon-container">Default</i>}</span>
          <span className="item-list">{itemsCount} item{itemsCount > 1 ? 's' : ''}</span>
        </p>
      });
    });

    favoriteListMap.push({
      value: favoriteListMap.length <= 5 ? 'NEW' : 'NONE',
      title: '+ Add a new favorite list',
      content: <CreateNewListButton favoriteListCount={favoriteListMap.length} />
    });

    return favoriteListMap;
  }
}

function CreateNewListButton (props) {
  let {favoriteListCount} = props;
  return (
    (favoriteListCount > 5)
      ? <button aria-label="Add new list" className="button-quaternary add-new-favorite-list-button disabled">+ Create a new favorites list</button>
      : <span aria-label="Add new list" className="button-quaternary button-add-new-favorite-list add-new-favorite-list-button">+ Create a new favorites list</span>
  );
}
