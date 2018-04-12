import React from 'react';
import {PropTypes} from 'prop-types';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

export class HomeButton extends React.Component {

  static propTypes = {
    menuActive: PropTypes.bool
  }

  render () {
    let {menuActive} = this.props;

    return (
      <HyperLink destination={PAGES.homePage} className="logo-container logo">
        {menuActive
          ? <span className="title-home-link">Home</span>
          : <img src="/wcsstore/static/images/TCP-Logo.svg" alt="The Children's Place"
            srcSet="/wcsstore/static/images/TCP-Logo-1x.png 1x, /wcsstore/static/images/TCP-Logo-2x.png 2x, /wcsstore/static/images/TCP-Logo-3x.png 3x" />
        }
      </HyperLink>
    );
  }
}
