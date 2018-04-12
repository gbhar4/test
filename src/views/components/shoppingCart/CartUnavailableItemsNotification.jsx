/** @module CartUnavailableItemsNotification
 * Notification alerting the user that there are unavailable in the cart.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';

export class CartUnavailableItemsNotification extends React.Component {
  static propTypes = {
    /** the number of unavailable items in the cart */
    unavailableItemsCount: PropTypes.number.isRequired,
    /** a callback to remove all of unavailable itmes */
    onRemoveUnavailableItems: PropTypes.func.isRequired
  }

  render () {
    let {unavailableItemsCount, onRemoveUnavailableItems, isCondense} = this.props;

    if (unavailableItemsCount <= 0) {
      return null;          // render nothing if no uinavailable items in cart
    }

    let classNameContainerNotification = isCondense ? 'notification-primary oss-notification-from-bag' : 'oss-notification-from-bag';
    let classNameContentNotification = isCondense ? 'notification-text' : 'notification-inline';

    return (
      <div key="0" className={'notification ' + classNameContainerNotification}>
        <div className={classNameContentNotification}>
          <p>
            {unavailableItemsCount === 1
            ? <span>
              An item in your cart is unavailable for your selected options.
              Please <button className="button-remove-all" onClick={onRemoveUnavailableItems}>remove</button> the unavailable item or check for
              availability in other colors, sizes, quantity and fits.
            </span>
            : <span>
              There are {unavailableItemsCount} items in your cart that are
              unavailable for your selected options.
              Please <button className="button-remove-all" onClick={onRemoveUnavailableItems}>remove all</button> the unavailable items or check for
              availability in other colors, sizes, quantity and fits.
            </span>
            }
          </p>
        </div>
      </div>
    );
  }
}
