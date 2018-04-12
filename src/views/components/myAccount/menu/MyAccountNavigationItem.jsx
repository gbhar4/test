/** @module MyAccountNavigationItem
 * @summary Navigation menu of My Account.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

class MyAccountNavigationItem extends React.Component {
  static propTypes = {
    /** Wheter is mobile. */
    isMobile: PropTypes.bool,

    /** Flags if this item is the root Hyperlink of the page */
    isRoot: PropTypes.bool,

    /* This is the Section Object to be passed to HyperLink*/
    menuItem: PropTypes.object.isRequired
  }
  render () {
    let {isMobile, menuItem, isRoot, onClick} = this.props;
    let itemClassName = cssClassName('navigation-item-link',
      {' navigation-item-link-mobile': isMobile === true}
    );

    return (
      <li className="my-account-navigation-item">
        <HyperLink
          destination={menuItem}
          className={itemClassName}
          activeClassName={'navigation-item-link-selected'}
          useActiveClassNameOnlyForRoot={isRoot}
          onClick={onClick}>
          {menuItem.displayName}
        </HyperLink>
      </li>
    );
  }
}

export {MyAccountNavigationItem};
