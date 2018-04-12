/**
 * @module StoreOpenHours
 * Shows a callapsible list of hours in which a store is opened, day by day.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

 /*
 "Regular" Hours should read:

 SATURDAY, May 13
 10:00 am - 7:00 pm
 ----
 SATURDAY, May 13
 Closed

 */

import React from 'react';
import {PropTypes} from 'prop-types';
import formatTime from 'util/formatTime.js';
import {isDayOfWeek} from 'util/parseDate.js';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {REGULAR_HOURS_PROP_TYPE} from 'views/components/common/propTypes/storesPropTypes';
import {parseDate, COMPLETE_MONTH} from 'util/parseDate';

if (DESKTOP) { // eslint-disable-line
  require('./_d.store-open-hours.scss');
} else {
  require('./_m.store-open-hours.scss');
}

class StoreOpenHours extends React.Component {
  static propTypes = {
    /** Flags if the list of hours should be expanded on first render */
    isInitiallyExpanded: PropTypes.bool.isRequired,
    /** Title for the list of open hours */
    title: PropTypes.string.isRequired,
    /**
     * Array of opening and closing hours in which the store is open, day by day.
     */
    openHours: REGULAR_HOURS_PROP_TYPE.isRequired,

    /** className fot the component container div */
    sectionClassName: PropTypes.string.isRequired,
    /** flags whether to show a button for expanding and collapsing the hour list */
    isSelfExpandable: PropTypes.bool,

    /** store details page needs some additional information about the date, so flagging it */
    isShowDetailedDate: PropTypes.bool
  }

  constructor (props) {
    super(props);
    this.state = {isExpanded: props.isInitiallyExpanded};
    this.handleTitleClick = this.handleTitleClick.bind(this);
  }

  handleTitleClick () {
    if (this.props.isSelfExpandable) {
      this.setState((prevState) => ({
        isExpanded: !prevState.isExpanded
      }));
    }
  }

  render () {
    let { openHours, title, sectionClassName, isSelfExpandable, isExpandedDetails, isCardItem, isMobile, isShowDetailedDate } = this.props;
    let {isExpanded} = this.state;
    isExpanded = (isMobile ? isExpandedDetails : isExpanded);
    let sectionClassContent = cssClassName('store-day-and-time ', {'from-store-item': isCardItem});
    let titleCssClass = cssClassName('store-schedule-title ', {'expanded': isExpanded, ' not-expandable': !isSelfExpandable});

    return (
      <div className={sectionClassName}>
        <h4 className={titleCssClass} onClick={this.handleTitleClick}>{title}</h4>
        {isExpanded &&
          <ul className={sectionClassContent}>
            {openHours.map((dayHours) => {
              let dayName = dayHours.dayName && dayHours.dayName.toLowerCase();
              let fromDate = parseDate(dayHours.openIntervals[0].fromHour);

              return (
                <li key={dayHours.dayName} className="day-and-time-item-container">
                  <div className="day-and-date-container">
                    <span className="day-name-container">{dayName}</span>
                    {isShowDetailedDate && <span className="hours-date hours-date-container">, {((COMPLETE_MONTH[fromDate.getMonth()] || '').toLowerCase() || '') + ' ' + fromDate.getDate()}</span>}
                  </div>
                  {!dayHours.isClosed
                    ? <span className="hoursRange hours-range-container">{dayHours.openIntervals.map((interval, idx) => {
                        return [(idx || null) && <br />, formatTime(interval.fromHour) + ' - ' + formatTime(interval.toHour)];
                      })}</span>
                    : <span className="closed-notification closed">CLOSED</span>}
                </li>
              );
            })}
          </ul>
        }
      </div>
    );
  }
}

export {StoreOpenHours};
