/**
 * @module BreadCrumbs
 * @summary A React component rendering a list of hyperlinks as bread crumbs.
 /**
 * @module Breadcrum
 * @author Florencia Acosta <facosta@minutentag.com>
 * Component that displays a list of section links.
 *
 * @example
 * <code>
 *   <Breadcrum className={string} name={string} steps={array[object]} />
 * </code>
 *
 * Component Props description/enumeration:
 *  @param {string} actualSection: the text to display as title
 *  @param {string} className: the additional pickup person details
 *  @param {array} steps: array of links to show
 *
 * Style (ClassName) Elements description/enumeration
 *  .breadcrum-container
 *  .breadcrum-item
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

require('views/scss/_breadcrum.scss');

export class FixedBreadCrumbs extends React.Component {
  static propTypes = {
    crumbs: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        /** A description of a (non-legacy) page, or section within a page, to link to */
        destination: HyperLink.propTypes.destination,
        /** optional suffix for the url's path (used for example to concatenate a skuId, etc.) */
        pathSuffix: HyperLink.propTypes.pathSuffix,
        /** Optional simple object of key-value pairs that will be appended to the query string of the url */
        queryValues: HyperLink.propTypes.queryValues,
        /** optional hash to be added to url */
        hash: HyperLink.propTypes.hash,
        /** optional state part for the url (see window.location docs).
         * Observe that this is ignored if the page is not the same as the current page (as this is not preseved
         * when going back to the server).
         */
        state: HyperLink.propTypes.state
      }),
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        /** A url to link to */
        destinationUrl: PropTypes.string.isRequire
      })
    ])).isRequired,
    separationChar: PropTypes.string
  }

  static defaultProps = {
    separationChar: '/'
  }

  render () {
    let {crumbs, separationChar} = this.props;

    return (
      <div className="breadcrum-container">
        {crumbs.map((crumb, index) => {
          let {displayName, destinationUrl, ...otherHyperLinkProps} = crumb;
          let itemClassName = (index === (crumbs.length - 1)) ? 'breadcrum-last-item' : 'breadcrum-item';
          return (
            <p key={displayName + index} className="breadcrum-item-container">
              {destinationUrl
                ? <a className={itemClassName} href={destinationUrl}>{displayName}</a>
                : <HyperLink className={itemClassName} {...otherHyperLinkProps}>{displayName}</HyperLink>
              }
              {index !== (crumbs.length - 1) && <span className="breadcrum-separation">{separationChar}</span>}
            </p>
          );
        })}
      </div>
    );
  }
}
