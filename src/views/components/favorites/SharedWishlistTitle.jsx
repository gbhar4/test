/**
* @module SharedWishlistTitle
* @summary Title for Shared wishlist
* @author Agu
* FIXME: markup and classNames need to match comps (I didn't review them, just noticed this missing component)
*/
import React from 'react';
import {PropTypes} from 'prop-types';

export class SharedWishlistTitle extends React.Component {
  static propTypes = {
    /** User's first name */
    wishlistCreatorName: PropTypes.string.isRequired,

    /** the active wishlist name **/
    wishlistDisplayName: PropTypes.string.isRequired
  };

  render () {
    let {wishlistCreatorName, wishlistDisplayName} = this.props;

    return (
      <div className="toolbar-header-container shared-toolbar-header-container">
        <strong className="favorite-shared-owner">{wishlistCreatorName}’s Favorites</strong>
        <h1 className="favorite-shared-name">{wishlistDisplayName}</h1>
      </div>
    );
  }
}
