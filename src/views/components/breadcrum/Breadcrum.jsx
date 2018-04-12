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
import cssClassName from 'util/viewUtil/cssClassName';

require('views/scss/_breadcrum.scss');

/** TODO: this component needs work that should be done when implementing search results page,
  because according to DT-669, the bread crumbs shown will be different when arriving to PDP
  from that page. */
class Breadcrum extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired
    })).isRequired,
    separationChar: PropTypes.string
  }

  render () {
    let {steps, separationChar} = this.props;

    if (!separationChar) {
      separationChar = '/';
    }

    return (
      <div className="breadcrum-container">
      {steps.map((step, index) => {
        let {name, link, title} = step;
        let itemClassName = cssClassName((index === (steps.length - 1)) ? 'breadcrum-last-item' : 'breadcrum-item');

        return (
          <p key={name} className="breadcrum-item-container">
            <a href={link} title={name} className={itemClassName}>{title}</a>
            {index !== (steps.length - 1) && <span className="breadcrum-separation">{separationChar}</span>}
          </p>
        );
      })}
      </div>
    );
  }
}

export {Breadcrum};
