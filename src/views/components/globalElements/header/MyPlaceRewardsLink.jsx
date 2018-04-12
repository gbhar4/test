/**
 * @module MyPlaceRewardsLink
 * @author Oliver Ramírez
 * @author Miguel Alvarez Igarzábal
 * Shows the link for MPR to guest users, and a popup with an eSpot on hover.
 * Shows nothing to registered users.
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {isTouchClient} from 'routing/routingHelper';

if (DESKTOP) { // eslint-disable-line
  require('./_d.my-place-rewards-link.scss');
}

export class MyPlaceRewardsLink extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool,
    isMobile: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.state = {
      isOpen: !!props.isOpen
    };

    this.handleToggleDetails = this.handleToggleDetails.bind(this);
  }

  handleToggleDetails () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {
    let {isGuest, isMobile} = this.props;
    let {isOpen} = this.state;
    let contentSlot = <ContentSlot contentSlotName="global_header_plcc_more_info_modal" className="create-account-banner" />;
    let containerClassName = cssClassName('my-place-rewards ', {
      'active ': isOpen,
      'touch': isTouchClient()
    });
    let ariaText = 'My Place Rewards. ' + (isOpen ? 'Closes' : 'Opens') + ' a dialog.';

    if (!isGuest && !isMobile) {
      return null;
    }

    return (
      <div className={containerClassName}>
        <button className="my-place-rewards-link" aria-label={ariaText} onClick={this.handleToggleDetails}>My Place Rewards</button>
        {(isMobile
          ? isOpen && <Modal aria-label="region" contentLabel="create-account-banner" className="overlay-container" isOpen
              overlayClassName="rewards-expanded-overlay react-overlay overlay-center">
            <ModalHeaderDisplayContainer onCloseClick={this.handleToggleDetails} />
            {contentSlot}
          </Modal>

          : (!isTouchClient() || isOpen) && <div className="rewards-expanded">{contentSlot}</div>
        )}
      </div>
    );
  }
}
