/** @module CheckoutProgressIndicator
 * @summary Horizontal checkout progress list (contains next steps)
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CHECKOUT_STAGES, CHECKOUT_STAGE_PROP_TYPE} from 'reduxStore/storeReducersAndActions/checkout/checkout';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-progress-indicator.scss');
} else { // eslint-disable-line
  require('./_m.checkout-progress-indicator.scss');
}

export class CheckoutProgressIndicator extends React.Component {

  static propTypes = {
    /** indicates the active step in the checkout */
    activeStage: CHECKOUT_STAGE_PROP_TYPE.isRequired,
    /** callback to change stages in the checkout process **/
    moveToCheckoutStage: PropTypes.func.isRequired,
    /** the available stages in the current checkout flow <strong>in order</strong> */
    availableStages: PropTypes.arrayOf(CHECKOUT_STAGE_PROP_TYPE).isRequired
  }

  static stageNamesTable = {
    [CHECKOUT_STAGES.PICKUP]: 'Pickup',
    [CHECKOUT_STAGES.SHIPPING]: 'Shipping',
    [CHECKOUT_STAGES.BILLING]: 'Billing',
    [CHECKOUT_STAGES.REVIEW]: 'Review'
  }

  constructor (props) {
    super(props);
    this.moveToCallbackTable = {
      [CHECKOUT_STAGES.PICKUP]: () => this.props.moveToCheckoutStage(CHECKOUT_STAGES.PICKUP),
      [CHECKOUT_STAGES.SHIPPING]: () => this.props.moveToCheckoutStage(CHECKOUT_STAGES.SHIPPING),
      [CHECKOUT_STAGES.BILLING]: () => this.props.moveToCheckoutStage(CHECKOUT_STAGES.BILLING),
      [CHECKOUT_STAGES.REVIEW]: () => this.props.moveToCheckoutStage(CHECKOUT_STAGES.REVIEW)
    };
  }

  render () {
    let {activeStage, availableStages} = this.props;
    let hasSeenActive = false;
    return (
      <div className="checkout-progress-indicator">
        <ul className={'checkout-progress-bar ' + (availableStages.length > 3 ? 'pickup-shipping' : null)}>
          {availableStages.map((stage, index) => {
            if (availableStages[index] === activeStage) {
              hasSeenActive = true;
              return (
                <li className="active" key={stage}>
                  <span>{CheckoutProgressIndicator.stageNamesTable[stage]}</span>
                </li>);
            } else {
              return (hasSeenActive
                ? <li key={stage}><span>{CheckoutProgressIndicator.stageNamesTable[stage]}</span></li>
                : <li key={stage} className="completed">
                  <button type="button" onClick={this.moveToCallbackTable[stage]}>{CheckoutProgressIndicator.stageNamesTable[stage]}</button>
                </li>);
            }
          })}
        </ul>
      </div>
    );
  }
}
