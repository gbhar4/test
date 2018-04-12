import React from 'react';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.rewards-overlay.scss');
} else {
  require('./_m.rewards-overlay.scss');
}

export class Rewards extends React.Component {
  render () {
    let espotContent = '<img src="/wcsstore/static/images/fpo-rewards-6.png" alt="FPO rewards" style="display: block; max-width: 100%; height: auto;" />';
    let { isMobile, isOpen } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal contentLabel="My Place Rewards Modal" className="react-overlay" overlayClassName={'rewards ' + !isMobile ? 'overlay-center' : ''} isOpen>
        <div className="overlay-container overlay-rewards-container">
          <ModalHeaderDisplayContainer />
          <ContentSlot contentSlotName="banner" className="banner" htmlContentTest={espotContent} />
        </div>
      </Modal>
    );
  }
}
