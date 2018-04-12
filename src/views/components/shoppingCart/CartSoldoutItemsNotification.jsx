/** @module CartUnavilableItemsNotification
 * Notification alerting the user that there are unavailable in the cart.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';

export class CartSoldoutItemsNotification extends React.Component {
  static propTypes = {
    /** the number of unavailable items in the cart */
    soldoutItemsCount: PropTypes.number.isRequired,
    /** a callback to remove all of unavailable itmes */
    onRemoveSoldoutItems: PropTypes.func.isRequired
  }

  render () {
    let {soldoutItemsCount, onRemoveSoldoutItems, isCondense} = this.props;

    if (soldoutItemsCount <= 0) {
      return null;          // render nothing if no uinavailable items in cart
    }

    let classNameContainerNotification = isCondense ? 'notification-primary oss-notification-from-bag' : 'oss-notification-from-bag';
    let classNameContentNotification = isCondense ? 'notification-text' : 'notification-inline';

    return (
      <div key="0" className={'notification ' + classNameContainerNotification}>
        <div className={classNameContentNotification}>
          <p>
            {soldoutItemsCount === 1
            ? <span>
              An item in your cart is sold out.
              Please <button className="button-remove-all" onClick={onRemoveSoldoutItems}>remove</button> the sold out item from your bag before checkout.
            </span>
            : <span>
              There are {soldoutItemsCount} items in your cart that are sold out.
              Please <button className="button-remove-all" onClick={onRemoveSoldoutItems}>remove</button> the sold out items from your bag before you checkout.
            </span>
            }
          </p>
        </div>
      </div>
    );
  }
}
