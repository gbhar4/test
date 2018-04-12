/**
* @module FavoritesToolbar
* @summary Module intended to provide wishlist top bar functionalities. I.e.: Edit/Create New Wishlist, Delete Wishlist, Share module among some.
* @author Gabriel Gomez
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {UpdateWishlistForm} from 'views/components/favorites/UpdateWishlistForm.jsx';
import {FavoritesActiveListSelect} from 'views/components/favorites/FavoritesActiveListSelect.jsx';
import {FavoritesWishlistShare} from 'views/components/favorites/FavoritesWishlistShare.jsx';
import {SharedWishlistTitle} from 'views/components/favorites/SharedWishlistTitle.jsx';
import {WISHLIST_PROP_TYPE} from 'views/components/common/propTypes/favoritesPropTypes';
import cssClassName from 'util/viewUtil/cssClassName.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.favorite-toolbar.scss');
} else {
  require('./_m.favorite-toolbar.scss');
}

export class FavoritesToolbar extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,

    /** the active wishlist (there's always one) **/
    activeWishlist: WISHLIST_PROP_TYPE.isRequired,

    /** available wishlists to select from */
    wishListsSummaries: FavoritesActiveListSelect.propTypes.wishListsSummaries,

    /** flag if true, the user can only access a single wishlist which cannot be shared (or edited) */
    isReadOnly: PropTypes.bool.isRequired,

    /** flag to know when share's dropdown and wishlist edit's button should be shown (when wishlist is not empty) */
    isEnabledShareComponent: PropTypes.bool.isRequired,

    /** callback for handle selection of other already created wishlists */
    onSelectWishlist: PropTypes.func.isRequired,

    /** callback for create favorite list (name) form submit */
    onCreateSubmit: PropTypes.func.isRequired,

    /** callback for edit favorite list (name) form submit */
    onEditSubmit: PropTypes.func.isRequired,

    /** callback for favorite list remove click */
    onDeleteSubmit: PropTypes.func.isRequired
  };

  getEditInitialValues () {
    let activeWishlist = this.props.activeWishlist;

    return activeWishlist && {
      wishlistId: activeWishlist.id,
      wishlistName: activeWishlist.displayName,
      setAsDefault: activeWishlist.isDefault,
      disabled: activeWishlist.disabled
    };
  }

  render () {
    let {isReadOnly, isMobile, activeWishlist, wishListsSummaries, isEnabledShareComponent, onCreateSubmit, onEditSubmit, onSelectWishlist, onDeleteSubmit} = this.props;
    let initalValues = this.getEditInitialValues();

    // REVIEW: put the link on active vs on summary?
    let activeWishlistSummary = wishListsSummaries.find((summary) => summary.id === activeWishlist.id);
    let classNameContainer = cssClassName(
      'favorite-toolbar-container ',
      {'viewport-container ': !isMobile}
    );
    let displayName = activeWishlist.displayName.replace(/wishlist/i, 'Favorites');

    return (<div className={classNameContainer}>
      {isReadOnly
        ? <SharedWishlistTitle wishlistCreatorName={activeWishlist.creatorName} wishlistDisplayName={displayName} />
        : <div className="favorite-toolbar-share-container">
          <FavoritesActiveListSelect isMobile={isMobile} activeWishlist={activeWishlist} wishListsSummaries={wishListsSummaries}
            onSelectWishlist={onSelectWishlist} onCreateSubmit={onCreateSubmit} />

          <div className="favorite-social-container">
            <UpdateWishlistForm key={activeWishlist.id} id={activeWishlist.id} onSubmit={onEditSubmit} enableDelete={wishListsSummaries.length !== 1} isSetAsDefaultDisabled={wishListsSummaries.length === 1} onDelete={onDeleteSubmit} initialValues={initalValues} isMobile={isMobile} />
            {(activeWishlistSummary && activeWishlistSummary.shareableLink && isEnabledShareComponent) && <FavoritesWishlistShare shareableLink={activeWishlistSummary.shareableLink} />}
          </div>
        </div>}
      </div>
    );
  }

}
