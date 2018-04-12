/**
* @module PaymentMethodsTitleDisplay
* @author Florencia Acosta <facosta@minutentag.com>
* Small component that displays a title plus and edit button.
*
* @example
* <code>
*   <PaymentMethodsTitleDisplay title=[string] className=[string] onAdd=[function] />
* </code>
*
* Component Props description/enumeration:
*  @param {string} title: the text to display as title
*  @param {string} className: the additional pickup person details
*  @param {function} onAdd: the event handler.
*
* Style (ClassName) Elements description/enumeration
*  payment-and-giftcard-title-container
*
* @TODO: it needs an event handler for the edit button
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

class PaymentMethodsTitleDisplay extends React.Component {
  static propTypes = {
    /* Flag that indicates the title */
    title: PropTypes.string.isRequired,

    /* Flag that indicates the class name if is necessary */
    className: PropTypes.string
  }

  constructor (props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (event) {
    this.props.onAdd && this.props.onAdd(event);
  }

  render () {
    let {title, className} = this.props;
    let paymentContainerClassName = cssClassName('payment-section-title-container ', className);
    let paymentTitleClassName = cssClassName('payment-section-title ', className);

    return (
      <div className={paymentContainerClassName}>
        <h2 className={paymentTitleClassName}>{title}</h2>
      </div>
    );
  }
}

export {PaymentMethodsTitleDisplay};
