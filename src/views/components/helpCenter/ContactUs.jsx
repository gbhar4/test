/**
* @module ContactUs
* @summary
* @author Oliver Ramirez
**/

import React from 'react';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages';

if (DESKTOP) { // eslint-disable-line
  require('./_d.contact-us.scss');
} else {
  require('./_m.contact-us.scss');
}

export class ContactUs extends React.Component {
  render () {
    let {className} = this.props;

    return (
      <section className="container-contact">
        <div className={className}>
          <h1 className="title-contact">Contact Us</h1>

          <div className="email-container">
            <span className="email-icon">Email</span>
            <p className="email-message-contact">
              Need help?
              <br />
              <HyperLink destination={PAGES.helpCenter} pathSuffix="contact-us" className="email-link">Email</HyperLink> us anytime.
            </p>
          </div>
        </div>
      </section>
    );
  }
}
