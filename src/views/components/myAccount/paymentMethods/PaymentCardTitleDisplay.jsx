/**
* @module PaymentCardTitleDisplay
* @author Agu
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

class PaymentCardTitleDisplay extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    onDelete: PropTypes.func
  }

  constructor (props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (event) {
    this.props.onDelete && this.props.onDelete(event);
  }

  render () {
    let {title, className} = this.props;
    let headerContainerClassName = cssClassName('payment-card-title-container ', className);

    return (
      <div className={headerContainerClassName}>
        <h3 className="payment-card-title">{title}</h3>
      </div>
    );
  }
}

export {PaymentCardTitleDisplay};
