/** @module createStaticHistory
 * @summary a factory method returning a history object (see 'history' package) for server side use.
 *
 * All operations are implemnted as no-op.
 *
 * @author Ben
 */
import {parsePath, createPath} from 'history';
import invariant from 'invariant';

const nop = () => {};

const historyTemplate = {
  action: 'POP',
  length: 1,
  createHref: createPath,
  go: () => unavilable.bind(null, 'go'),
  goBack: unavilable.bind(null, 'goBack'),
  goForward: () => unavilable.bind(null, 'goForward'),
  push: nop,
  replace: nop,
  listen: nop,
  block: nop
};

export function createStaticHistory (path) {
  return {...historyTemplate, location: parsePath(path)};
}

function unavilable (methodName) {
  invariant(false, `staticHistory: '${methodName}' is not available (i.e., you should not be doing this on the server side)`);
}
