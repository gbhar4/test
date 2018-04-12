/**
* @module AvailableGiftCardsDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* shows available gift cards to apply
*
* Style (ClassName) Elements description/enumeration
*  gift-cards-applied-container
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.giftcards.scss');
} else {
  require('./_m.giftcards.scss');
}

class AvailablegiftCardDisplay extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {error: null};
    this.handleApplyGiftCard = this.handleApplyGiftCard.bind(this);
  }

  handleApplyGiftCard () {
    this.props.onApplyItem(this.props.id)
    .catch((err) => {
      if (err) {
        this.setState({error: err.errors._error});
      }
    });
  }

  render () {
    let {cardEndingNumbers, isDisabledApply} = this.props;
    let {error} = this.state;

    return (
      <li className="giftcard-apply-summary">
        {error && <ErrorMessage error={error} />}

        <p className="balance">Ending in {cardEndingNumbers}</p>

        <button type="button" onClick={this.handleApplyGiftCard} className="button-giftcard-apply button-tertiary" aria-label="Apply gift card" disabled={isDisabledApply} >Apply</button>
      </li>
    );
  }
}

class AvailableGiftCardsDisplay extends React.Component {
  static propTypes = {
    giftCardsList: PropTypes.arrayOf(PropTypes.shape({
      onFileCardId: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
      cardEndingNumbers: PropTypes.string
    })).isRequired,

    onApplyItem: PropTypes.func.isRequired,

    isDisabledApply: PropTypes.bool
  }

  render () {
    let {giftCardsList, isDisabledApply} = this.props;

    if (!giftCardsList || giftCardsList.length === 0) {
      return null;
    }

    return (<section className="gift-cards-apply-container">
      <strong className="title-gift-card-apply">Gift Cards Apply</strong>
      <ul>
        {giftCardsList.map((giftCard) => {
          let {onFileCardId, ...otherGiftCardDetails} = giftCard;
          return <AvailablegiftCardDisplay id={onFileCardId} key={onFileCardId} {...otherGiftCardDetails} onApplyItem={this.props.onApplyItem} isDisabledApply={isDisabledApply} />;
        })}
      </ul>
    </section>
    );
  }
}

export {AvailableGiftCardsDisplay};
