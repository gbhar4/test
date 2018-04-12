/** @module addressPropTypes
 * @summary basic propTypes used for addresses
 *
 * @author Ben
 */
import {PropTypes} from 'prop-types';

export const ADDRESS_PROP_TYPES = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  addressLine1: PropTypes.string.isRequired,
  addressLine2: PropTypes.string,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired
};
export const ADDRESS_PROP_TYPES_SHAPE = PropTypes.shape(ADDRESS_PROP_TYPES);

export const CONTACT_ONLY_ADDRESS_PROP_TYPE_SHAPE = PropTypes.shape({
  firstName: ADDRESS_PROP_TYPES.firstName.isRequired,
  lastName: ADDRESS_PROP_TYPES.lastName.isRequired
});
