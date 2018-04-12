/** @module AddressItemsList
 * @summary a presentational component for rendering the list of addresses in
 * the user address book.
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {AddressItem, ADDRESS_BOOK_ENTRY_PROPTYPE} from './AddressItem.jsx';
import {ConfirmDeleteAddressModalContainer} from './ConfirmDeleteAddressModalContainer';
import {EmptyAddressBookContent} from './EmptyAddressBookContent.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';

class AddressItemsList extends React.Component {

  static propTypes = {
    /** address to include in the list */
    items: PropTypes.arrayOf(ADDRESS_BOOK_ENTRY_PROPTYPE).isRequired,

    /**
     * callback to handle request to delete an address item. It should accept a
     * single parameter that is the addressBookEntry id.
     */
    onDeleteItem: PropTypes.func.isRequired,

    /**
    * callback to handle request to mark an address as default. It should accept
    * a single parameter that is the addressBookEntry id.
    */
    onSetAsDefaultAddress: PropTypes.func.isRequired,

    /** message to show because of successfull operations */
    successMessage: PropTypes.string,

    /** callback to clear the success message */
    onClearSuccessMessage: PropTypes.func.isRequired
  }

  state = {
    deletingItem: null,
    error: null
  }

  constructor (props) {
    super(props);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleSetAsDefaultAddress = this.handleSetAsDefaultAddress.bind(this);
    this.setError = getSetErrorInStateMethod(this);
    this.clearSuccessMessage = this.clearSuccessMessage.bind(this);
  }

  handleDeleteItem (address) {
    this.clearSuccessMessage();
    this.setState({deletingItem: address});
    this.props.onDeleteItem(address)
      .then(() => this.setError()).catch((err) => this.setError(err));
  }

  handleSetAsDefaultAddress (address) {
    this.clearSuccessMessage();
    this.props.onSetAsDefaultAddress(address)
      .then(() => this.setError()).catch((err) => this.setError(err));
  }

  clearSuccessMessage () {
    this.props.onClearSuccessMessage();
  }

  render () {
    let {items, isMobile, successMessage} = this.props;
    let {deletingItem, error} = this.state;

    if (items.length === 0) {
      return <EmptyAddressBookContent />;
    }

    return (
      <section className="address-book-content">
        {error && <ErrorMessage error={error} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        <HyperLink destination={MY_ACCOUNT_SECTIONS.addressBook.subSections.addNewAddress}
          className="payment-add-new-button">Add new address</HyperLink>
        <ul className="address-items">
          {items.map((item) => { // render each address item
            return (<AddressItem key={item.addressId} addressBookEntry={item}
              onDeleteItem={this.handleDeleteItem} onSetAsDefaultAddress={this.handleSetAsDefaultAddress} />
            );
          })}
        </ul>
        <ConfirmDeleteAddressModalContainer isMobile={isMobile} deletingItem={deletingItem} />
      </section>
    );
  }

}

export {AddressItemsList};
