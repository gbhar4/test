/**
* @summary Helper function to expose data for analytics tracking in DTM
*
* @author Carla
*/

/**
 * @function analyticsDataLayer
 * @param {Object} store - reference to the redux store
 * @summary expose the redux store for analytics tracking
 */
import Immutable from 'seamless-immutable';

export function analyticsDataLayer (store) {
    window._dl = (section) => {
      let state = {...store.getState()};

      if (section) {
        return state[section];
      }

      return Immutable(state);
    };
  };