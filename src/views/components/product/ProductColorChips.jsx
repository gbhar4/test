/**
 * @module ProductColorChips
 *
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {COLOR_PROP_TYPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';

export class ProductColorChips extends React.Component {
  static propTypes = {
    /**
     * Callback for clicks on color chips. Accepts colorProductId, colorName.
     * Note that it is up to this callback to update the selectedColorId prop of this component.
     */
    onChipClick: PropTypes.func,
    /** the color name of the currently selected chip */
    selectedColorId: PropTypes.string.isRequired,
    /** map of available colors to render chips for */
    colorsMap: PropTypes.arrayOf(PropTypes.shape({
      color: COLOR_PROP_TYPE.isRequired,
      colorProductId: PropTypes.string.isRequired
    })).isRequired
  }

  static defaultProps = {
    maxVisibleItems: 5
  }

  constructor (props) {
    super();
    this.state = {
      firstItemIndex: 0,
      activeItem: 0
    };

    this.captureContainerRef = this.captureContainerRef.bind(this);

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
  }

  captureContainerRef (ref) {
    this.containerRef = ref;
  }

  handleNextClick () {
    let stepSize = this.props.maxVisibleItems;
    let nextStartIndex = this.state.firstItemIndex + 1;
    let maxViewableIndex = this.props.colorsMap.length - stepSize;
    let isEndBounded = nextStartIndex >= maxViewableIndex;
    let firstItemIndex = isEndBounded ? maxViewableIndex : nextStartIndex;
    this.setState({firstItemIndex: firstItemIndex});
  }

  handlePreviousClick () {
    let nextStartIndex = this.state.firstItemIndex - 1;
    let maxViewableIndex = 0;
    let isEndBounded = nextStartIndex <= maxViewableIndex;
    let firstItemIndex = isEndBounded ? maxViewableIndex : nextStartIndex;
    this.setState({firstItemIndex: firstItemIndex});
  }

  getColors () {
    let {colorsMap, maxVisibleItems} = this.props;
    let stepSize = maxVisibleItems;
    let firstItemIndex = this.state.firstItemIndex;
    if (firstItemIndex + stepSize < colorsMap.length) {
      return colorsMap.slice(firstItemIndex, firstItemIndex + stepSize);
    } else {
      let sliceIni = colorsMap.length - stepSize;
      return colorsMap.slice(sliceIni > 0 ? sliceIni : 0, colorsMap.length);
    }
  }

  render () {
    let {onChipClick, selectedColorId, colorsMap} = this.props;
    let isDisplayPrevious = colorsMap.length > 6 && this.state.firstItemIndex !== 0;
    let isDisplayNext = colorsMap.length > 6 && this.state.firstItemIndex + 6 < colorsMap.length;

    if (colorsMap.length <= 1) {
      return null;
    }

    return (<div className="color-chips-container">
      {isDisplayPrevious && <button className="button-prev" title="Previous" onClick={this.handlePreviousClick}></button>}

      <ol className="content-colors" ref={this.captureContainerRef}>
        {this.getColors().map((colorEntry) => <ProductColorChip key={colorEntry.colorProductId} colorEntry={colorEntry} isActive={selectedColorId === colorEntry.color.name} onChipClick={onChipClick} />)}
      </ol>

      {isDisplayNext && <button className="button-next" title="Next" onClick={this.handleNextClick}></button>}
    </div>);
  }
}

class ProductColorChip extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.handleClick = () => !this.props.isActive && this.props.onChipClick(this.props.colorEntry.colorProductId, this.props.colorEntry.color.name);
  }

  render () {
    let {colorEntry: { color: { name, imagePath } }, isActive} = this.props;

    return (<button type="button" onClick={this.handleClick} className={isActive ? 'active' : null}>
      <img className="product-color-chip-image" src={imagePath} alt={name} />
    </button>);
  }
}
