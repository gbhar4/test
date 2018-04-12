/** @module
 * @summary action crerators for manipulating addresses related information.
 *
 * @author Ben
 */

export function getSetCreditCardsBookActn (creditCardsBook) {
  return {
    creditCardsBook: creditCardsBook,
    type: 'ACCOUNT_SET_CREDIT_CARDS_BOOK'
  };
}

export function getSetExistingCardBalanceActn (onFileCardId, newBalance) {
  return {
    onFileCardId,
    newBalance,
    type: 'ACCOUNT_SET_CARD_BALANCE_IN_BOOK'
  };
}

export function getRemoveCardInBookActn (onFileCardId) {
  return {
    onFileCardId: onFileCardId,
    type: 'ACCOUNT_REMOVE_CARD_IN_BOOK'
  };
}

export function getSetCheckoutLastLookUpGiftCardBalanceActn (lastLookUpGiftCardBalance) {
  return {
    lastLookUpGiftCardBalance,
    type: 'ACCOUNT_FLAGS_SET_LAST_GIFTCARD_BALANCE'
  };
}
