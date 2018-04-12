/**
 * @module ProductListingToolbarComponents
 *
 * @author Florencia <facosta@minutentag.com>
 * @author Ben
 */

import React from 'react'; // eslint-disable-line no-unused-vars
import cssClassName from 'util/viewUtil/cssClassName.js';
import {Field} from 'redux-form';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import {AppliedFilterChip} from 'views/components/productListingPages/AppliedFilterChip.jsx';
import {sanitizeEntity} from 'service/apiUtil.js';
import {LabeledRadioButtonGroup} from 'views/components/common/form/LabeledRadioButtonGroup.jsx';

export const TOOLBAR_FIELD_NAMES = {
  colors: 'colors',
  sizes: 'sizes',
  departments: 'departments',
  subDepartments: 'subDepartments',
  sort: 'sort'
};

export function SearchByKeywords (props) {
  let {currentSearchTerm} = props;
  return (<div className="search-by-keywords-container">
    <p className="search-by-keywords-content">You searched for <strong className="current-search">{'"' + sanitizeEntity(currentSearchTerm) + '"'}</strong></p>
  </div>);
}

export function ProductListingCount (props) {
  let {isMobile, currentSearchTerm, totalProductsCount, isShowAllEnabled} = props;
  let classNameContainer = cssClassName('items-count-container ', {'from-navigation-bar ': !currentSearchTerm, 'with-button': isShowAllEnabled});

  return (
    <div className={classNameContainer}>
      <span className="items-count-content">{!isMobile && 'Showing'} <span className="items-count-content-number">{totalProductsCount}</span> {totalProductsCount === 1 ? 'Item' : 'Items'}</span>
      {isShowAllEnabled && <button className="show-all-button">Show All Items</button>}
    </div>
  );
}

export function ToggleFilterButton (props) {
  let { appliedFiltersCount, isOpenFilterSection, disabled } = props;
  let filterButtonText = (appliedFiltersCount > 0) ? `Filter (${appliedFiltersCount})` : 'Filter';
  let classNames = cssClassName(
    'toggle-filter-button-container ',
    {'open-filter-section ': isOpenFilterSection}
  );

  return (
    <div className={classNames}>
      {isOpenFilterSection
        ? <button type="submit" className="send-information-button" disabled={disabled}>DONE</button>
        : <button type="button" className="open-filter-button" onClick={props.onToggleFilter}>{filterButtonText}</button>}
    </div>
  );
}

/**
 * DT-33014
 * Button functions differently for AB test
 */
export function NewToggleFilterButton(props) {
  let { appliedFiltersCount, isOpenFilterSection } = props;
  let filterButtonText = (appliedFiltersCount > 0) ? `Filter (${appliedFiltersCount})` : 'Filter';
  let classNames = cssClassName(
    'open-filter-button ',
    isOpenFilterSection && 'open-filter-button-expanded'
  );

  return (
    <div className="toggle-filter-button-container">
      <button type="button" className={classNames} onClick={props.onToggleFilter}>{filterButtonText}</button>
    </div>
  );
}

export function SortSelector (props) {
  let {isMobile, onChange, sortSelectOptions, selectTextOverride, onExpandCallback} = props;
  let className = cssClassName(
    isMobile ? 'sorter-filter-chips' : 'sorter-filter'
  );

  return (
      <Field name={TOOLBAR_FIELD_NAMES.sort} component={CustomSelect} optionsMap={sortSelectOptions} title={isMobile ? 'Sort' : 'Sort By: '}
        placeholder="Sort" allowMultipleSelections={false} className={className} onChange={onChange} onExpandCallback={onExpandCallback}
        expanded={isMobile} disableExpandStateChanges={isMobile} selectTextOverride={selectTextOverride} />
  );
}

export function DepartmentFilter (props) {
  let {isMobile, onChange, optionsMap} = props;
  let className = cssClassName(
    isMobile ? 'department-detail-chips' : 'department-detail'
  );

  return (
      <Field name={TOOLBAR_FIELD_NAMES.departments} component={LabeledRadioButtonGroup} optionsMap={optionsMap}
        className={className} onChange={onChange} format={formatDepartmentFilter} parse={parseDepartmentFilter}
        isShowSelectedValueInLabel={false} />
  );
}

export function AppliedFiltersList (props) {
  let {isMobile, appliedFilters: {sizes, colors, departments, subDepartments}, onRemoveFilter} = props;
  return (
    <div className="applied-filters-sorting-container">
      {!isMobile && <span className="filtering-title">Filtering By:</span>}

      <ul className="applied-filter-list">
        {departments && departments.map((department) => (
          <AppliedFilterChip id={department.id} key={department.id} fieldName={TOOLBAR_FIELD_NAMES.departments}
            displayName={department.displayName} onRemoveClick={onRemoveFilter} />
        ))}

        {subDepartments && subDepartments.map((subDepartment) => (
          <AppliedFilterChip id={subDepartment.id} key={subDepartment.id} fieldName={TOOLBAR_FIELD_NAMES.subDepartments}
            displayName={subDepartment.displayName} onRemoveClick={onRemoveFilter} />
        ))}

        {sizes && sizes.map((size) => (
          <AppliedFilterChip id={size.id} key={size.id} fieldName={TOOLBAR_FIELD_NAMES.sizes}
            displayName={size.displayName} onRemoveClick={onRemoveFilter} />
        ))}

        {colors && colors.map((color) => (
          <AppliedFilterChip id={color.id} key={color.id} fieldName={TOOLBAR_FIELD_NAMES.colors}
            displayName={color.displayName} onRemoveClick={onRemoveFilter}>
            <img className="applied-filter-color-chip" src={color.imagePath} alt={color.displayName} />
          </AppliedFilterChip>
        ))}
      </ul>
    </div>
  );
}

// department filters are stored in the redux store as arrays of id's (for future support of multiple selections)
// However, currently only one departmentId is supported by BE, so we have to translate from an array to a single string here
function formatDepartmentFilter (departmentFilterIdsArray) {
  return departmentFilterIdsArray.length > 0 ? departmentFilterIdsArray[0] : '';
}
// Here we translate back from a single value to an array
function parseDepartmentFilter (departmentFilterId) {
  return departmentFilterId ? [departmentFilterId] : [];
}
