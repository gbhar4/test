/** @module WishlistRedirectLink
 * A presentational component rendering a link for redirecting to the wishlist page.
 *
 * @author Ben
 */

import React from 'react';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line no-undef
  require('./_d.wishlistLink.scss');
}

export class WishlistRedirectLink extends React.Component {
  render () {
    return (
      <div className="wishlist-header">
        <HyperLink destination={PAGES.favorites} alt="wishlist" className="wishlist-link">Favorites</HyperLink>
      </div>
    );
  }
}
