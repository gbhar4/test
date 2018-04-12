import {isMobileConnect} from 'views/components/common/containers/isMobileConnect';
import {AddressBookSelect} from './AddressBookSelect.jsx';

let {isMobile, ...otherPropTypes} = AddressBookSelect.propTypes;      // eslint-disable-line no-unused-vars

let AddressBookSelectContainer = isMobileConnect(AddressBookSelect);
AddressBookSelectContainer.propTypes = otherPropTypes;      // container propTypes are AddressBookSelect.propTypes minus isMobile

export {AddressBookSelectContainer};
