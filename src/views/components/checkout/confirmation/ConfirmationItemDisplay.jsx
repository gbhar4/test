/**
* @module ConfirmationItemDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Order confirmation page
*/

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.confirmation-item-display.scss');
} else {
  require('./_m.confirmation-item-display.scss');
}

class ConfirmationItemDisplay extends React.Component {
  static propTypes: {
    title: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired
  }

  render () {
    let {className, title, children} = this.props;

    return (
      <p className={'confirmation-item ' + className}>
        <strong>{title}</strong>
        {children}
      </p>
    );
  }
}

export {ConfirmationItemDisplay};
