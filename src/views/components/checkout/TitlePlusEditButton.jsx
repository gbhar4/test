/** @module TitlePlusEditButton
 * @summary A component that displays a title plus an optional edit button.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-summary-title.scss');
} else {
  require('./_m.checkout-summary-title.scss');
}

export class TitlePlusEditButton extends React.Component {
  static propTypes = {
    /** the title text to display */
    title: PropTypes.string.isRequired,
    /** the css class name to add (on top of 'checkout-summary-title')
     * to the containing div.
     */
    className: PropTypes.string,
    /** callback for clicks on the edit button; if falsy, the edit button is not displayed */
    onEdit: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.handleClick = (event) => this.props.onEdit && this.props.onEdit(event);
  }

  render () {
    let {title, className, onEdit} = this.props;

    return (
      <div className={cssClassName('checkout-summary-title ', className)}>
        <h3>{title}</h3>
        {!!onEdit && <button type="button"
          className={cssClassName('checkout-summary-edit ', className)} onClick={this.handleClick} aria-label={`Edit ${title}`}>Edit</button>
        }
      </div>
    );
  }
}
