/**
 * @module AirmilesPromo
 * @author Oliver Ramirez <oramirez@minutentag.com>
 * Shows a promotional area for airmiles promo when the user is from Canada.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {reduxForm, Field} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {ButtonTooltip} from 'views/components/tooltip/ButtonTooltip.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {FormValuesChangeTrigger} from 'reduxStore/util/FormValuesChangeTrigger.jsx';

class _AirmilesPromo extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,

    // Text from help icon Airmiles Number
    buttonTextNumber: PropTypes.string,

    // Text from information icon Airmiles Id
    buttonTextId: PropTypes.string
  }

  constructor (props, context) {
    super(props, context);

    this.state = {expanded: false, accountNumberValue: props.initialValues.accountNumberValue};

    this.handleBlur = (event) => this.props.handleSubmit(this.props.onSubmit)();
    this.handleEditClick = () => this.setState({expanded: true});
    this.handleAccountNumberChange = (values) => {
      // FIXME: is was triggering on the first character, I need the value to be valid before setting it

      let valueNumber = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(values.accountNumber);
      if (valueNumber && (values.accountNumber || '').length === 11) {
        this.setState({accountNumberValue: values.accountNumber});
        this.setState({expanded: false});
        this.props.handleSubmit(this.props.onSubmit)();
      }
    };
  }

  render () {
    let {buttonTextNumber, buttonTextId, handleSubmit, error} = this.props;
    let {accountNumberValue} = this.state;

    return (
      <form onSubmit={handleSubmit} className="airmiles-form summary-message">
        <FormValuesChangeTrigger adaptTo={'accountNumber'} onChange={this.handleAccountNumberChange} />
        {error && <ErrorMessage error={error} />}

        <img src="/wcsstore/static/images/airmiles-text.png" alt="airmiles img" />
        {accountNumberValue && !this.state.expanded
          ? <div className="airmiles-number">
            <span className="airmiles-collector-number">
              Air miles<sup>&reg;</sup> collector number
              {buttonTextNumber && <ButtonTooltip className="airmiles-number-help" type="tooltip" title="" direction="bottom">
                {buttonTextNumber}
              </ButtonTooltip>
              }
            </span>
            <p className="airmiles-collector-button-container">{accountNumberValue} <button className="air-miles-button-edit" type="button" onClick={this.handleEditClick}>Edit</button></p>
          </div>
          : <Field component={LabeledInput} className="airmiles-number" title={<span className="input-title"> Enter your collector number </span>} type="text" name="accountNumber" onBlur={this.handleBlur}>
            {buttonTextNumber && <ButtonTooltip className="airmiles-number-help" type="tooltip" title="" direction="bottom">
              {buttonTextNumber}
            </ButtonTooltip>}
          </Field>
        }
        <Field component={LabeledInput} className="airmiles-id" title={<div><span className="input-title"> Promo id </span><span className="second-title">(when applicable)</span></div>} type="text" name="promoId" value="" onBlur={this.handleBlur}>
          {buttonTextId && <ButtonTooltip className="airmiles-id-information" type="info" title="" direction="bottom">
            {buttonTextId}
          </ButtonTooltip>}
        </Field>
        <p className="text-under">Trademarks of AIR MILES International Trading B.V.<br /> Used under license by LoyaltyOne, Co. and The Children’s Place.</p>
      </form>
    );
  }
}

let validateMethod = createValidateMethod({
  rules: {
    accountNumber: {
      number: true,
      exactLength: 11
    }
  },
  messages: {
    accountNumber: {
      // required: 'Please enter your Airmiles Number',
      exactLength: 'Must be an 11 digit number',
      number: 'Must be numbers only'
    }
  }
});

let AirmilesPromo = reduxForm({
  form: 'airmilesForm',  // a unique identifier for this form
  enableReinitialize: true,     // so we respond to new accountNumber and promoId as we reload order details
  ...validateMethod
})(_AirmilesPromo);

export {AirmilesPromo};
