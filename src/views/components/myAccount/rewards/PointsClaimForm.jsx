/**
 * @module PointsClaim
 * Shows a list of points transactions with pagination in my account.
 *
 * @author damian <drossi@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import moment from 'moment';

import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledDatePickerInput} from 'views/components/common/form/LabeledDatePickerInput.jsx';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {AccountInformationDisplay} from 'views/components/myAccount/rewards/accountInformation/AccountInformationDisplay.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfigRules, getStandardConfigMessages} from 'util/formsValidation/validatorStandardConfig';
import {Route} from 'views/components/common/routing/Route.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {BreadCrumbs} from 'views/components/common/routing/BreadCrumbs.jsx';

const fieldNames = {
  TRANSACTION_TYPE: 'transactionType',
  ORDER_NUMBER: 'orderNumber',
  ORDER_DATE: 'orderDate',
  STORE_NUMBER: 'storeNumber',
  REGISTER_NUMBER: 'registerNumber',
  TRANSACTION_DATE: 'transactionDate',
  TRANSACTION_NUMBER: 'transactionNumber'
};

class _PointsClaimForm extends React.Component {
  static propTypes = {
    /** user MPR account information */
    user: PropTypes.shape({
      /* Last Name of user */
      lastName: PropTypes.string.isRequired,
      /* First Name of user */
      firstName: PropTypes.string.isRequired,
      /* Email address of user */
      emailAddress: PropTypes.string.isRequired
    }).isRequired,
    /** Rewards account number of the user */
    accountNumber: PropTypes.string.isRequired,
    /** a map of available transaction types to choose from */
    transactionTypesMap: PropTypes.arrayOf(PropTypes.shape({
      /** the id of the transaction type */
      id: PropTypes.string.isRequired,
      /** the name of the transaction type */
      displayName: PropTypes.string.isRequired
    })).isRequired,
    /** callback to call when the cancel button is pressed */
    onCancelClick: PropTypes.func.isRequired,
    ...reduxFormPropTypes
  }

  constructor (props) {
    super(props);

    this.mapValuesToPointsClaimDataProps = this.mapValuesToPointsClaimDataProps.bind(this);
    this.fieldFormater = this.fieldFormater.bind(this);
    this.fieldRestriction = this.fieldRestriction.bind(this);
  }

  mapValuesToPointsClaimDataProps (values) {
    return {
      isOnlineType: values.transactionType === 'online'
    };
  }

  // NOTE: would be nice to integrate this into the current validation Architecture
  fieldFormater (e) {
    const {STORE_NUMBER, TRANSACTION_NUMBER, REGISTER_NUMBER} = fieldNames;
    const {name, value} = e.target;
    const minLimit = ((name === STORE_NUMBER) || (name === TRANSACTION_NUMBER)) ? 4 : 2;

    if (isNaN(value) || value === '') {
      return;
    }

    if ([STORE_NUMBER, REGISTER_NUMBER, TRANSACTION_NUMBER].find((field) => field === name)) {
      let val = value;
      while (val.length < minLimit) {
        val = '0' + val;
      }
      this.props.change(name, val);
    }
  }

  // NOTE: would be nice to integrate this into the current validation Architecture
  fieldRestriction (e) {
    const {STORE_NUMBER, TRANSACTION_NUMBER, REGISTER_NUMBER} = fieldNames;
    const { name, value } = e.target;
    const maxLimit = name === REGISTER_NUMBER ? 2 : 4;

    if ([STORE_NUMBER, TRANSACTION_NUMBER, REGISTER_NUMBER].find((field) => field === name)) {
      this.props.change(name, value.toString().substr(0, maxLimit));
    }
  }

  render () {
    let {
      error,
      handleSubmit,
      submitting,
      transactionTypesMap,
      user,
      accountNumber,
      onCancelClick,
      className
    } = this.props;

    return (
      <div className={className + ' points-claim-container'}>
        <div className="points-claim-section">
          <Route component={BreadCrumbs} componentProps={{sections: MY_ACCOUNT_SECTIONS}} />
          <p className="points-claim-form-title">Please fill out the information below to claim points from a recent purchase.</p>

          <form className="my-rewards-section points-claim-container" onSubmit={handleSubmit} onBlur={this.fieldFormater} onChange={this.fieldRestriction}>
            {error && <ErrorMessage error={error} />}

            <Field name={fieldNames.TRANSACTION_TYPE} className="select-transaction-type" component={LabeledSelect} optionsMap={transactionTypesMap} title="Transaction type" />

            <div className="information-container">
              <AccountInformationDisplay idAccount={accountNumber} {...user} />
              <ReceiptSampleFormPart adaptTo="transactionType" mapValuesToProps={this.mapValuesToPointsClaimDataProps} />
            </div>

            <div className="form-content">
              <PointsClaimDataFormPart adaptTo="transactionType" mapValuesToProps={this.mapValuesToPointsClaimDataProps} />
              <button type="button" className="button-cancel" onClick={onCancelClick}>Cancel</button>
              <button className="button-submit-request" type="submit" aria-label="" disabled={submitting}>Submit request</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

let PointsClaimDataFormPart = getAdaptiveFormPart((props) => {
  return props.isOnlineType
  ? <div>
    <Field name={fieldNames.ORDER_NUMBER} component={LabeledInput} className="input-order-number" title="Order number" />
    <Field name={fieldNames.ORDER_DATE} component={LabeledDatePickerInput} className="input-order-date" title="Order date"
      disabledKeyboardNavigation maxDate={moment()} />
  </div>

  : <div>
    <Field name={fieldNames.STORE_NUMBER} component={LabeledInput} className="input-store-number" title="Store number" />
    <Field name={fieldNames.REGISTER_NUMBER} component={LabeledInput} className="input-register-number" title="Register number" />

    <Field name={fieldNames.TRANSACTION_DATE} component={LabeledDatePickerInput} title="Transaction date" className="input-transaction-date"
      disabledKeyboardNavigation maxDate={moment()} />

    <Field name={fieldNames.TRANSACTION_NUMBER} component={LabeledInput} className="input-transaction-number" title="Transaction number" />
  </div>;
});

let ReceiptSampleFormPart = getAdaptiveFormPart((props) => {
  return props.isOnlineType
  ? null
  : <div className="receipt-sample">
    <span className="receipt-sample-title">Receipt sample</span>
    <img src="/wcsstore/static/images/missing-points-receipt.png" alt="Receipt sample" />
  </div>;
});

let validateMethod = createValidateMethod({
  rules: {
    ...getStandardConfigRules([fieldNames.ORDER_NUMBER, fieldNames.STORE_NUMBER]),
    [fieldNames.ORDER_DATE]: {
      required: true,
      date: true,
      maxDate: moment()
    },
    [fieldNames.TRANSACTION_DATE]: {
      required: true,
      date: true,
      maxDate: moment()
    },
    [fieldNames.REGISTER_NUMBER]: {
      required: true,
      exactLength: 2,
      number: true
    },
    [fieldNames.TRANSACTION_NUMBER]: {
      required: true,
      exactLength: 4,
      number: true
    }
  },
  messages: {
    ...getStandardConfigMessages([fieldNames.ORDER_NUMBER, fieldNames.STORE_NUMBER]),
    [fieldNames.ORDER_DATE]: {
      required: 'Please enter the order date',
      date: 'Please enter a valid date.',
      maxDate: 'Please enter a valid date.'
    },
    [fieldNames.TRANSACTION_DATE]: {
      required: 'Field is required.',
      date: 'Please enter a valid date.',
      maxDate: 'Please enter a valid date'
    }
  }
});

let PointsClaimForm = reduxForm({
  form: 'pointsClaimForm',
  ...validateMethod
})(_PointsClaimForm);

export {PointsClaimForm};
