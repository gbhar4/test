/**
 * @module Spotlights
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {requireUrlScript} from 'util/resourceLoader';

export class Spotlights extends React.PureComponent {
  static propTypes = {
    categoryId: PropTypes.string.isRequired
  };

  constructor (props, context) {
    super(props, context);

    this.captureContainerRef = this.captureContainerRef.bind(this);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount () {
    return requireUrlScript(this.props.spotlightUrl).then(() => {
      this.setState({
        isLoading: false
      });
    });
  }

  captureContainerRef (ref) {
    this.containerRef = ref;

    if (window.BV) {
      window.BV.Spotlights.render({
        contentType: 'spotlights',
        subjectId: 'SL-' + this.props.categoryId
      });
    }
  }

  render () {
    if (this.state.isLoading) return null;
    return (<div id="BVSpotlightsContainer" ref={this.captureContainerRef}></div>);
  }
}
