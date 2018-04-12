/**
* @module Wishlist Favorite List
* @summary
* @author Oliver Ramirez
* @author Florencia Acosta <facosta@minutentag.com>
**/

import React from 'react';
import {PropTypes} from 'prop-types';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import {SHARE_OPTIONS} from 'views/components/favorites/ShareModals.jsx';
import {ShareModalsContainer} from 'views/components/favorites/ShareModalsContainer.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.share-list.scss');
} else {
  require('./_m.share-list.scss');
}

export class FavoritesWishlistShare extends React.Component {
  static propTypes = {
    /** the link to share */
    shareableLink: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      selectedShareOption: ''
    };

    this.handleSelectShareOption = this.handleSelectShareOption.bind(this);
    this.handleCloseModals = this.handleCloseModals.bind(this);
  }

  handleSelectShareOption (shareOptionId) {
    this.setState({
      selectedShareOption: shareOptionId
    });
  }

  handleCloseModals () {
    this.setState({
      selectedShareOption: ''
    });
  }

  getOptionsMapShare (list) {
    let optionsMap = [/*
    FIXME: something is doing preventDefault, it shouldn't as it makes the <a> not to fire
    {
      value: SHARE_OPTIONS.FACEBOOK,
      title: 'Facebook',
      content: <a href={'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(shareableLink)} target="_blank">Facebook</a>,
      disabled: false
    }, */
      {
        value: SHARE_OPTIONS.FACEBOOK,
        title: 'Facebook',
        content: <span>Facebook</span>,
        disabled: false
      }, {
        value: SHARE_OPTIONS.EMAIL,
        title: 'Email',
        content: <span>Email</span>,
        disabled: false
      }, {
        value: SHARE_OPTIONS.LINK,
        title: 'Copy Link',
        content: <span>Copy Link</span>,
        disabled: false
      }
    ];

    return optionsMap;
  }

  getNameListDefault () {
    let placeholderList = this.getOptionsMapList();
    placeholderList = placeholderList[1].title;

    return placeholderList;
  }

  render () {
    let {shareableLink} = this.props;
    let {selectedShareOption} = this.state;
    let shareDropdownOptionMap = this.getOptionsMapShare();

    return (
      <div className="dropdown-share-options">
        <CustomSelect name="shareDropdown" className="share-list" optionsMap={shareDropdownOptionMap} placeholder="Share" input={{value: selectedShareOption, onChange: this.handleSelectShareOption}} />
        {selectedShareOption && <ShareModalsContainer optionShared={selectedShareOption} link={shareableLink} onClose={this.handleCloseModals} />}
      </div>
    );
  }
}
