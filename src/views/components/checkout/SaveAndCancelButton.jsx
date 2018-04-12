/** @module SaveAndCancelButton
 * @summary Component that contain one form with save and cancel button.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.save-and-cancel-buttons.scss');
} else {  // eslint-disable-line
  require('./_m.save-and-cancel-buttons.scss');
}

export class SaveAndCancelButton extends React.Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  renderForm () {
    let {onSubmit, onCancel} = this.props;

    return (
      <form onSubmit={onSubmit} className="checkout-button-container">
        <button type="submit" aria-label="save" className="button-save-address">Save</button>
        <button type="button" aria-label="cancel" className="button-cancel-address" onClick={onCancel}>Cancel</button>
      </form>
    );
  }

  renderContainer () {
    let {onCancel} = this.props;

    return (
      <div className="checkout-button-container">
        <button type="submit" aria-label="save" className="button-save-address">Save</button>
        <button type="button" aria-label="cancel" className="button-cancel-address" onClick={onCancel}>Cancel</button>
      </div>
    );
  }

  render () {
    return (
      this.props.isDisabledForm
        ? this.renderContainer()
        : this.renderForm()
    );
  }
}
