/**
* @module AppliedGiftCardsDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* shows applied gift cards
*
* Style (ClassName) Elements description/enumeration
*  gift-cards-applied-container
*/
import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.giftcards.scss');
} else {
  require('./_m.giftcards.scss');
}

class AppliedGiftCardsItemDisplay extends React.Component {
  static propTypes = {
    giftCardItem: PropTypes.shape({
      id: PropTypes.string.isRequired,
      remainingBalance: PropTypes.number.isRequired,
      endingNumbers: PropTypes.string.isRequired
    }),

    onRemoveItemClick: PropTypes.func.isRequired,

    enableRemoveItem: PropTypes.bool.isRequired
  }

  constructor (props, context) {
    super(props, context);
    this.handleRemoveItemClick = (event) => { this.props.onRemoveItemClick(event, this.props.giftCardItem.id); };
  }

  render () {
    let {enableRemoveItem} = this.props;
    let { endingNumbers, remainingBalance } = this.props.giftCardItem;

    return (
      <li className="giftcard-aplied-summary">
        <p className="balance">Ending in {endingNumbers} | Remaining Balance: ${remainingBalance.toFixed(2)}</p>

        {enableRemoveItem && <button type="button" onClick={this.handleRemoveItemClick}
          className="button-giftcard-remove button-tertiary" aria-label="Remove gift card">Remove</button>
        }
      </li>
    );
  }
}

class AppliedGiftCardsDisplay extends React.Component {
  static propTypes = {
    giftCardsList: PropTypes.arrayOf(AppliedGiftCardsItemDisplay.propTypes.giftCardItem).isRequired,
    onRemoveItem: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);
    this.handleRemoveGiftCard = (event, id) => { this.props.onRemoveItem(id); };
  }

  render () {
    let {giftCardsList, enableRemoveItem} = this.props;

    return (<section className="gift-cards-applied-container">
      <strong className="title-gift-card-applied">Applied Gift Cards</strong>

      {giftCardsList.length > 0
        ? <div>
            <ul>
              {giftCardsList.map((giftCardItem) => {
                return (
                  <AppliedGiftCardsItemDisplay key={giftCardItem.id} giftCardItem={giftCardItem}
                    onRemoveItemClick={this.handleRemoveGiftCard} enableRemoveItem={enableRemoveItem} />
                );
              })}
            </ul>
            <p className="notice-gift-card-applied"><strong>Heads up!</strong> Please keep your Gift Card until you receive the item(s) purchased.</p>
          </div>
        : <p className="nothing-applied">None</p>}
    </section>);
  }
}

export {AppliedGiftCardsDisplay};
