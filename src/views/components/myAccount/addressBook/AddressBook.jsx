/**
 * @module AddressBook
 * Shows the different views for the user to manage it's addresses in My Account.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Switch} from 'views/components/common/routing/Switch.jsx';
import {Route} from 'views/components/common/routing/Route.jsx';
import {AddNewAddressContainer} from './AddNewAddressContainer';
import {EditAddressContainer} from './EditAddressContainer';
import {AddressItemsList} from './AddressItemsList.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {BreadCrumbs} from 'views/components/common/routing/BreadCrumbs.jsx';
import {ModalAddressVerificationFormContainer} from 'views/components/address/verificationModal/ModalAddressVerificationFormContainer.js';

if (DESKTOP) { // eslint-disable-line
  require('views/components/address/_d.address-list.scss');
} else {
  require('views/components/address/_m.address-list.scss');
}

class AddressBook extends React.Component {
  static propTypes = {
    /** Addresses to show in the address list. */
    addressItems: AddressItemsList.propTypes.items,

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

    /** flags if the address verification modal should be rendered */
    isAddressVerifyModalOpen: PropTypes.bool.isRequired,

    /** message to show because of successfull operations */
    successMessage: PropTypes.string,

    /** callback to clear the success message */
    onClearSuccessMessage: PropTypes.func.isRequired
  }

  render () {
    let {isMobile, addressItems, className, onDeleteItem, onSetAsDefaultAddress,
      isAddressVerifyModalOpen, successMessage, onClearSuccessMessage} = this.props;
    let addressBookContainerClass = cssClassName('address-book-section ', 'account-address-book-section ', className);
    let addressBookRoute = MY_ACCOUNT_SECTIONS.addressBook;

    return (
      <div className={addressBookContainerClass}>
        <Route component={BreadCrumbs} componentProps={{sections: MY_ACCOUNT_SECTIONS}} />
        <Switch>
          <Route path={addressBookRoute.subSections.addNewAddress.pathPattern}
            component={AddNewAddressContainer}
            componentProps={{isHavePhoneField: true, isShowSetAsDefault: true, submitButtonText: 'Add Address'}} />
          <Route path={addressBookRoute.subSections.editAddress.pathPattern}
            component={EditAddressContainer}
            componentProps={{isHavePhoneField: true, isShowSetAsDefault: true, submitButtonText: 'Update'}} />
          <Route path={addressBookRoute.pathPattern} component={AddressItemsList}
            componentProps={{isMobile: isMobile, items: addressItems, onDeleteItem,
              onSetAsDefaultAddress, successMessage, onClearSuccessMessage}} />
        </Switch>

        {isAddressVerifyModalOpen && <ModalAddressVerificationFormContainer isOpen />}
      </div>
    );
  }
}

export {AddressBook};
