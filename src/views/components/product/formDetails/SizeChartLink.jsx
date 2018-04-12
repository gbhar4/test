/** @module SizeChartLink
 * @summary renders a button for opening a modal showing the clothes sizes chart.
 *
 *  Note that this component is also responsible for maintaining the state needed to handle closing the modal.
 *
 * @author Ben
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlotListModal} from 'views/components/common/contentSlot/ContentSlotListModal.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.size-chart-form.scss');
} else {
  require('./_m.size-chart-form.scss');
}

export class SizeChartLink extends React.Component {
  static propTypes = {
    /** the text to show for this cta. Defaults to 'Size Chart' */
    buttonText: PropTypes.string
  }

  static defaultProps = {
    buttonText: 'Size Chart'
  };

  constructor (props) {
    super(props);
    this.state = {isSizeChartModalOpen: false};

    this.handleToggleSizeChart = () => this.setState({isSizeChartModalOpen: !this.state.isSizeChartModalOpen});
  }

  render () {
    let {buttonText} = this.props;

    return (
      <section className="size-chart-form-container">
        <button type="button" className="button-size-chart" onClick={this.handleToggleSizeChart}>{buttonText}</button>
        {this.state.isSizeChartModalOpen && <ContentSlotListModal contentSlots={[{contentSlotName: 'pdp_size_chart'}]}
          contentLabel="Size chart modal" overlayClassName="overlay-center overlay-size-chart"
          onRequestClose={this.handleToggleSizeChart} />}
      </section>
    );
  }
}
