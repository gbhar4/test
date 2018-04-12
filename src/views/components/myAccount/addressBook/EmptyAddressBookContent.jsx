/**
 * @module EmptyAddressBookContent
 * Shows a message indicating the address book is empty and a CTA to allow the
 * user to add a new address.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

class EmptyAddressBookContent extends React.Component {
  static propTypes = {
  }

  render () {
    return (
      <section className="empty-address-book">
        <div className="empty-address-book-and-button">
          <div className="address-empty-content">
            <h4 className="address-empty-title">Create an Address Book to check out faster!</h4>
            <p className="address-empty-message">Add and save up to 5 shipping addresses so you can speed through the checkout process the next time you shop.</p>
          </div>

          <HyperLink destination={MY_ACCOUNT_SECTIONS.addressBook.subSections.addNewAddress}
            className="button-add-edit-address button-secondary">Add new address</HyperLink>
        </div>

      </section>
    );
  }
}

export {EmptyAddressBookContent};
