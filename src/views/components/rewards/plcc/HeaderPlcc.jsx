/**
 * @module Plcc Rewards Header
 * @author Damián Rossi <drossi@minutentag.com>
 * Shows a the header for Plcc content
 * @param FooterNotes = shows terms on footer notes.
 * @todo Replace the json content for one focused content instead array of objects.
 */
import React from 'react';

class HeaderPlcc extends React.Component {
  render () {
    let espotContent = 'mpr-empty-bag-mobile.jpg';
    let {isMobile, footerNotes} = this.props;

    return (
      <div className="plcc-content"> {(isMobile) && <content>
        <h3>My Place Rewards Members</h3>
        <p className="subtitle-plcc">An online account is required to track points and earn rewards!</p>
      </content>}
        {(!footerNotes && !isMobile)
          ? <content>
            <img src={'/wcsstore/static/images/' + espotContent} alt="FPO rewards" className="plcc-modal-rewards" />
          </content>
          : <content>
            <h3>My Place Rewards Members</h3>
            <h4 className="header-subtitle-plcc">Duble your Points With the My Place Rewards Credit Card!</h4>
            <img src={'/wcsstore/static/images/fpo-plcc-myPlaceRewards.jpg'} alt="FPO rewards" className="plcc-modal-rewards" />
            <div className="buttons-container">
              <button className="button-manage-account">
              Learn More</button>
              <button className="button-apply">Apply today</button>
            </div>
            <img src={'/wcsstore/static/images/plcc-banner-2.png'} alt="FPO rewards" className="plcc-modal-rewards" />
          </content>}
      </div>
    );
  }
}
export {HeaderPlcc};
