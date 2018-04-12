/**
Component description: Social Networks (list)

Usage:
var SocialNetworks = require("./SocialNetworks.jsx");

<SocialNetworks />

Component Props description/enumaration:
	[please complete]

Style (ClassName) Elements description/enumeration
	[please complete]

     Uses:
	N/A
*/

import React from 'react';

if (DESKTOP) { // eslint-disable-line
  require('./_d.social-networks.scss');
}

class SocialNetworks extends React.Component {
  render () {
    /* FIXME: hardcoded urls for social */
    return (
      <div className="social-networks">
        <h3 className="title-social-networks">Connect With Us</h3>
        <a href="https://twitter.com/childrensplace" className="icon-twitter" target="_blank" title="Twitter"></a>
        <a href="http://www.pinterest.com/childrensplace" className="icon-pinterest" target="_blank" title="Pinterest"></a>
        <a href="https://www.facebook.com/childrensplace" target="_blank" className="icon-fcbk" title="Facebook"></a>
        <a href="http://instagram.com/childrensplace" className="icon-instagram" target="_blank" title="Instagram"></a>
      </div>
		);
  }
}

export {SocialNetworks};
