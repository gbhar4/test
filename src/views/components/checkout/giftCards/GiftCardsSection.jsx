/**
* @module GiftCardsSection
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Intermediate component to join available gc, applied gc, or add new gc form
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';

import {AppliedGiftCardsDisplay} from 'views/components/checkout/giftCards/AppliedGiftCardsDisplay.jsx';
import {AvailableGiftCardsDisplay} from 'views/components/checkout/giftCards/AvailableGiftCardsDisplay.jsx';
import {AddGiftCardFormContainer} from 'views/components/checkout/giftCards/AddGiftCardFormContainer.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.giftcards.scss');
} else {
  require('./_m.giftcards.scss');
}

class GiftCardsSection extends React.Component {
  static propTypes = {
    /** list of applied gift cards */
    appliedGiftCards: AppliedGiftCardsDisplay.propTypes.giftCardsList,

    /** list of available gift cards */
    availableGiftCards: AvailableGiftCardsDisplay.propTypes.giftCardsList,

    /** <code>true</code> indicates that we need to show the add new form
     * (for instance, on non review pages, or on express checkout) */
    isEnableAddGiftCardForm: PropTypes.bool,

    /** <code>true</code> indicates that we can remove applied GCs (false on review page for non-express users) */
    isEnableRemoveItem: PropTypes.bool,

    /** <code>true</code> indicates that we would hide appliedGiftCards when there are none applied */
    isHideNoneApplied: PropTypes.bool,

    /** callback to remove a GC from the order */
    onRemoveItem: PropTypes.func.isRequired,

    /** max amount of giftcards allowed to apply */
    maxGiftCards: PropTypes.number.isRequired,

    /** callback to apply GC to order */
    onApplyItem: PropTypes.func.isRequired
  }

  render () {
    let {className, maxGiftCards, appliedGiftCards, availableGiftCards, isEnableAddGiftCardForm, isEnableRemoveItem, isHideNoneApplied, isDisabledApply} = this.props;

    return (
      <section className={className + ' gift-cards-section'}>
        <CheckoutSectionTitleDisplay title="Gift Cards" note={'Add up to ' + maxGiftCards + ' gift cards and/or merchandise credits.'} className="gift-cards-section-title" />
        {((appliedGiftCards && appliedGiftCards.length) || !isHideNoneApplied)
          ? <AppliedGiftCardsDisplay giftCardsList={appliedGiftCards} onRemoveItem={this.props.onRemoveItem} enableRemoveItem={isEnableRemoveItem} />
          : null}

        {availableGiftCards
          ? <AvailableGiftCardsDisplay giftCardsList={availableGiftCards} onApplyItem={this.props.onApplyItem} isDisabledApply={isDisabledApply} />
          : null}

        {isEnableAddGiftCardForm
          ? <AddGiftCardFormContainer />
          : null}
      </section>
    );
  }
}

export {GiftCardsSection};
