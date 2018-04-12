/**
* @module Favorites
* @summary Roll is as such to mediate between toolbar(s) and render components
* @author Gabriel Gomez
* @link https://invis.io/C59C6U337
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {WishlistContainer} from 'views/components/favorites/WishlistContainer';
import {WISHLIST_PROP_TYPE, WISHLIST_SUMMARIES_PROP_TYPE} from 'views/components/common/propTypes/favoritesPropTypes';
import {WishlistEmpty} from 'views/components/favorites/WishlistEmpty.jsx';
import {FavoritesToolbar} from 'views/components/favorites/FavoritesToolbar.jsx';
import {ProductRecommendationsListContainer} from 'views/components/recommendations/ProductRecommendationsListContainer.js';
import {Spinner} from 'views/components/common/Spinner.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.favorites-section.scss');
} else {
  require('./_m.favorites-section.scss');
}

export class Favorites extends React.Component {
  static propTypes = {

    isMobile: PropTypes.bool,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** list that represent all wishlist available to the logged in user */
    wishListsSummaries: WISHLIST_SUMMARIES_PROP_TYPE.isRequired,

    /** the currently selected wishlist (if any) */
    activeWishlist: WISHLIST_PROP_TYPE,

    /** prop for wish list shared */
    isReadOnly: PropTypes.bool,

    /** callback for when a wishlist is selected. Accepts: wishlistId */
    onSelectWishlist: PropTypes.func.isRequired,
    /** callback for creating a wishlist. */
    onCreateSubmit: PropTypes.func.isRequired,
    /** callback for editing wishlist properties (not items) */
    onEditSubmit: PropTypes.func.isRequired,
    /** callback for deletinmg a wishlist */
    onDeleteSubmit: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {isLoading: !props.activeWishlist};
    this.handleSelectWishlist = this.handleSelectWishlist.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.activeWishlist && nextProps.activeWishlist) {
      this.setState({isLoading: false});
    }
  }

  handleSelectWishlist (wishlistId) {
    this.setState({isLoading: true});
    this.props.onSelectWishlist(wishlistId)
      .then(() => this.setState({isLoading: false}))
      .catch(() => this.setState({isLoading: false}));
  }

  render () {
    let {isGuest, isMobile, wishListsSummaries, activeWishlist,
      onCreateSubmit, onEditSubmit, onDeleteSubmit, isReadOnly} = this.props;

    if (isGuest && !isReadOnly) {
      // FIXME: need the espot name
      return (<ContentSlot contentSlotName={''} className="favorites-guest-banner" />);
    }

    if (this.state.isLoading) { return <Spinner />; }

    return (
      <main className="main-section-container wishlist-section-container">
        <FavoritesToolbar isEnabledShareComponent={activeWishlist.items.length > 0} isMobile={isMobile} isReadOnly={isReadOnly} wishListsSummaries={wishListsSummaries} activeWishlist={activeWishlist}
          onSelectWishlist={this.handleSelectWishlist} onCreateSubmit={onCreateSubmit} onEditSubmit={onEditSubmit} onDeleteSubmit={onDeleteSubmit} />

        {(activeWishlist && activeWishlist.items.length > 0)
          ? <WishlistContainer wishlist={activeWishlist} wishListsSummaries={wishListsSummaries.filter((item) => item.id !== activeWishlist.id)}
            isMobile={isMobile} isReadOnly={isReadOnly} />
          : <WishlistEmpty isMobile={isMobile} /> }

          <ProductRecommendationsListContainer />
      </main>
    );
  }
}
