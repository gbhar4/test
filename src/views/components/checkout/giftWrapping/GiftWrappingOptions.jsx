/** @module GiftWrappingOptions
 * @summary  Gift Wrapping options for the drop-down menu
 * @author Oliver
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';

class GiftWrappingOptions extends React.Component {
  static propTypes = {
    optionsMap: PropTypes.arrayOf(PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      shortDescription: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })).isRequired
  }

  getOptionsMap () {
    return this.props.optionsMap.map((entry) => ({
      value: entry.id,
      content: <GiftWrappingContent title={entry.displayName} price={entry.price} content={entry.shortDescription} />,
      title: <GiftWrappingTitle title={entry.displayName} price={entry.price} />
    }));
  }

  render () {
    let { optionsMap, ...otherProps } = this.props;     // eslint-disable-line no-unused-vars
    return (
      <CustomSelect showErrorIfUntouched {...otherProps} optionsMap={this.getOptionsMap()} />
    );
  }
}

function GiftWrappingTitle (props) {
  return (
    <p className="gift-wapping-details">
      <strong className="gift-wrapping-name">{props.title}</strong>
      <span className="gift-wrapping-price">{props.price === 0 ? 'FREE' : '$' + props.price.toFixed(2)}</span>
    </p>
  );
}

function GiftWrappingContent (props) {
  return (
    <div className="gift-wrapping-container">
      <GiftWrappingTitle title={props.title} price={props.price} />
      {props.content}
    </div>
  );
}

export {GiftWrappingOptions};
