/** @module ShippingMethodFormSection
 * @summary A FormSection component for choosing a shipping method.
 *
 * The default name (for use by a containing redux-form) of this form section is 'method'.
 *
 * Provides fields with the following names: shippingMethodId.
 *
 * Provide a static defaultValidation property that is an object that can be passed to
 *  util/formsValidation/createValidateMethod.
 *
 *  This component extends redux-form's FormSection component.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';
import {LabeledRadioButton} from 'views/components/common/form/LabeledRadioButton.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import {FormValuesChangeTrigger} from 'reduxStore/util/FormValuesChangeTrigger.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.shipping-methods.scss');
} else {  // eslint-disable-line
  require('./_m.shipping-methods.scss');
}

let EstimatedRate = getAdaptiveFormPart((props) =>
  <strong className="estimated-shipping-rate">{(props.method.displayName || '') +
    ' - ' + (props.method.shippingSpeed || '')}</strong>
);

// note that we are extending FormSection (and not React.Component) just so that we can provide a default 'name' prop.
export class ShippingMethodFormSection extends FormSection {

  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /** a map of the different shipping methods available (sorted by ascending price) */
    optionsMap: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      shippingSpeed: PropTypes.string.isRequired,
      isDefault: PropTypes.bool
    })).isRequired,

    /** a method to change values in the form (comes from redux form) */
    change: PropTypes.func.isRequired,

    /** a callback for when a different shipping method is selected **/
    onChange: PropTypes.func.isRequired,

    /**
     * Optional full name this formSection relative to the root of the form (e.g., 'a.b.method').
     * This must be provided if this section is nested inside another FormSection.
     */
    fullName: PropTypes.string
  }

  static defaultProps = {
    /** the default name of this form section */
    name: 'method'
  }

  static defaultValidation = getStandardConfig(['shippingMethodId'])

  constructor (props, context) {
    super(props, context);

    this.selectedMethodId = undefined;

    this.mapValuesToEstimatedRateProps = this.mapValuesToEstimatedRateProps.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.optionsMap !== nextProps.optionsMap) {
      // if the currently selected method (if any) is not in the new map, and map is not empty
      if (nextProps.optionsMap.length > 0 && nextProps.optionsMap.findIndex((method) => method.id === this.selectedMethodId) < 0) {
        let defaultMethod = nextProps.optionsMap.find((method) => method.isDefault);
        if (defaultMethod) {         // select the default method in the new map
          this.props.change(this.getFullshippingMethodIdFieldName(), defaultMethod.id);
        } else {     // select the first method in the new map
          this.props.change(this.getFullshippingMethodIdFieldName(), nextProps.optionsMap[0].id);
        }
      }
    }
  }

  getFullshippingMethodIdFieldName () {
    return (this.props.fullName || this.props.name) + '.' + 'shippingMethodId';
  }

  handleMethodChange (values) {
    this.selectedMethodId = values.shippingMethodId;
    this.props.onChange(values.shippingMethodId);
  }

  mapValuesToEstimatedRateProps (values) {
    return {
      method: values.shippingMethodId ? this.props.optionsMap.find((method) => values.shippingMethodId === method.id) || {} : {}
    };
  }

  render () {
    let {isMobile, optionsMap} = this.props;
    let shippingMethodContainerClass = cssClassName(
      'shipping-methods shipping-methods-form ', {'shipping-methods-input-box ': isMobile}
    );

    return (
      <div className={shippingMethodContainerClass}>
        <FormValuesChangeTrigger adaptTo={'shippingMethodId'} onChange={this.handleMethodChange} />

        {optionsMap.length > 0 && [
          <fieldset key="2">
            <legend className="shipping-method-title">Shipping Method</legend>
            {optionsMap.map((option) => {
              let {id, displayName, price, shippingSpeed} = option;
              let title = (price > 0) ? (displayName + ' - $' + price) : displayName;
              let subtitle = (!isMobile && shippingSpeed) ? ('(' + shippingSpeed + ')') : '';

              return <Field name="shippingMethodId" component={LabeledRadioButton} key={id} className="radio-method"
                selectedValue={id} title={title} subtitle={subtitle} />;
            })}

            {isMobile && <EstimatedRate adaptTo={'shippingMethodId'} mapValuesToProps={this.mapValuesToEstimatedRateProps} />}
          </fieldset>
        ]}
      </div>
    );
  }
}
