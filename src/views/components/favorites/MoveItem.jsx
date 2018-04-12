/**
* @module MoveItem
* @summary This module is intended to have the move in between wishlist functionality.
* @author Gabriel Gomez
* @author Florencia <facosta@minutentag.com>
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';
import breakWordValidator from 'util/viewUtil/breakWordValidator.js';
import {CreateWishlistForm} from 'views/components/favorites/CreateWishlistForm.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import {closestOfType} from 'util/viewUtil/closestOfType.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.move-item.scss');
} else {
  require('./_m.move-item.scss');
}

/* NOTE: DT-28864 (minor) */

class MoveToFavoriteListItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    isDefault: PropTypes.bool.isRequired,
    itemsCount: PropTypes.number.isRequired,
    wishlistItemId: PropTypes.string.isRequired,
    onMoveItem: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.handleMoveToFavoriteList = this.handleMoveToFavoriteList.bind(this);
  }

  handleMoveToFavoriteList () {
    this.props.onMoveItem({
      toWishListId: this.props.id,
      itemId: this.props.wishlistItemId
    });
  }

  render () {
    let {displayName, isDefault, itemsCount} = this.props;

    let itemClassName = cssClassName('name-list favorite-list ', {'default-favorite-list ': isDefault});
    let nameClassName = cssClassName('favorite-item-title ', {'favorite-item-title-one-word ': breakWordValidator(displayName)});
    return (<p className={itemClassName} onClick={this.handleMoveToFavoriteList}>
      <span className={nameClassName}>{displayName} {isDefault && <i className="heart-icon-container">Default</i>} </span>
      <span className="number-items favorite-item-detail">{itemsCount} item{itemsCount !== 1 ? 's' : ''}</span>
    </p>);
  }
}

export class MoveItem extends React.Component {
  // FIXME: add proptypes

  constructor (props, context) {
    super(props, context);

    this.state = {
      isOpenMoveList: false,
      isCreateNewList: false
    };

    this.handleCreateWishlist = this.handleCreateWishlist.bind(this);
    this.handleCreateWishlistSubmit = this.handleCreateWishlistSubmit.bind(this);
    this.handleSelectWishlist = this.handleSelectWishlist.bind(this);

    this.setError = getSetErrorInStateMethod(this);
    this.handleMoveToFavoriteList = this.handleMoveToFavoriteList.bind(this);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleCloseCreateWishlist = this.handleCloseCreateWishlist.bind(this);

    this.handleToggleMoveList = this.handleToggleMoveList.bind(this);
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside (event) {
    if (this.state.isCreateNewList) {
      return;
    }

    let closest = closestOfType(event.target, 'P');

    if (!event.target.classList.contains('move-item-content') && !event.target.classList.contains('button-new') && !event.target.classList.contains('button-move') && (!closest || !closest.classList.contains('favorite-list'))) {
      this.setState({
        isOpenMoveList: false
      });
    }
  }

  handleMoveToFavoriteList (params) {
    this.setError();
    this.props.onMoveItem(params).catch((err) => this.setError(err));
  }

  handleSelectWishlist (wishlistId) {
    let isCreateNewList = wishlistId && wishlistId === 'NEW';
    let oldIsCreateNewList = this.state.isCreateNewList;

    this.setState({
      selectedOptionValue: wishlistId,
      isCreateNewList: isCreateNewList
    });

    if (oldIsCreateNewList !== isCreateNewList) {
      this.handleCloseCreateWishlist();
    }

    wishlistId && !isCreateNewList && wishlistId !== this.props.activeWishlist.id && this.props.onSelectWishlist(wishlistId);
  }

  handleCreateWishlist () {
    this.setState({isCreateNewList: true});
  }

  handleCloseCreateWishlist () {
    this.setState({
      isCreateNewList: false,
      isOpenMoveList: false
    });
  }

  handleCreateWishlistSubmit (formData) {
    return this.props.onCreateSubmit({
      ...formData,
      itemId: this.props.wishlistItemId
    }).then(() => this.handleCloseCreateWishlist());
  }

  handleToggleMoveList () {
    this.setState({
      isOpenMoveList: !this.state.isOpenMoveList
    });
  }

  render () {
    let {isMobile, favoriteList, wishlistItemId} = this.props;
    let {isCreateNewList, isOpenMoveList, error} = this.state;

    let buttonClassName = cssClassName(
      'button-move ',
      {'active ': isOpenMoveList}
    );

    return (
      <div className="move-item-container">
        <button className={buttonClassName} onClick={this.handleToggleMoveList}>Move to another list</button>
        {isOpenMoveList && <div className="move-item-content">
          <span className="title-move">My Favorites List</span>

          {favoriteList.map((item) => <MoveToFavoriteListItem key={item.id} {...item} onMoveItem={this.handleMoveToFavoriteList} wishlistItemId={wishlistItemId} />)}

          {error && <ErrorMessage error={error} />}

          <CreateNewListButton onClick={this.handleCreateWishlist} favoriteListCount={favoriteList.length} />

          {isCreateNewList && <CreateWishlistForm isMobile={isMobile} onSubmit={this.handleCreateWishlistSubmit} onClose={this.handleCloseCreateWishlist} />}
        </div>}
      </div>
    );
  }
}

function CreateNewListButton (props) {
  let {favoriteListCount, onClick} = props;
  return (
    (favoriteListCount >= 4) // four lists without the current list, this add five.
      ? <button className="button-quaternary button-new" disabled>+ Create a new list</button>
      : <button className="button-quaternary button-new" onClick={onClick}>+ Create a new list</button>
  );
}
