/**
 * @module DeleteChildBirthdayConfirmation
 * Asks confirmation to the user before deleting a child birthday in My Account
 * Profile Information.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('views/components/myAccount/profileInformation/birthday/_d.birthday-savings.scss');
} else {
  require('views/components/myAccount/profileInformation/birthday/_m.birthday-savings.scss');
}

class DeleteChildBirthdayConfirmation extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    childBirthday: PropTypes.shape({
      childId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }),
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleConfirm () {
    let {onConfirm, childBirthday} = this.props;
    onConfirm(childBirthday);
  }

  render () {
    let {isMobile, childBirthday: {name}, onCancel} = this.props;
    let containerModalClass = cssClassName('react-overlay ', 'overlay-center ', 'message-deleted-birthday');

    return (
      isMobile
        ? <Modal contentLabel="Authentication Modal" className="overlay-container" overlayClassName={containerModalClass} isOpen>
          <ModalHeaderDisplayContainer title="Remove birthday" subtitle={`Are you sure you want to remove ${name} from the Birthday Savings List?`} onCloseClick={onCancel} />

          <button className="button-cancel-process" type="button" onClick={onCancel}>No</button>
          <button className="button-remove" type="button" onClick={this.handleConfirm}>Yes, remove</button>
        </Modal>

        : <div className="message-deleted-birthday">
          <p className="subheading-deleted-birthday">Are you sure you want to remove {name} from the Birthday Savings List?</p>
          <button className="button-cancel-process" type="button" onClick={onCancel}>No</button>
          <button className="button-remove" type="button" onClick={this.handleConfirm}>Yes, remove</button>
        </div>
    );
  }
}

export {DeleteChildBirthdayConfirmation};
