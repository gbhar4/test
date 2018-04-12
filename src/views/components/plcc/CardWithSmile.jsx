/** @module Card with smile
 * @summary Card img with face smile img
 *
 * @author Oliver Ramirez
 */

import React from 'react';

if (DESKTOP) { // eslint-disable-line
  require('./_d.card-with-smile.scss');
} else {
  require('./_m.card-with-smile.scss');
}

export class CardWithSmile extends React.Component {
  render () {
    return (
      <div className="card-with-smile-container">
        {/* <img src="/wcsstore/static/images/MPR-PointsBar-SmileyFace.png" alt="smile img" className="img-smile" />
        <img src="/wcsstore/static/images/place.png" alt="place card img" className="img-place" /> */}
        <img src="/wcsstore/static/images/card-smile.png" alt="Card with face smile" className="img-smile"/>
      </div>
    );
  }
}
