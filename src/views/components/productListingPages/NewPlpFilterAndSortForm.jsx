/**
 * @module NewPlpFilterAndSortForm
 *
 * @author Gabriel Gomez
 * @author Miguel Alvarez Igarzábal
 * @author Florencia Acosta
 *
 * DT-33014: AB Test for Mobile Filters
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm, Field, propTypes as reduxFormPropTypes} from 'redux-form';
import {isEqual} from 'lodash';
import {ProductListingCount, DepartmentFilter, SortSelector, NewToggleFilterButton, AppliedFiltersList, TOOLBAR_FIELD_NAMES}
  from 'views/components/productListingPages/ProductListingToolbarComponents.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import {Accordion} from 'views/components/accordion/Accordion.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';

if (DESKTOP) { // eslint-disable-line
  require('./filters/_d.filter-section.scss');
  require('./filters/_d.added-filter-list.scss');
} else {
  require('./filters/_m.filter-section.scss');
  require('./filters/_m.added-filter-list.scss');
}

const MAX_FILTERS_TO_DISPLAY = 8;

export class _NewPlpFilterAndSortForm extends React.Component {
  static propTypes = {
    filtersMaps: PropTypes.shape({
      /** a map of available color to filter by */
      colors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        imagePath: PropTypes.string.isRequired
      })).isRequired,

      /** a map of available sizes to filter by */
      sizes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired
      })).isRequired,

      /** a map of available departments to filter by */
      departments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired
      })).isRequired,

      /** a map of available sub-departments to filter by */
      subDepartments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired
      })).isRequired
    }).isRequired,

    /** a map of available options for how to filter the results */
    sortOptionsMap: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    })).isRequired,

    /** total number of products that comply with the currently applied filters */
    totalProductsCount: PropTypes.number.isRequired,

    /** flags to allow the user to choose a department (L1) filter instead of the other (i.e., color, size, etc.) filters */
    isShowDepartmentFilterSelector: PropTypes.bool.isRequired,

    /** flags to allow the user to choose a subDepartment (L2) filter together with the other (i.e., color, size, etc.) filters */
    isShowSubDepartmentFilterSelector: PropTypes.bool.isRequired,

    ...reduxFormPropTypes
  };

  constructor (props) {
    super(props);

    let {initialValues} = props;

    this.sizeFilterRef = null;
    this.colorFilterRef = null;

    this.state = {
      isOpenFilterSection: !!props.isOpenFilterSection,
      prevDepartments: initialValues.departments || null,
      prevSubDepartments: initialValues.subDepartments || null,
      isSizeCollapsed: true,
      isColorCollapsed: true,
      isCategoryCollapsed: true
    };

    this.shouldEspotReload = this.shouldEspotReload.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleImmediateSubmit = this.handleImmediateSubmit.bind(this);
    this.handleSubmitOnChange = this.handleSubmitOnChange.bind(this);
    this.handleSubmitOnChangeAndOpenMenu = this.handleSubmitOnChangeAndOpenMenu.bind(this);
    this.handleRemoveAllFilters = this.handleRemoveAllFilters.bind(this);
    this.handleRemoveSizeFilters = this.handleRemoveSizeFilters.bind(this);
    this.handleRemoveColorFilters = this.handleRemoveColorFilters.bind(this);
    this.handleSortExpand = this.handleSortExpand.bind(this);
    this.handleCategoryListToggle = this.handleCategoryListToggle.bind(this);
    this.handleColorListToggle = this.handleColorListToggle.bind(this);
    this.handleSizeListToggle = this.handleSizeListToggle.bind(this);
    this.handleToggleFilterSection = () => this.setState({ isOpenFilterSection: !this.state.isOpenFilterSection });
    this.captureSizeFilterRef = (ref) => { this.sizeFilterRef = ref && ref.getRenderedComponent(); };
    this.captureColorFilterRef = (ref) => { this.colorFilterRef = ref && ref.getRenderedComponent(); };
    this.captureSubDepartmentFilterRef = (ref) => { this.subDepartmentFilterRef = ref && ref.getRenderedComponent(); };
    // reset field when blurred on desktop without clicking the "Apply" CTA.
    // Do it in next event loop to ensure this happens after redux-store updates the values (and thus we reset these values) which also gets triggered on blur. DT-29625
    this.handleColorFilterFieldBlur = () => !this.props.isMobile && setTimeout(() => this.props.reset());
    // reset field when blurred on desktop without clicking the "Apply" CTA.
    // Do it in next event loop to ensure this happens after redux-store updates the values (and thus we reset these values) which also gets triggered on blur. DT-29625
    this.handleSizeFilterFieldBlur = () => !this.props.isMobile && setTimeout(() => this.props.reset());
  }

  // DT-31958
  // Compare current form values with previous form values
  // We only want to reload the espot if the selected department / subdepartment has changed
  shouldEspotReload (formValues) {
    let {departments, subDepartments} = formValues;
    let {prevDepartments, prevSubDepartments} = this.state;
    return !isEqual(departments, prevDepartments) || !isEqual(subDepartments, prevSubDepartments);
  }

  handleRemoveFilter (fieldName, filterId) {
    let {change, initialValues} = this.props;
    change(fieldName, initialValues[fieldName].filter((entryId) => entryId !== filterId));
    this.props.handleSubmit(this.handleSubmitOnChange);
  }

  handleRemoveAllFilters () {
    this.handleRemoveColorFilters();
    this.handleRemoveSizeFilters();

    // On search pages we will need to remove selected (Sub)Department and reset form
    if (this.props.selectedDepFilters) {
      this.handleRemoveDepFilters();
      this.handleRemoveSubdepFilters();
    }

    this.handleSubmitOnChange();
  }

  handleRemoveColorFilters (event) {
    // Color "Clear All" button is in the accordion title element for styles/positioning
    // Need to stop event bubbling up to prevent accordion from collapsing when user clicks "Clear All"
    if (event) {
      event.stopPropagation();
    }

    let {change} = this.props;
    change(TOOLBAR_FIELD_NAMES.colors, []);
  }

  handleRemoveSizeFilters (event) {
    // Size "Clear All" button is in the accordion title element for styles/positioning
    // Need to stop event bubbling up to prevent accordion from collapsing when user clicks "Clear All"
    if (event) {
      event.stopPropagation();
    }

    let {change} = this.props;
    change(TOOLBAR_FIELD_NAMES.sizes, []);
  }

  handleRemoveDepFilters () {
    let {change} = this.props;
    change(TOOLBAR_FIELD_NAMES.departments, []);
  }

  handleRemoveSubdepFilters () {
    let {change} = this.props;
    change(TOOLBAR_FIELD_NAMES.subDepartments, []);
  }

  handleImmediateSubmit (formValues) {
    if (this.props.submitting) return;

    // DT-31958
    // Need to compare current form values to the previous values
    let reloadEspot = this.shouldEspotReload(formValues);

    this.sizeFilterRef && this.sizeFilterRef.closeMenu();
    this.colorFilterRef && this.colorFilterRef.closeMenu();
    this.subDepartmentFilterRef && this.subDepartmentFilterRef.closeMenu();

    return this.props.onSubmit(formValues, reloadEspot).then(() => {
      this.setState({
        isOpenFilterSection: false,
        prevDepartments: formValues.departments,
        prevSubDepartments: formValues.subDepartments
      });
    });
  }

  handleSubmitOnChange (shouldOpenMenu) {
    if (this.props.submitting) return;

    this.sizeFilterRef && this.sizeFilterRef.closeMenu();
    this.colorFilterRef && this.colorFilterRef.closeMenu();
    this.subDepartmentFilterRef && this.subDepartmentFilterRef.closeMenu();

    // Observe that since submission can occur by capturing the change events in the CustomSelects of the form
    // we need to wait for the next event loop for the value in the redux-store to reflect the ones in the fields
    setTimeout(() => {
      // DT-31958
      // Need to get form values from props / redux-store and compare to the previous values
      let {formValues} = this.props;
      let reloadEspot = this.shouldEspotReload(formValues);

      // DT-33014
      // For AB test we don't want to close the menu after selecting a department
      // However, this function is called in many situations in different ways
      // Sometimes it is called directly, sometimes it's called via Redux Form handleSubmit
      // Redux form will pass the form value object as the first argument (which we don't use)
      // So we check to see if the argument is a boolean before using the value (otherwise default to false)
      let isOpenFilterSection = typeof shouldOpenMenu === 'boolean' ? shouldOpenMenu : false;

      this.props.onSubmit(formValues, reloadEspot).then(() => {
        this.setState({
          isOpenFilterSection,
          prevDepartments: formValues.departments,
          prevSubDepartments: formValues.subDepartments
        });
      });
    });
  }

  // DT-33014
  // For AB test we don't want to close the menu after selecting a department
  handleSubmitOnChangeAndOpenMenu () {
    this.handleSubmitOnChange(true);
  }

  // DT-33014
  // As per instruction from UX team
  // When user expands the "SORT BY" dropdown the filter menu should close
  handleSortExpand () {
    if (this.state.isOpenFilterSection) {
      this.handleToggleFilterSection();
    }
  }

  // DT-33014
  // If there's more than two rows of available filters display button to show more options
  // NOTE: It would probably be better to handle this logic in the DropdownList component
  // but I don't want to introduce possible regression issues into a low level component (would affect ALL selects)
  // If AB test succeeds, we should move this logic into CustomSelect / DropdownList components
  handleCategoryListToggle () {
    let {isCategoryCollapsed} = this.state;
    this.setState({isCategoryCollapsed: !isCategoryCollapsed});
  }

  handleColorListToggle () {
    let {isColorCollapsed} = this.state;
    this.setState({isColorCollapsed: !isColorCollapsed});
  }

  handleSizeListToggle () {
    let {isSizeCollapsed} = this.state;
    this.setState({isSizeCollapsed: !isSizeCollapsed});
  }

  render () {
    let {totalProductsCount, error, submitting, handleSubmit, sortOptionsMap} = this.props;
    let {isOpenFilterSection} = this.state;
    let appliedFiltersCount = this.getAppliedFiltersCount();
    let selectedFiltersCount = this.getSelectedFiltersCount();

    return (
      <div className="filter-and-sort-form-container new-filter-and-sort-form-container">
        {error && <ErrorMessage error={error} />}
        <ProductListingCount isMobile totalProductsCount={totalProductsCount} isShowAllEnabled={false} /> {/* NOTE: FPO isShowAllEnabled */}

        <div className="new-mobile-filter-container">
          <NewToggleFilterButton appliedFiltersCount={appliedFiltersCount} onToggleFilter={this.handleToggleFilterSection} isOpenFilterSection={isOpenFilterSection}  />
          <SortSelector sortSelectOptions={getSortCustomOptionsMap(sortOptionsMap)} onChange={handleSubmit(this.handleSubmitOnChange)} onExpandCallback={this.handleSortExpand} selectTextOverride="SORT BY" />
        </div>

        {isOpenFilterSection && <form className="available-filters-sorting-container" onSubmit={handleSubmit(this.handleImmediateSubmit)}>
          {this.renderMobilePlpFilterForm()}
          <MobileFormActions selectedFiltersCount={selectedFiltersCount} submitting={submitting} appliedFiltersCount={appliedFiltersCount} onRemoveAllFilters={this.handleRemoveAllFilters} />
        </form>}
      </div>
    );
  }

  // ------------------ protected methods -------------------//

  renderMobilePlpFilterForm () {
    let { filtersMaps: { departments, subDepartments, colors, sizes },
      initialValues, isShowDepartmentFilterSelector, isShowSubDepartmentFilterSelector, submitting, handleSubmit } = this.props;

    let appliedFilters = {
      departments: initialValues[TOOLBAR_FIELD_NAMES.departments].map((departmentId) => departments.find((dep) => departmentId === dep.id)),
      subDepartments: initialValues[TOOLBAR_FIELD_NAMES.subDepartments].map((departmentId) => subDepartments.find((dep) => departmentId === dep.id))
    };

    if (submitting) {
      return <Spinner className="loading-more-product">Updating...</Spinner>;
    } else if (isShowDepartmentFilterSelector) {
      return (
        <div>
          <div className="department-filter-container">
            <div className="department-filter-title">Filter By:</div>
            <DepartmentFilter isMobile={false} optionsMap={getDepartmentFilterOptionsMap(departments)} onChange={handleSubmit(this.handleSubmitOnChangeAndOpenMenu)} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="filters-sorting-container">
            {this.renderAppliedFiltersList(appliedFilters, ['departments', 'subDepartments'])}
            {isShowSubDepartmentFilterSelector && subDepartments.length > 0 && this.renderSubDepartmentFilterField()}
            {colors.length > 0 && this.renderColorFilterField()}
            {sizes.length > 0 && this.renderSizeFilterField()}
          </div>
        </div>
      );
    }
  }

  renderAppliedFiltersList (appliedFilters, filterKeys) {
    let filterLength = 0;
    filterKeys.forEach((key) => {
      filterLength = filterLength + appliedFilters[key].length;
    });

    return filterLength > 0
      ? (<div className="applied-filters-list-container">
          <div className="applied-filters-list-title">You've picked:</div>
          <AppliedFiltersList isMobile onRemoveFilter={this.handleRemoveFilter} appliedFilters={appliedFilters} />
        </div>)
      : null;
  }

  renderSubDepartmentFilterField () {
    let {isMobile, filtersMaps, handleSubmit} = this.props;
    let {isCategoryCollapsed} = this.state;
    let optionsMap = getSubDepartmentFilterOptionsMap(filtersMaps.subDepartments);
    let collapseList = optionsMap.length > MAX_FILTERS_TO_DISPLAY;
    let title = <span className="accordion-title">Category</span>;
    let buttonText = isCategoryCollapsed ? 'More categories' : 'Less categories';
    let buttonClassName = cssClassName(isCategoryCollapsed ? 'expand-filters-toggle-button' : 'collapse-filters-toggle-button');
    let className = cssClassName(
      collapseList && 'item-list-collapsible ',
      !isCategoryCollapsed && ' item-list-collapsible-expanded ',
      isMobile ? 'categories-details-chips' : 'size-detail categories-detail'
    );

    return (
        <Accordion title={title} className="accordion-filters-list">
          <Field name={TOOLBAR_FIELD_NAMES.subDepartments} component={CustomSelect} optionsMap={optionsMap}
            placeholder="Category" className={className} expanded={isMobile}
            disableExpandStateChanges={isMobile} ref={this.captureSubDepartmentFilterRef} withRef
            onChange={handleSubmit(this.handleSubmitOnChange)} parse={parseSubDepartment} format={formatSubDepartment} />
        {collapseList && <button type="button" className={buttonClassName} onClick={this.handleCategoryListToggle}>{buttonText}</button>}
        </Accordion>
    );
  }

  renderColorFilterField () {
    let {isMobile, filtersMaps, initialValues} = this.props;
    let {isColorCollapsed} = this.state;
    let optionsMap = getColorFilterOptionsMap(filtersMaps.colors, isMobile);
    let collapseList = optionsMap.length > MAX_FILTERS_TO_DISPLAY;
    let buttonText = isColorCollapsed ? 'More colors' : 'Less colors';
    let buttonClassName = cssClassName(isColorCollapsed ? 'expand-filters-toggle-button' : 'collapse-filters-toggle-button');
    let className = cssClassName(
      collapseList && 'item-list-collapsible ',
      collapseList && !isColorCollapsed && ' item-list-collapsible-expanded ',
      isMobile ? 'color-detail-chips' : 'color-detail'
    );

    let colorFilters = <Field name={TOOLBAR_FIELD_NAMES.colors} component={CustomSelect} optionsMap={optionsMap}
      placeholder="Color" allowMultipleSelections className={className} expanded={isMobile}
      disableExpandStateChanges={isMobile} ref={this.captureColorFilterRef} withRef onBlur={this.handleColorFilterFieldBlur} />;

    let appliedFilters = {
      colors: initialValues[TOOLBAR_FIELD_NAMES.colors].map((colorId) => filtersMaps.colors.find((colorOption) => colorId === colorOption.id))
    };

    let title = [
      <span className="accordion-title">Color</span>,
      <button type="button" className="clear-all-color-plp-filters" onClick={this.handleRemoveColorFilters}>X Clear All</button>,
      this.renderAppliedFiltersList(appliedFilters, ['colors'])
    ];

    return (!isMobile
      ? colorFilters
      : <Accordion title={title} className="accordion-filters-list">
          <div className="filter-size-and-color-container">{colorFilters}</div>
          {collapseList && <button type="button" className={buttonClassName} onClick={this.handleColorListToggle}>{buttonText}</button>}
        </Accordion>
    );
  }

  renderSizeFilterField () {
    let {isMobile, filtersMaps, initialValues} = this.props;
    let {isSizeCollapsed} = this.state;
    let optionsMap = getSizeFilterOptionsMap(filtersMaps.sizes, isMobile);
    let collapseList = optionsMap.length > MAX_FILTERS_TO_DISPLAY;
    let buttonText = isSizeCollapsed ? 'More sizes' : 'Less sizes';
    let buttonClassName = cssClassName(isSizeCollapsed ? 'expand-filters-toggle-button' : 'collapse-filters-toggle-button');
    let className = cssClassName(
      collapseList && 'item-list-collapsible ',
      collapseList && !isSizeCollapsed && ' item-list-collapsible-expanded ',
      isMobile ? 'size-detail-chips' : 'size-detail'
    );

    let sizeFilters = <Field name={TOOLBAR_FIELD_NAMES.sizes} component={CustomSelect} optionsMap={optionsMap}
      placeholder="Size" allowMultipleSelections className={className} expanded={isMobile}
      disableExpandStateChanges={isMobile} ref={this.captureSizeFilterRef} withRef onBlur={this.handleSizeFilterFieldBlur} />;

    let appliedFilters = {
      sizes: initialValues[TOOLBAR_FIELD_NAMES.sizes].map((sizeId) => filtersMaps.sizes.find((sizeOption) => sizeId === sizeOption.id))
    };

    let title = [
      <span className="accordion-title">Size</span>,
      <button type="button" className="clear-all-size-plp-filters" onClick={this.handleRemoveSizeFilters}>X Clear All</button>,
      this.renderAppliedFiltersList(appliedFilters, ['sizes'])
    ];

    return (!isMobile
      ? sizeFilters
      : <Accordion title={title} className="accordion-filters-list">
          <div className="filter-size-and-color-container">{sizeFilters}</div>
          {collapseList && <button type="button" className={buttonClassName} onClick={this.handleSizeListToggle}>{buttonText}</button>}
        </Accordion>
    );
  }

  getAppliedFiltersCount () {
    return this.props.initialValues[TOOLBAR_FIELD_NAMES.departments].length +
      this.props.initialValues[TOOLBAR_FIELD_NAMES.subDepartments].length +
      this.props.initialValues[TOOLBAR_FIELD_NAMES.colors].length +
      this.props.initialValues[TOOLBAR_FIELD_NAMES.sizes].length;
  }

  getSelectedFiltersCount () {
    let { selectedSizesFilters, selectedColorFilters, selectedDepFilters, selectedSebdepFilters } = this.props;

    return selectedSizesFilters + selectedColorFilters + selectedDepFilters + selectedSebdepFilters;
  }
}

function MobileFormActions (props) {
  let { submitting, onRemoveAllFilters, selectedFiltersCount, appliedFiltersCount } = props;

  return (
    <div className="mobile-form-action-button-container">
      <div className="toggle-filter-button-container mobile-form-action">
        <button type="submit" className="send-information-button" disabled={submitting}>DONE</button>
      </div>
      <div className="toggle-filter-button-container mobile-form-action">
        <button type="button" className="send-information-button-black" disabled={submitting || (!selectedFiltersCount && !appliedFiltersCount)} onClick={onRemoveAllFilters}>CLEAR ALL</button>
      </div>
    </div>
  );
}

function getColorFilterOptionsMap (colorOptionsMap, isMobile) {
  let result = colorOptionsMap.map((color) => ({
    value: color.id,
    title: color.displayName,
    content: <div className="color-title">
      <img className="color-chip" alt={color.displayName} src={color.imagePath} />
      <span className="color-name">{color.displayName}</span>
    </div>
  }));
  return !isMobile
    ? result.concat([{ value: 'APPLY', title: 'Apply', content: <button type="submit" className="apply-filter-button">Apply</button>, disabled: true }])
    : result;
}

function getSizeFilterOptionsMap (sizeOptionsMap, isMobile) {
  /* TODO: as part of re-styling */
  let result = sizeOptionsMap.map((size) => ({
    value: size.id,
    title: size.displayName,
    content: <span className="size-title">{size.displayName}</span>
  }));
  return !isMobile
    ? result.concat([{ value: 'APPLY', title: 'Apply', content: <button type="submit" className="apply-filter-button">Apply</button>, disabled: true }])
    : result;
}

function getDepartmentFilterOptionsMap (departmentOptionsMap) {
  return departmentOptionsMap.map((department) => {
    return {
      value: department.id,
      title: department.displayName,
      content: <span className="department-filter-title">{department.displayName}</span>
    };
  });
}

function getSubDepartmentFilterOptionsMap (subDepartmentOptionsMap) {
  return subDepartmentOptionsMap.map((subDepartment) => ({
    value: subDepartment.id,
    title: subDepartment.displayName,
    content: <span className="size-title">{subDepartment.displayName}</span>
  }));
}

function getSortCustomOptionsMap (sortOptionsMap) {
  return sortOptionsMap.map((sortOption) => ({
    value: sortOption.id,
    title: <span className="sort-item-selected">{sortOption.displayName}</span>,
    content: <span className="sort-title">{sortOption.displayName}</span>
  }));
}

// currently redux-store supports multiple subDepartment selections (hence value is an array in the store)
// but this component limits to single selections (hence field should be a single string equal to the first array element)
function parseSubDepartment (subDepartmentId) {
  return subDepartmentId ? [subDepartmentId] : [];
}

function formatSubDepartment (subDepartmentsIdsArray) {
  return subDepartmentsIdsArray.length > 0 ? subDepartmentsIdsArray[0] : '';
}

export const formName = 'PlpFilterAndSortForm';
export let NewPlpFilterAndSortForm = reduxForm({
  form: formName,
  enableReinitialize: true
})(_NewPlpFilterAndSortForm);
