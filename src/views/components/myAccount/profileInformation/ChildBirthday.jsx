/**
 * @module ChildBirthday
 * Shows one child birthday in the list of children birthdays registered in the
 * user's account in My Account Profile Information.
 * If it's not in read-only mode, it will show a button to delete the birthday.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {MONTH_OPTIONS_MAP} from './Constants';

class ChildBirthday extends React.Component {
  static propTypes = {
    childBirthday: PropTypes.shape({
      childId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      birthMonth: PropTypes.string.isRequired,
      birthYear: PropTypes.string.isRequired
    }),
    isShowDeleteButton: PropTypes.bool.isRequired,
    isPendingDelete: PropTypes.bool.isRequired,
    onDelete: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete () {
    let {onDelete, childBirthday} = this.props;
    onDelete(childBirthday);
  }

  render () {
    let {childBirthday: {name, birthMonth, birthYear},
      isShowDeleteButton,
      isPendingDelete} = this.props;
    let liClassName = cssClassName('birthday birthday-item ', {'birthday-item-delete': isPendingDelete});
    let birthMonthName = MONTH_OPTIONS_MAP.find((month) => month.id === birthMonth).displayName;

    return (
      <li className={liClassName}>
        <span className="child-name">{name}</span>
        {isShowDeleteButton && <button type="button" className="button-delete" onClick={this.handleDelete}></button>}
        <span className="birthday-date">Birthday: {birthMonthName} {birthYear}</span>
      </li>
    );
  }
}

export {ChildBirthday};
