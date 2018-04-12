/** @module espots (aka content-slots) action creators
 *
 * @author Ben
 */

import {ESPOT_TYPES} from './reducer';

export function getSetEspotValueActn (name, value, typeOfValue, extraInfo) {
  return {
    name: name,
    value: value,
    typeOfValue: typeOfValue,
    extraInfo: extraInfo,
    type: 'ESPOT_SET_VALUE'
  };
}

/**
 * An action for setting the table of espots the page should have.
 * Note that this action will overwrite the whole current espots table
 */
export function getSetEspotsTableActn (espotsTable) {
  return {
    espotsTable: espotsTable,
    type: 'ESPOT_SET_TABLE'
  };
}

export {ESPOT_TYPES};
