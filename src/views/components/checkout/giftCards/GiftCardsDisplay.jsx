/**
* @module AppliedGiftCardsDisplay
* @author Oliver Ramirez
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

class GiftCardsDisplay extends React.Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,

    giftCardsList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      endingNumbers: PropTypes.string
    })).isRequired
  }

  render () {
    let {giftCardsList} = this.props;

    return (<section className="gift-cards-container">
      <strong className="title-gift-card-applied">Gift Cards</strong>

      {giftCardsList.length
        ? <ul className="giftcard-list-display">
          {giftCardsList.map((giftCard) => {
            let {id, endingNumbers} = giftCard;

            return (<li id={id} className="giftcard">
              <p className="balance">Ending in {endingNumbers}</p>
            </li>);
          })}
        </ul>
        : <p className="nothing-applied">None</p>}
    </section>);
  }
}

export {GiftCardsDisplay};
