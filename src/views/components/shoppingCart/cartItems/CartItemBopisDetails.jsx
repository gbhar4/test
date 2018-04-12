/** @module CartItemBopisDetails
 *
 * @summary A presentational comopnent rendering the shipping/pickup information for a cart item.
 *
 * This Component is not a form, though it does allow the user to manipulate the shipping/pickup
 * by clicking radio buttons.
 *
 * @author ?
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {LabeledRadioButton} from 'views/components/common/form/LabeledRadioButton.jsx';
import {BASIC_CART_ITEM_PROP_TYPE} from 'views/components/common/propTypes/cartItemPropTypes';

export class CartItemBopisDetails extends React.Component {

  static propTypes = {
    /** Flags if is Mobile */
    isMobile: PropTypes.bool,

    /** product info of this item in the cart */
    productInfo: BASIC_CART_ITEM_PROP_TYPE.productInfo,

    /** item info of this item in the cart */
    itemInfo: BASIC_CART_ITEM_PROP_TYPE.itemInfo,

    /** Flags if this item is only available online */
    isOnlineOnly: PropTypes.bool,

    /** Flags if this item is eligible for bopis - there are cases where item is NOT eligible but selected as bopis,
    so we need to show an error message */
    isBopisEligible: PropTypes.bool,

    /** This is a backend kill switch to enable/disable BOPIS for clearance items */
    isBopisClearanceProductEnabled: PropTypes.bool,

    /** Flags if this item is a clearance item */
    clearanceItem: PropTypes.bool,

    /** If falsy (i.e., null, undefined, etc.) this item is to be shipped;
     * otherwise, it is the name of the store from which it is to be picked up
     */
    pickUpStore: PropTypes.string,

    /** callbacks for radio buttons **/
    onSetShipToHome: PropTypes.func.isRequired,

    /** a callback to show the BOPIS modal. Accepts no parameters */
    onQuickBopisOpenClick: PropTypes.func.isRequired,

    /** flag to know if this item is soldout on ecom site */
    isEcomSoldout: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.handleSetShipToHome = this.handleSetShipToHome.bind(this);
    this.handleQuickBopisOpenClick = this.handleQuickBopisOpenClick.bind(this);
  }

  handleSetShipToHome () {
    if (this.props.pickUpStore) {     // if bopis item then switch to ship to home
      this.props.onSetShipToHome();
    }
  }

  handleQuickBopisOpenClick () {
    let {productInfo, itemInfo, onQuickBopisOpenClick} = this.props;

    onQuickBopisOpenClick(
      productInfo.generalProductId,
      {
        color: productInfo.color.name,
        fit: productInfo.fit,
        size: productInfo.size,
        quantity: itemInfo.quantity
      },
      productInfo.generalProductId,
      itemInfo.itemId);
  }

  render () {
    let {isOnlineOnly, isBopisEligible, pickUpStore, clearanceItem, onQuickBopisOpenClick,
      isBopisModalOpen, isBopisClearanceProductEnabled, itemInfo, isEcomSoldout} = this.props;

    let radioGroupName = 'ship-it-' + itemInfo.itemId;

    let noPickUpMessage;
    if (isOnlineOnly) {
      noPickUpMessage = 'Not available (Online Only)';
    } else if (clearanceItem) {
      noPickUpMessage = 'Not available (Clearance Item)';
    }

    return (
      <div className="radio-button-container">

        <LabeledRadioButton
          readOnly
          title="Ship it"
          className="ship-it"
          name={radioGroupName}
          checked={!pickUpStore}
          selectedValue="0"
          onClick={this.handleSetShipToHome}
          disabled={isEcomSoldout} />

        <br />

        <LabeledRadioButton
          readOnly
          name={radioGroupName}
          checked={!!pickUpStore}
          selectedValue="1"
          disabled={isOnlineOnly || isBopisModalOpen || !isBopisEligible || (clearanceItem && !isBopisClearanceProductEnabled) || isEcomSoldout}
          onClick={onQuickBopisOpenClick}>

            <span className="title">I’ll pick up in store </span>
            {isOnlineOnly || (clearanceItem && !isBopisClearanceProductEnabled)
              ? <div className="container-information-pick-up-in-store notAvailable"><strong className="no-pickup-message">{noPickUpMessage}</strong></div>
              : pickUpStore &&
                <div className="container-information-pick-up-in-store">
                  <strong className="pickup-store-name">at {pickUpStore}</strong>
                  <button onClick={onQuickBopisOpenClick} disabled={isBopisModalOpen || !isBopisEligible || isEcomSoldout} className="button-change-store" title="Change Store" aria-label="Change Store">Change Store</button>
                </div>
            }
        </LabeledRadioButton>
      </div>
    );
  }
}
