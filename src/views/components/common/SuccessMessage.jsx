/**
 * @module SuccessMessage
 * Component to be used everywhere we need to show success messages, specially
 * when we need to do this in a view different than, or decoupled from, the one
 * that originated the operation which succeeded. An example of this would be
 * the need to show a success message in the header of a list after the
 * successful submission of a form.
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';

export class SuccessMessage extends React.Component {
  static propTypes = {
    /** success message to show */
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** additional class for the message element */
    className: PropTypes.string
  }

  render () {
    let {className, message} = this.props;
    let messageClassName = cssClassName('success-box ', className);
    return (<p className={messageClassName}>
      <span className="success-icon">Success</span>
      <span className="success-text">{message}</span>
    </p>);
  }
}
