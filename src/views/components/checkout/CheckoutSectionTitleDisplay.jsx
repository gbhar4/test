/**
* @module CheckoutSectionTitleDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Small component that displays checkout titles
*
* Style (ClassName) Elements description/enumeration
*  checkout-section-title
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

class CheckoutSectionTitleDisplay extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    note: PropTypes.string
  }

  render () {
    let {title, className, note} = this.props;
    let summaryTitleClassName = cssClassName('checkout-section-title ', className);
    let noteClassName = cssClassName('checkout-section-note ', className);

    return (
      <div className={summaryTitleClassName}>
        <h3>{title}</h3>
        {note ? <p className={noteClassName}>{note}</p> : null}
      </div>
    );
  }
}

export {CheckoutSectionTitleDisplay};
