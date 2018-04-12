/**
 * @module UnusedChildBirthday
 * Shows a child birthday slot which is available for use (for adding a new
 * child birthday for the user) in My Account Profile Information Birthday
 * Savings.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {isClient} from 'routing/routingHelper';

class UnusedChildBirthday extends React.Component {
  static propTypes = {
    isAdding: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    isMobile: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.handleAddChild = this.handleAddChild.bind(this);
  }

  handleAddChild () {
    this.props.onAdd();

    if (isClient()) {
      setTimeout(() => {
        let addFormRef = document.querySelector('.birthday-add-new-container');
        let fixedFormPosition = addFormRef.offsetTop - 90; // considered header height
        window.scrollTo(0, fixedFormPosition);
      }, 1);
    }
  }

  render () {
    let {isAdding, enabled, isMobile, onAdd} = this.props;
    let liClassName = cssClassName('birthday birthday-unused-item ', {
      'birthday-unused-item-enabled ': enabled,
      'birthday-unused-item-adding ': isAdding
    });
    return (
      <li className={liClassName}>
        <button className="button-add-new-child button-primary" disabled={!enabled}
          onClick={isMobile ? this.handleAddChild : onAdd}>+ Add a child</button>
      </li>
    );
  }
}

export {UnusedChildBirthday};
