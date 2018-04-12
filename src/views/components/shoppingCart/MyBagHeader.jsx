/** @module MyBagHeader
 * Header for MyBag, showing the title with the amount of products in the cart
 * and notifications about user actions, OOS and unavailability.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CartItemsRemovedNotification} from './CartItemsRemovedNotification.jsx';
import {StickyNotification} from '../common/StickyNotification.jsx';
import {CartUnavailableItemsNotificationContainer} from './CartUnavailableItemsNotificationContainer.js';
import {CartSoldoutItemsNotificationContainer} from './CartSoldoutItemsNotificationContainer.js';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

export class MyBagHeader extends React.Component {
  static propTypes = {
    itemsCount: PropTypes.number.isRequired,
    itemUpdatedId: PropTypes.string,
    recentlyRemovedItemsCount: PropTypes.number,
    isMobile: PropTypes.bool,
    isCondense: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
  }

  render () {
    let {isMobile, itemWishlistId, itemUpdatedId, itemDeletedId,
      itemsCount, recentlyRemovedItemsCount, isCondense,
      grandTotal, currencySymbol} = this.props;
    let subheadingClassName = cssClassName('subheading-my-bag-title', {' viewport-container': !isMobile});

    return (
      <div >
        {!isCondense && isMobile && <HyperLink destination={PAGES.homePage} className="subheading-button-continue-shopping">Continue Shopping</HyperLink>}
        <div className="subheading-my-bag">
          {isCondense
            ? <h2><HyperLink destination={PAGES.cart}>View Bag ({itemsCount})</HyperLink></h2>
            : <h1 className={subheadingClassName}>My Bag ({itemsCount})
              {isMobile && <span>Estimated Total: {currencySymbol + grandTotal.toFixed(2)}</span>}
            </h1>
          }

          {itemWishlistId && <StickyNotification handleScroll={!isCondense} message="Your item has been moved to favorites." />}
          {itemDeletedId && <StickyNotification handleScroll={!isCondense} message="Your item has been deleted." />}
          {itemUpdatedId && <StickyNotification handleScroll={!isCondense} message="Your item has been updated." />}

          <CartItemsRemovedNotification removedItemsCount={recentlyRemovedItemsCount} isCondense={isCondense} />
          <CartSoldoutItemsNotificationContainer isCondense={isCondense} />
          <CartUnavailableItemsNotificationContainer isCondense={isCondense} />
        </div>
      </div>
    );
  }
}
