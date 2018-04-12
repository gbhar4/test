/** @module GiftWrappingFormSection
 * @summary A FormSection component for choosing a gift wrapping options.
 *
 * The default name (for use by a containing redux-form) of this form section is 'giftWrap'.
 *
 * Provides fields with the following names: optionId, message.
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
import {Modal} from 'views/components/modal/Modal.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
// import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {GiftWrappingOptions} from 'views/components/checkout/giftWrapping/GiftWrappingOptions.jsx';
import {LabeledTextArea} from 'views/components/common/form/LabeledTextArea.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.gift-wrapping-options.scss');
} else {
  require('./_m.gift-wrapping-options.scss');
}

let GiftWrappingSelectionFields = getAdaptiveFormPart((props) => {
  return props.isVisible ? (<div className="gift-wrapping-fields">
    <Field name="optionId" component={GiftWrappingOptions} className="dropdown-gift-wrapping" optionsMap={props.optionsMap} />
    <Field name="message" component={LabeledTextArea} title="Add your message" className="textarea-box" maxLength={100} />
  </div>) : <div className="gift-wrapping-fields"></div>;
});

// note that we are extending FormSection (and not React.Component) just so that we can provide a default 'name' prop.
export class GiftWrappingFormSection extends FormSection {
  static propTypes = {
    /** this is an accordion like component, we might receive a prop to make it expanded by default */
    initiallyExpanded: PropTypes.bool,

    /** the available gift wrapping options */
    optionsMap: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    })).isRequired
  }

  static defaultProps = {
    /** the default name of this form section */
    name: 'giftWrap'
  }

  static defaultValidation = {
    rules: {
      message: {
        message: true,
        maxLength: 100
      },
      optionId: {
        required: {depends: {hasGiftWrapping: {checked: true}}}
      }
    },
    messages: {
      optionId: 'Please select a gift wrapping option',
      message: 'Please verify your message'
    }
  }

  state = {
    isDetailsModalOpen: false
  }

  constructor (props, context) {
    super(props, context);

    this.mapValuesToGiftWrappingProps = this.mapValuesToGiftWrappingProps.bind(this);
    this.toggleDetailsModal = this.toggleDetailsModal.bind(this);
  }

  toggleDetailsModal () {
    this.setState({isDetailsModalOpen: !this.state.isDetailsModalOpen});
  }

  mapValuesToGiftWrappingProps (values) {
    return {
      isVisible: values.hasGiftWrapping
    };
  }

  render () {
    let {optionsMap} = this.props;
    let {isDetailsModalOpen} = this.state;

    return (optionsMap.length > 0 && <fieldset className="checkout-review-gift-wrapping checkout-review-gift-wrapping-form">
      <legend className="gift-wrapping-title">Gift Services <button className="gift-services-details" onClick={this.toggleDetailsModal} aria-label="Gift services details">details</button></legend>

      <Field name="hasGiftWrapping" component={LabeledCheckbox} className="add-gift-wrapping">
        <span>Add a gift receipt, message and/or gift boxes.</span>
      </Field>

      <GiftWrappingSelectionFields
        adaptTo={'hasGiftWrapping'}
        mapValuesToProps={this.mapValuesToGiftWrappingProps}
        optionsMap={this.props.optionsMap} />

      {isDetailsModalOpen && <Modal contentLabel="gift services details" className="overlay-container" overlayClassName="react-overlay overlay-center" isOpen>
        <button onClick={this.toggleDetailsModal} className="button-overlay-close" aria-label="close this modal"></button>
        <div className="overlay-content">
          <ContentSlot contentSlotName="gift_services_espot" />
        </div>
      </Modal>}
    </fieldset>);
  }
}
