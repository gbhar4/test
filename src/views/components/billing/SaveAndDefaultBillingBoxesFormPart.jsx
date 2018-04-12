/**  @module SaveAndDefaultBillingBoxesFormPart
 * @summary A form part displaying 'set as default' and 'save to account' checkboxes for billing method.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {AdaptiveField} from 'reduxStore/util/AdaptiveField';

export class SaveAndDefaultBillingBoxesFormPart extends React.Component {

  static propTypes = {
    /** optional css className of containing div */
    className: PropTypes.string,
    /** Flags if 'set as default' checkbox should be shown */
    isShowSetAsDefault: PropTypes.bool.isRequired,
    /** Flags if 'save to account' checkbox should be shown */
    isShowSaveToAccount: PropTypes.bool.isRequired,
    /** Flags if 'set as default' checkbox should be disabled */
    isSetAsDefaultDisabled: PropTypes.bool,
    /** Flags if 'save to account' checkbox should be disabled */
    isSaveToAccountDisabled: PropTypes.bool,
    /** flags if to add a line break between the two checkboxes */
    isAddLineBreakBetweenBoxes: PropTypes.bool
  }

  static defaultProps = {className: ''}

  constructor (props, context) {
    super(props, context);
    this.mapValuesToSetAsDefaultProps = this.mapValuesToSetAsDefaultProps.bind(this);
  }

  mapValuesToSetAsDefaultProps (values) {
    return {
      disabled: !values.saveToAccount,                         // disable setAsDefault checkbox if saveToAccount is not selected, enable otherwise
      _newValue: !values.saveToAccount ? false : undefined     // clear setAsDefault checkbox if saveToAccount is not selected
    };
  }

  render () {
    let {className, isShowSaveToAccount, isShowSetAsDefault, isSaveToAccountDisabled, isSetAsDefaultDisabled, isAddLineBreakBetweenBoxes} = this.props;

    return (<div className={className}>
      {isShowSaveToAccount && <Field name="saveToAccount" component={LabeledCheckbox} className="save-to-account"
        title="Save card to my account" disabled={isSaveToAccountDisabled} />}
      {isAddLineBreakBetweenBoxes && <br />}
      {isShowSetAsDefault &&
        (isShowSaveToAccount
          ? <AdaptiveField name="setAsDefault" component={LabeledCheckbox} className="set-as-default"
            title="Set as default payment method" disabled={isSetAsDefaultDisabled}
            adaptTo={'saveToAccount'} mapValuesToProps={this.mapValuesToSetAsDefaultProps} />
          : <Field name="setAsDefault" component={LabeledCheckbox} className="set-as-default"
            title="Set as default payment method" disabled={isSetAsDefaultDisabled} />
        )
      }
    </div>);
  }
}
