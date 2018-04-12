/** @module Social Media Links
 * @summary Small component of social media icons.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

class SocialMediaLinks extends React.Component {
  static propTypes = {
    isFbEnabled: PropTypes.bool,

    isPtEnabled: PropTypes.bool,

    isInEnabled: PropTypes.bool,

    isTwEnabled: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context);

    this.handleTwShare = this.handleTwShare.bind(this);
    this.handlePtShare = this.handlePtShare.bind(this);
    this.handleFbShare = this.handleFbShare.bind(this);
    this.handleInShare = this.handleInShare.bind(this);
  }

  handleTwShare () {
    let shareUrl = window.location.href;
    let url = '//twitter.com/share?text=&url=' + encodeURIComponent(shareUrl) + '&hashtags=';

    window.open(url);
  }

  handlePtShare () {
    let shareUrl = window.location.href;
    let url = 'http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(shareUrl);

    window.open(url);
  }

  handleFbShare () {
    let shareUrl = window.location.href;
    let url = 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(shareUrl);

    window.open(url);
  }

  handleInShare () {

  }

  render () {
    let {isFbEnabled, isPtEnabled, isInEnabled, isTwEnabled, className} = this.props;
    let linksClassName = cssClassName('social-networks ', className);

    return (
      <div className={linksClassName}>
        {isTwEnabled && <a href="https://twitter.com/childrensplace" onClick={this.handleTwShare} className="icon-twitter" target="_blank" title="Twitter">Twitter</a>}
        {isFbEnabled && <a href="https://www.facebook.com/childrensplace" onClick={this.handleFbShare} className="icon-fcbk" target="_blank" title="Facebook">Facebook</a>}
        {isPtEnabled && <a href="http://www.pinterest.com/childrensplace" onClick={this.handlePtShare} className="icon-pinterest" target="_blank" title="Pinterest">Pinterest</a>}
        {isInEnabled && <a href="http://instagram.com/childrensplace" onClick={this.handleInShare} className="icon-instagram" target="_blank" title="Instagram">Instagram</a>}
      </div>
    );
  }
}

export {SocialMediaLinks};
