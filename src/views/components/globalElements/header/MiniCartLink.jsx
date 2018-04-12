/** @module MiniCartLink
 * A presentational component rendering a link for opening the mini-bag
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {DRAWER_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

if (DESKTOP) { // eslint-disable-line no-undef
  require('./_d.miniCartLink.scss');
} else {
  require('./_m.miniCartLink.scss');
}

export class MiniCartLink extends React.Component {

  static propTypes = {
    /** Number of items in the cart */
    itemsCount: PropTypes.number,

    /** Flags if this link is currently active */
    isActive: PropTypes.bool,

    /** a callback for clicks on this link */
    onClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick (event) {
    this.props.onClick(event, DRAWER_IDS.MINI_CART);
  }

  render () {
    let {itemsCount, isActive} = this.props;
    let itemCountText = itemsCount === null ? 'Shopping bag. ' : `${itemsCount} item/s in shopping bag. `;
    let actionText = (isActive ? 'Toggle' : 'Opens') + ' a dialog.';

    return (
      <div className="minicart-container">
        <button className={cssClassName('button-cart', {' active': isActive})}
          onClick={this.handleOnClick}
          aria-label={itemCountText + actionText}>
          {itemsCount}
        </button>
      </div>
    );
  }

}
