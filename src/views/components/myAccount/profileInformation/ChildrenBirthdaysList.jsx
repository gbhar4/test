/**
 * @module ChildrenBirthdaysList
 * Shows the list of children birthdays registered in the user's account in
 * My Account Profile Information.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ChildBirthday} from './ChildBirthday.jsx';
import {UnusedChildBirthday} from './UnusedChildBirthday.jsx';

class ChildrenBirthdaysList extends React.Component {
  static propTypes = {
    childrenBirthdays: PropTypes.arrayOf(ChildBirthday.propTypes.childBirthday),
    isReadOnly: PropTypes.bool.isRequired,
    isAddingChild: PropTypes.bool,
    deletingChildId: PropTypes.string,
    maxNumberOfChildren: PropTypes.number,
    onAddChildBirthday: PropTypes.func,
    onDeleteChildBirthday: PropTypes.func,
    isMobile: PropTypes.bool
  }

  static defaultProps = {
    maxNumberOfChildren: 4,
    isAddingChild: false
  }

  render () {
    let {childrenBirthdays, isReadOnly, isAddingChild, deletingChildId,
      maxNumberOfChildren, onAddChildBirthday, onDeleteChildBirthday, isMobile} = this.props;
    let unusedNumber = maxNumberOfChildren - childrenBirthdays.length;
    let unusedList = Array(unusedNumber).fill(0).map((e, index) => index);

    return (
      <div className="birthdays birthdays-list-container">
        <ul className="birthdays-container">
          {childrenBirthdays.map((childBirthday) => (
            <ChildBirthday key={childBirthday.childId}
              childBirthday={childBirthday}
              isShowDeleteButton={!isReadOnly}
              isPendingDelete={childBirthday.id === deletingChildId}
              onDelete={onDeleteChildBirthday} />
          ))}

          {!isReadOnly &&
            unusedList.map((unusedChildBirthdayIndex) => (
              <UnusedChildBirthday isMobile={isMobile} key={unusedChildBirthdayIndex}
                isAdding={isAddingChild && unusedChildBirthdayIndex === 0}
                enabled={unusedChildBirthdayIndex === 0}
                onAdd={onAddChildBirthday} />
          ))}
        </ul>
      </div>
    );
  }
}

export {ChildrenBirthdaysList};
