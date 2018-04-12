/**  @module SaveAndDefaultAddressBoxesFormPart
 * @summary A form part displaying 'set as default' and 'save to account' checkboxes for address book.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {AdaptiveField} from 'reduxStore/util/AdaptiveField';

export class SaveAndDefaultAddressBoxesFormPart extends React.Component {

  static propTypes = {
    /** optional css className of containing div */
    className: PropTypes.string,
    /** Flags if 'set as default' checkbox should be shown */
    isShowSetAsDefault: PropTypes.bool,
    /** Flags if 'save to account' checkbox should be shown */
    isShowSaveToAccount: PropTypes.bool,
    /** Flags if 'set as default' checkbox should be disabled */
    isSetAsDefaultDisabled: PropTypes.bool,
    /** Flags if 'save to account' checkbox should be disabled */
    isSaveToAccountDisabled: PropTypes.bool,
    /** flags if to add a line break between the two checkboxes */
    isAddLineBreakBetweenBoxes: PropTypes.bool,
    /** indicates the checkbox is always checked when my account is checked **/
    isAlwaysChecked: PropTypes.bool
  }

  static defaultProps = {className: '', isSetAsDefaultDisabled: false}

  constructor (props, context) {
    super(props, context);
    this.mapValuesToSetAsDefaultProps = this.mapValuesToSetAsDefaultProps.bind(this);
  }

  mapValuesToSetAsDefaultProps (values) {
    return {
      disabled: !values.saveToAccount || this.props.isSetAsDefaultDisabled,               // disable setAsDefault checkbox if saveToMyAccount is not selected, enable otherwise
      _newValue: !values.saveToAccount ? false : this.props.isAlwaysChecked               // clear setAsDefault checkbox if saveToMyAccount is not selected
    };
  }

  render () {
    let {className, isShowSaveToAccount, isShowSetAsDefault, isSaveToAccountDisabled, isSetAsDefaultDisabled, isAddLineBreakBetweenBoxes} = this.props;

    return (<div className={className}>
      {isShowSaveToAccount && <div className="address-book-checkbox-container">
        <Field name="saveToAccount" component={LabeledCheckbox} className="checkbox-address-book" subtitle="Save to my address book" disabled={isSaveToAccountDisabled} />
      </div>}

      {/* isAddLineBreakBetweenBoxes && <br /> */}

      {isShowSetAsDefault &&
        <div className="set-as-default-checkbox-container">
          {isShowSaveToAccount
            ? <AdaptiveField name="setAsDefault" component={LabeledCheckbox}
              className="label-checkbox checkbox-set-default" subtitle="Set as default address" disabled={isSetAsDefaultDisabled}
              adaptTo={'saveToAccount'} mapValuesToProps={this.mapValuesToSetAsDefaultProps} />
            : <Field name="setAsDefault" component={LabeledCheckbox}
              className="label-checkbox checkbox-set-default" subtitle="Set as default address" disabled={isSetAsDefaultDisabled} />
          }
        </div>
      }
    </div>);
  }
}
