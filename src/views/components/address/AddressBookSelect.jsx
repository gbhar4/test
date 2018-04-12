/** @module AddressBookSelect
 * @summary a form field based on CustomSelect.jsx for selecting an address from a list of addresses.
 * Also presents the option to click on an "Add New Address" button. Selecting this button
 * will set the value of this select to the empty string ''.
 *
 * Supports <code>input</code> and <code>meta</code> props passed down by a wrappping {@linkcode module:redux-form.Field} HOC.
 *
 * Any extra props (i.e., other than <code>addressBookEntries, isMobile</code>),
 * e.g., <code>name, className, placeholder, meta</code>, passed to this component (either directly or by a wrapping HOC)
 * will be passed along to the rendered <code>CustomSelect</code> element.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import {ContactInfoDisplay} from './ContactInfoDisplay.jsx';
import {ADDRESS_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/addressPropTypes';

require('./_m.address-book-select.scss');

export class AddressBookSelect extends React.Component {
  static propTypes = {
    /** The list of addresses to choose from */
    addressBookEntries: PropTypes.arrayOf(PropTypes.shape({
      addressKey: PropTypes.string.isRequired,
      address: ADDRESS_PROP_TYPES_SHAPE.isRequired,
      isDefault: PropTypes.bool.isRequired
    })).isRequired,

    isMobile: PropTypes.bool.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.handleEntrySelection = this.handleEntrySelection.bind(this);
  }

  getOptionsMap () {
    let addressBookEntries = [];
    for (let entry of this.props.addressBookEntries) {
      addressBookEntries.push({
        value: entry.addressKey,
        content: <ContactInfoDisplay address={entry.address} isShowAddress note={entry.isDefault ? '(default)' : undefined} />,
        title: <AddressTitle firstName={entry.address.firstName} lastName={entry.address.lastName} isDefault={entry.isDefault} isShowAddress />
      });
    }

    addressBookEntries.push({
      value: '',
      content: <span aria-label="Add a new address" className="button-add-new button-add-new-address">+ Add a new address</span>,
      title: '+ Add a new address'
    });

    return addressBookEntries;
  }

  renderDesktop () {
    let {
      addressBookEntries, isMobile,         /* we do not want this in otherProps */ // eslint-disable-line
      ...otherProps
    } = this.props;

    return (
      <CustomSelect {...otherProps} optionsMap={this.getOptionsMap()} />
    );
  }

  handleEntrySelection (addressKey) {
    this.props.input.onChange(addressKey);
    this.props.onSelectEntry && this.props.onSelectEntry(addressKey);
  }

  renderMobile () {
    let {
      addressBookEntries,
      onAddNewEntry
    } = this.props;

    return (
      <ul>
        {addressBookEntries.map((entry) => {
          return (<AddressBookMobileEntry key={entry.addressKey} entry={entry} onEntrySelection={this.handleEntrySelection} onEditEntry={this.props.onEditEntry} />);
        })}
        <button aria-label="Add a new address" className="button-add-new"
          onClick={onAddNewEntry}>+ Add a new address</button>
      </ul>);
  }

  render () {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop();
  }
}

function AddressTitle (props) {
  return (
    <p className="address-details">
      {props.firstName} {props.lastName} {props.isDefault && <span>(default)</span>}
    </p>
  );
}

class AddressBookMobileEntry extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.handleEntrySelection = this.handleEntrySelection.bind(this);
    this.handleEntryEdit = this.handleEntryEdit.bind(this);
  }

  handleEntrySelection () {
    this.props.onEntrySelection(this.props.entry.addressKey);
  }

  handleEntryEdit () {
    this.props.onEditEntry(this.props.entry.addressKey);
  }

  render () {
    let {entry} = this.props;

    return (<li className="address-item" key={entry.addressKey}>
      <ContactInfoDisplay address={entry.address} isShowAddress note={entry.isDefault && '(default)'} />
      <div className="button-container">
        <button type="button" className="button-quaternary button-select-this" onClick={this.handleEntrySelection}>Select this</button>
        <button type="button" className="button-edit" onClick={this.handleEntryEdit}>Edit</button>
      </div>
    </li>);
  }
}
