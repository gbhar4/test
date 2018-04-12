/** @module CartItemsRemovedNotification
 * Notification confirming the user that the removal of cart items has finished
 * successfully.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {StickyNotification} from '../common/StickyNotification.jsx';

export class CartItemsRemovedNotification extends React.Component {

  static propTypes = {
    /** the number of items that were removed. Zero indicates that this component should not render */
    removedItemsCount: PropTypes.number.isRequired,
    /** flags if to render in a condensed way (for mini-bag) */
    isCondense: PropTypes.bool.isRequired
  }

  render () {
    let {removedItemsCount, isCondense} = this.props;

    if (removedItemsCount <= 0) return null;      // render nothing

    let message = removedItemsCount === 1
      ? 'An item was removed from your shopping bag.'
      : `${removedItemsCount} items were removed from your shopping bag.`;

    let className = isCondense && 'notification-secondary';
    let childClassName = isCondense && 'notification-text';

    return (
      <StickyNotification handleScroll={!isCondense} className={className} childClassName={childClassName} message={message} />
    );
  }

}
