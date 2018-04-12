/**
* @module WishlistEmpty
* @summary Wishlist empty state, it renders an e-spot
* @author Gabriel Gomez
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.empty-wishlist-section.scss');
} else {
  require('./_m.empty-wishlist-section.scss');
}

export class WishlistEmpty extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired
  }

  render () {
    let {isMobile} = this.props;

    let emtpySectionClass = cssClassName(
      'empty-wishlist-section ',
      {'viewport-container ': !isMobile}
    );

    return (<section className={emtpySectionClass}>
      <div className="empty-wishlist-message-container">
        <h1 className="empty-wishlist-title">Uh oh! Looks like you don’t have any favorites yet!</h1>
        <p className="empty-wishlist-message">Browse by category or continue shopping to add favorites to your list.</p>
      </div>
      <ContentSlot contentSlotName={'wishlist_empty'} className="content-slot"/>
    </section>
    );
  }
}
