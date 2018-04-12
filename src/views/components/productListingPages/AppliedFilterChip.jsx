/** @module AppliedFilterChip
 * Show a chip for an applied filter with a button to remove the filter.
 *
 * It will also render a received child component if there is one.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

export class AppliedFilterChip extends React.Component {
  static propTypes = {
    /** Id of the applied filter option. */
    id: PropTypes.string.isRequired,

    /** the containing form field name used to manipulate the filter that this chip corresponds to  */
    fieldName: PropTypes.string.isRequired,

    /** Name describing the applied filter option. */
    displayName: PropTypes.string.isRequired,

    /** Callback for clicks on the remove button. Accepts the id,fieldName of this chip. */
    onRemoveClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.handleRemoveClick = () => this.props.onRemoveClick(this.props.fieldName, this.props.id);
  }

  render () {
    let {displayName, children} = this.props;

    return (
      <div className="applied-filter-item">
        <button className="applied-filter-remove-button" onClick={this.handleRemoveClick}>Remove</button>
        {children}
        <span className="applied-filter-title">{displayName}</span>
      </div>
    );
  }
}
