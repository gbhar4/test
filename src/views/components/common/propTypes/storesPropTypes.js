/** @module storesPropTypes
 * @summary basic propTypes used for stores
 *
 * @author Ben
 */
import {PropTypes} from 'prop-types';
import {STORE_TYPES} from 'reduxStore/storeReducersAndActions/stores/stores';

export {STORE_TYPES};

export const REGULAR_HOURS_PROP_TYPE = PropTypes.arrayOf(PropTypes.shape({
  dayName: PropTypes.string.isRequired,
  openIntervals: PropTypes.arrayOf(PropTypes.shape({
    fromHour: PropTypes.string.isRequired,
    toHour: PropTypes.string.isRequired
  })).isRequired,
  isClosed: PropTypes.bool.isRequired
}));

export const STORE_SUMMARY_PROP_TYPES = {
  basicInfo: PropTypes.shape({
    /** store id identifier */
    id: PropTypes.string.isRequired,
    /** store Name */
    storeName: PropTypes.string.isRequired,
    /** Store Address contains whole info */
    address: PropTypes.shape({
      addressLine1: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired
    }).isRequired,
    /** Phone of the store */
    phone: PropTypes.string.isRequired,
    coordinates: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      long: PropTypes.number.isRequired
    })
  }).isRequired,

  hours: PropTypes.shape({
    /**
    * Array of opening and closing hours in which the store is open on convined (both regular and holidays)
    * days.
    */
    regularHours: REGULAR_HOURS_PROP_TYPE
  }),

  /*  contains info about store */
  features: PropTypes.shape({
    /** Type of store (i.e., Retail or Outlet) */
    storeType: PropTypes.oneOf([STORE_TYPES.RETAIL, STORE_TYPES.OUTLET]).isRequired,
    /**
     * Type of mall where the store is (Enclosed Mall, Open Air Mall, Street
     * Location, Strip Center)
     * optional
    */
    mallType: PropTypes.string,

    /** Type of entrance to the store. optional */
    entranceType: PropTypes.string,

    /** Informs if the store has BOPIS purchase method */
    isBopisAvailable: PropTypes.bool,

    /** Shows a class if item is selected */
    isSelectedClass: PropTypes.string
  }),

  /** The distance of the store from the user, based off their browser geolocation
    * will be -1 if no distance can be found, or string if found '3.2 mi.' */
  distance: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export const STORE_SUMMARY_PROP_TYPES_SHAPE = PropTypes.shape(STORE_SUMMARY_PROP_TYPES);
