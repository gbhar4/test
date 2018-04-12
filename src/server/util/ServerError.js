/** @module ServerError
 * @summary an Error class describing a server-side error.
 *
 * @author Ben
 */
import ExtendableError from 'es6-error';
import { getPageByUrl } from './routingHelper';
import { PAGES } from 'routing/routes/pages';

export class ServerError extends ExtendableError {

  /**
   * @param {string}   message the error message.
   * @param {number}   networkStatusCode an optional HTTP response status code.
   */
  constructor (message, networkStatusCode) {
    super(message);
    this.networkStatusCode = networkStatusCode;
  }
}

  /* (DT-31286)
  *  if we need to server differant 404 espots on a page by page basis.
  */
export function get404Info (pagePath) {
  let { outfitDetails, productDetails, notFound } = PAGES;
  let { id } = getPageByUrl(pagePath);

  switch (id) {
    case outfitDetails.id:
      return page404Info[outfitDetails.id];
    case productDetails.id:
      return page404Info[productDetails.id];
    default:
      return page404Info[notFound.id];
  }

}

const page404Info = {
  [PAGES.outfitDetails.id]: {
    espotName: 'OUTFIT_404',
    statusCode: 200
  },
  [PAGES.productDetails.id]: {
    espotName: 'PDP_404',
    statusCode: 200
  },
  [PAGES.notFound.id]: {
    espotName: '404',
    statusCode: 404
  }
};
