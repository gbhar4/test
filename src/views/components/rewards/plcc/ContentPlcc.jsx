/**
 * @module Plcc Rewards Content
 * @author Damián Rossi <drossi@minutentag.com>
 * Shows a benefiths for My Place Rewards0
 * @param   FooterNotes = shows terms on footer notes.
 */
import React from 'react';
import {FooterNotes} from './FooterNotes.jsx';
class ContentPlcc extends React.Component {
  render () {
    let {footerNotes} = this.props;
    return (
      <div>
      {!footerNotes
        ? <div className="buttons-container">
          <a>Help</a>
          <a>Customer Care</a>
          <a>Legal</a>
          <a>Reward Terms</a>
          <div className="buttons-container">
            <button className="button-manage-account">
            Manage credit account</button>
            <button className="button-apply">Apply today</button>
          </div>
        </div>
      : <div className="buttons-container">
        <a>Reward Terms</a>
        <a>Faq</a>
        <span>Need Assistance? Contact 555-555-55555 for help.</span>
        <FooterNotes footerNotes={footerNotes} />
      </div>
      }
      </div>
    );
  }
}

export {ContentPlcc};
