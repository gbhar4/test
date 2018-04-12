/** @module resourceLoader
 * @summary provides convenience methods for loading url and file resources.
 *
 * Currently a simple loader based on little-loader, with very little intelligence.
 *
 * Author Ben
 */

import scriptLoad from 'little-loader';

// TODO: load this from a JSON file
let namedModulesMap = {
  'google.maps': {
    url: 'https://maps.googleapis.com/maps/api/js?v=3.27&client=gme-thechildrensplace&libraries=places,geometry',
    loadPromise: null
  },
  'recaptcha': {
    url: 'https://www.google.com/recaptcha/api.js',
    loadPromise: null
  },
  'paypal': {
    url: 'https://www.paypalobjects.com/api/checkout.js',
    loadPromise: null
  }
};

export function requireUrlScript (url) {
  return new Promise(function (resolve, reject) {
    scriptLoad(url, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function requireNamedOnlineModule (moduleName) {
  if (!namedModulesMap[moduleName].loadPromise) {
    namedModulesMap[moduleName].loadPromise = requireUrlScript(namedModulesMap[moduleName].url);
  }
  return namedModulesMap[moduleName].loadPromise;
}
