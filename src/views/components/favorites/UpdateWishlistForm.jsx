/**
* @module Wishlist
* @summary
* @author Oliver Ramirez
* @link https://projects.invisionapp.com/share/C59C6U337#/screens/209377239
**/

import React from 'react';
import {PropTypes} from 'prop-types';
import {UpdateWishlistFormModal} from './UpdateWishlistFormModal.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.update-wishlist.scss');
} else {
  require('./_m.update-wishlist.scss');
}

class UpdateWishlistForm extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /** the id of the wishtlist to edit */
    id: PropTypes.string.isRequired,

    /** whether or not to enable delete wishlist functionality */
    enableDelete: PropTypes.bool.isRequired,

    /** whether or not to enable setting a wishlist as the default one */
    isSetAsDefaultDisabled: PropTypes.bool.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      isEditing: false
    };

    this.handleToggleEdit = this.handleToggleEdit.bind(this);
  }

  handleToggleEdit () {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  render () {
    let {id, isMobile, enableDelete, initialValues, isSetAsDefaultDisabled, onSubmit, onDelete} = this.props;
    let {isEditing} = this.state;

    return (
      <div className="setting-edit-section">
        <button type="button" onClick={this.handleToggleEdit}>Edit wishlist</button>
        {isEditing && <UpdateWishlistFormModal id={id} isMobile={isMobile} enableDelete={enableDelete} isSetAsDefaultDisabled={isSetAsDefaultDisabled} onSubmit={onSubmit} onDelete={onDelete} onClose={this.handleToggleEdit} initialValues={initialValues} />}
      </div>
    );
  }
}

export {UpdateWishlistForm};
