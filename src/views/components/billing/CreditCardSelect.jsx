/** @module CreditCardSelect
 * @summary a form field based on CustomSelect.jsx for selecting a credit card from a list of cards.
 * Also presents the option to click on an "Add a new credit card" button. Selecting this button
 * will set the value of this select to the empty string ''.
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 *
 * Any extra props (i.e., other than <code>creditCardEntries</code>),
 * e.g., <code>name, className, placeholder, meta</code>, passed to this component (either directly or by a wrapping HOC)
 * will be passed along to the rendered <code>CustomSelect</code> element.
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import {CONTACT_ONLY_ADDRESS_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/addressPropTypes';

class CreditCardSelect extends React.Component {

  static propTypes = {
    /** The list of addresses to choose from */
    creditCardEntries: PropTypes.arrayOf(PropTypes.shape({
      onFileCardId: PropTypes.string.isRequired,
      cardType: PropTypes.string.isRequired,        // visa, amex, etc
      cardNumber: PropTypes.string.isRequired,  // all numbers of the card (might be masked)
      imgPath: PropTypes.string.isRequired,     // a url for an image showing the card type
      isDefault: PropTypes.bool.isRequired,
      isExpired: PropTypes.bool.isRequired,

      address: CONTACT_ONLY_ADDRESS_PROP_TYPE_SHAPE.isRequired
    })).isRequired,

    isMobile: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context);
    this.handleEntrySelection = this.handleEntrySelection.bind(this);
  }

  handleEntrySelection (onFileCardId) {
    this.props.input.onChange(onFileCardId);
    this.props.onSelectEntry && this.props.onSelectEntry(onFileCardId);
  }

  getOptionsMap () {
    let ccEntries = [];

    this.props.creditCardEntries.map((entry) => {
      ccEntries.push({
        value: entry.onFileCardId,
        content: <CardDetails imgPath={entry.imgPath} type={entry.cardType} cardNumber={entry.cardNumber} isDefault={entry.isDefault}
                  isExpired={entry.isExpired} firstName={entry.address.firstName} lastName={entry.address.lastName} />,
        title: <CardTitle type={entry.cardType} cardNumber={entry.cardNumber} isDefault={entry.isDefault} isExpired={entry.isExpired} />
      });
    });

    ccEntries.push({
      value: '',
      content: <span aria-label="Add a new credit card" className="button-add-new button-add-new-card">+ Add a new credit card</span>,
      title: '+ Add a new credit card'
    });

    return ccEntries;
  }

  renderMobile () {
    let {
      creditCardEntries,
      onAddNewEntry
    } = this.props;

    return (
      <ul>
        {creditCardEntries.map((entry) => {
          return (<CreditCardMobileEntry key={entry.onFileCardId} entry={entry} onEntrySelection={this.handleEntrySelection} onEditEntry={this.props.onEditEntry} />);
        })}

        <button aria-label="Add a credit card" className="button-add-new"
          onClick={onAddNewEntry}>+ Add a new credit card</button>
      </ul>);
  }

  renderDesktop () {
    let {
      creditCardEntries,         /* we do not want this in otherProps */ // eslint-disable-line
      ...otherProps
    } = this.props;

    return (
      <CustomSelect {...otherProps} optionsMap={this.getOptionsMap()} />
    );
  }

  render () {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop();
  }
}

function CardDetails (props) {
  return (<div className="card-details">
    <span className="cardholder-name">
      {props.firstName} {props.lastName}
      {props.isExpired && <strong>(expired)</strong>}
      {props.isDefault && <strong>(default)</strong>}
    </span>
    <img src={props.imgPath} alt={props.cardType} className="card-img" />
    <span className="card-suffix">ending in {props.cardNumber.substr(props.cardNumber.length - 4)}</span>
  </div>);
}

function CardTitle (props) {
  return (
    <p className="selected-card">
      {props.cardType} ending in {props.cardNumber.substr(props.cardNumber.length - 4)} {props.isExpired && <strong>(expired)</strong>} {props.isDefault && <strong>(default)</strong>}
    </p>
  );
}

class CreditCardMobileEntry extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.handleEntrySelection = this.handleEntrySelection.bind(this);
    this.handleEntryEdit = this.handleEntryEdit.bind(this);
  }

  handleEntrySelection () {
    this.props.onEntrySelection(this.props.entry.onFileCardId);
  }

  handleEntryEdit () {
    this.props.onEditEntry(this.props.entry.onFileCardId);
  }

  render () {
    let {entry} = this.props;

    return (<li className="address-item" key={entry.onFileCardId}>
      <CardDetails imgPath={entry.imgPath} type={entry.cardType} cardNumber={entry.cardNumber} isDefault={entry.isDefault} isExpired={entry.isExpired} firstName={entry.address.firstName} lastName={entry.address.lastName} />

      <div className="button-container">
        <button type="button" className="button-quaternary button-select-this" onClick={this.handleEntrySelection}>Select this</button>
        <button type="button" className="button-edit" onClick={this.handleEntryEdit}>Edit</button>
      </div>
    </li>);
  }
}

export {CreditCardSelect};
