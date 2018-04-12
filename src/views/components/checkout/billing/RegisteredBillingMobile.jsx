/**
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';
import {PaymentMethodFormSection} from './PaymentMethodFormSection.jsx';
import {CreditCardSelect} from 'views/components/billing/CreditCardSelect.jsx';
import {TitlePlusEditButton} from 'views/components/checkout/TitlePlusEditButton.jsx';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';

import {CreditCardSelectModal} from 'views/components/billing/CreditCardSelectModal.jsx';
import {ExpressCVVFormPartContainer} from 'views/components/checkout/billing/ExpressCVVFormPartContainer.jsx';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';

import {Field} from 'redux-form';
import {RegisteredBillingAddressMobileContainer} from 'views/components/checkout/billing/RegisteredBillingAddressMobileContainer.js';
import {RegisteredBillingAddressMobile} from 'views/components/checkout/billing/RegisteredBillingAddressMobile.jsx';
import {CreditCardFormPartContainer} from 'views/components/billing/CreditCardFormPartContainer.js';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {AdaptiveField} from 'reduxStore/util/AdaptiveField';

let BillingDetailsFormPart = getAdaptiveFormPart((props) => {
  let {creditCardEntries, isSaveCCToAccountEnabled, isAddNewCard,
    mapValuesToSetAsDefaultProps, cardType, cardIcon,
    isWalletOpen, isSameAsShippingEnabled, selectedCardId,
    isSetCCAsDefaultEnabled, onEditCardSubmit, onNewCardSubmit,
    handleEditModeChange, handleNewCardClick, handleCloseClick, handleCardSelectionChange,
    addressBookEntries, selectedCardDetails, currentShippingDetails, change
  } = props;

  if (props.isPaypalSelected) {
    return (<div className="message-paypal">
      <p className="message-paypal-selected">
        By selecting PayPal, you will leave childrensplace.com to complete the order process with PayPal's site.
        <br /> You will be returned to childrensplace.com with completion of PayPal Payment.
      </p>
      <p className="message-paypal-selected">Please review your purchase and delivery details before proceeding.</p>
    </div>);
  } else {
    let selectedCreditCardEntry = creditCardEntries.find((entry) => { return entry.onFileCardId === selectedCardId; });

    /* FIXME: revisit on R3 once we have backend support for multiple cc on the account */
    /* and maybe move to container for R2 */
    if (!selectedCreditCardEntry && selectedCardDetails.address) {
      // there's info about a 'new' card, put it in there
      // NOT the correct place for this
      let addressEntry = addressBookEntries.find((entry) => entry.addressKey === selectedCardDetails.address.onFileAddressKey);
      let selectedCardType = paymentCardsStoreView.getCreditCardType(selectedCardDetails);

      selectedCreditCardEntry = {
        ...selectedCardDetails,
        cardEndingNumbers: selectedCardDetails.cardNumber.substr(-4),
        address: addressEntry ? addressEntry.address : null,
        cardType: selectedCardType || cardType,
        imgPath: (selectedCardType && paymentCardsStoreView.getCreditCardIcon(selectedCardDetails)) || cardIcon,
        isExpired: selectedCardDetails.isExpired
      };
    }

    // Existing prod issue, I will create a new ticket for R7 to review this and other checkout components as this seems VERY messy
    if (!creditCardEntries.length || !selectedCreditCardEntry || !selectedCreditCardEntry.address) {
      return <div className="add-new-card-and-address-container">
        <div className="new-credit-card-container">
          <CreditCardFormPartContainer />

          {isSaveCCToAccountEnabled && <Field name="saveToAccount" component={LabeledCheckbox} className="save-to-account" title="Save card to my account" />}
          {isSetCCAsDefaultEnabled && <AdaptiveField name="setAsDefault" component={LabeledCheckbox} className="set-as-default" title="Set as default payment method"
            adaptTo={'saveToAccount'} mapValuesToProps={mapValuesToSetAsDefaultProps} />}
        </div>

        <RegisteredBillingAddressMobileContainer isSameAsShippingEnabled={isSameAsShippingEnabled} currentShippingDetails={currentShippingDetails} />
      </div>;
    }

    return (
      <div className="address-and-payment-section">
        <div className="address-billing">
          {!isWalletOpen
            ? <button type="button" className="button-add-card" onClick={handleNewCardClick}>+ Add new card</button>
            : <CreditCardSelectModal
              creditCardEntries={creditCardEntries}
              onEditCardSubmit={onEditCardSubmit}
              onNewCardSubmit={onNewCardSubmit}

              onClose={handleCloseClick}
              onCardSelectionChange={handleCardSelectionChange}

              isSameAsShippingEnabled={isSameAsShippingEnabled}
              isShowSaveToAccount={isSaveCCToAccountEnabled}
              isShowSetAsDefault={isSetCCAsDefaultEnabled}

              isAdding={isAddNewCard}
              change={change}
            />
          }
        </div>

        {selectedCreditCardEntry && <div className="credit-card-form-container">
          <TitlePlusEditButton title="Card Details" onEdit={handleEditModeChange} />

          <div className="payment-method-container">
            <div className="card-container">
              <span className="title-payment-method">Payment Method {selectedCreditCardEntry.isExpired && <strong>(expired)</strong>}</span>
              <img src={selectedCreditCardEntry.imgPath} alt={selectedCreditCardEntry.cardType} />
              <span className="card-suffix">ending in {selectedCreditCardEntry.cardEndingNumbers}</span>
            </div>

            {selectedCreditCardEntry.isCVVRequired && <ExpressCVVFormPartContainer />}
          </div>

          <ContactInfoDisplay title="Billing Address" address={selectedCreditCardEntry.address} isShowAddress />
        </div>}
      </div>);
  }
});

export class RegisteredBillingMobile extends React.Component {
  static propTypes = {
    /** A map of the saved cards */
    creditCardEntries: CreditCardSelect.propTypes.creditCardEntries,

    /** Flags to indicate 'save cc to account' option enabled */
    isSaveCCToAccountEnabled: PropTypes.bool.isRequired,

    /** Flags to indicate 'set cc as default' option enabled */
    isSetCCAsDefaultEnabled: PropTypes.bool.isRequired,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool,

    /** bopis orders don't require shipping, so "same as shipping" shouldn't be visible */
    isSameAsShippingEnabled: PropTypes.bool.isRequired,

    /** the selected shipping address details. Required if isSameAsShippingEnabled is true */
    currentShippingDetails: RegisteredBillingAddressMobile.propTypes.currentShippingDetails,

    /** a callback allowing one to change values of form fields
     * (usually comes from the redux-form injected form prop called 'change') */
    change: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      isWalletOpen: false
    };
    this.handleEditModeChange = this.handleEditModeChange.bind(this);
    this.handleCardSelectionChange = this.handleCardSelectionChange.bind(this);
    this.handleNewCardClick = this.handleEditModeChange.bind(this, true, true);
    this.handleCloseClick = this.handleEditModeChange.bind(this, false, false);
    this.mapValuesToBillingAddressProps = this.mapValuesToBillingAddressProps.bind(this);
    this.mapValuesToSetAsDefaultProps = this.mapValuesToSetAsDefaultProps.bind(this);
  }

  handleEditModeChange (isEditMode, isAddNewCard) {
    this.setState({
      isWalletOpen: isEditMode,
      isAddNewCard: isAddNewCard
    });
  }

  handleCardSelectionChange (onFileCardId) {
    this.setState({
      isWalletOpen: this.state.isEditing,
      isAddNewCard: false
    });
  }

  mapValuesToBillingAddressProps (values) {
    return {
      isPaypalSelected: values.paymentMethod === 'paypal',
      selectedCardId: values.onFileCardId,
      selectedCardDetails: {
        ...values,
        isCVVRequired: paymentCardsStoreView.getIsEditingCardCVVRequired(null, paymentCardsStoreView.getCreditCardType(values))
      }
    };
  }

  mapValuesToSetAsDefaultProps (values) {
    return {
      disabled: !values.saveToAccount,    // disable setAsDefault checkbox if saveToAccount is not selected, enable otherwise
      _newValue: !values.saveToAccount ? false : undefined     // clear setAsDefault checkbox if saveToAccount is not selected
    };
  }

  render () {
    let {isPaypalEnabled, isCountryUS} = this.props;

    return (
      <section className="checkout-billing-section">
        <CheckoutSectionTitleDisplay title="Payment Method" />

        {isPaypalEnabled && <PaymentMethodFormSection isMobile isCountryUS={isCountryUS} />}

        <BillingDetailsFormPart adaptTo={'paymentMethod,onFileCardId,cardNumber,expMonth,expYear,cvv,address.onFileAddressKey'}
          mapValuesToProps={this.mapValuesToBillingAddressProps} {...this.props} {...this.state}
          handleCardSelectionChange={this.handleCardSelectionChange} handleEditModeChange={this.handleEditModeChange}
          handleNewCardClick={this.handleNewCardClick} handleCloseClick={this.handleCloseClick}
          mapValuesToSetAsDefaultProps={this.mapValuesToSetAsDefaultProps} />
      </section>
    );
  }
}
