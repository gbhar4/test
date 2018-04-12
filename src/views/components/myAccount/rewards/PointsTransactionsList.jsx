/** @module PointsTransactionsList
 * @summary Table with the history of point transactions for the user.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

class PointsTransactionsList extends React.Component {
  static propTypes = {
    /** array of points transactions for the current list page */
    pointsTransactionsList: PropTypes.arrayOf(PropTypes.shape({
      /** date of points transaction */
      date: PropTypes.string.isRequired,
      /** type of points transaction. */
      type: PropTypes.string.isRequired,
      /** number of points involved in the transaction */
      amount: PropTypes.number.isRequired
    }))
  }

  static defaultProps = {
    pointsTransactionsList: []
  }

  render () {
    let {pointsTransactionsList} = this.props;

    return (
      <div className="points-table-container">
        <table className="points-summary-list-table" >
          <thead>
            <tr className="points-summary-row-title">
              <th>Order Date</th>
              <th>Transaction</th>
              <th>Points Earned</th>
            </tr>
          </thead>
          <tbody>
          {pointsTransactionsList.map((transaction, index) =>
            <tr key={index} className="points-summary-item-container">
              <td>{transaction.date}</td>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }
}

export {PointsTransactionsList};
