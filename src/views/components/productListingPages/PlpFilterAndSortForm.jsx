/**
 * @module PlpFilterAndSortForm
 *
 * @author Gabriel Gomez
 * @author Miguel Alvarez Igarzábal
 * @author Florencia Acosta
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm, Field, propTypes as reduxFormPropTypes} from 'redux-form';
import {isEqual} from 'lodash';
import {ProductListingCount, DepartmentFilter, SortSelector, ToggleFilterButton, AppliedFiltersList, TOOLBAR_FIELD_NAMES}
  from 'views/components/productListingPages/ProductListingToolbarComponents.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';

if (DESKTOP) { // eslint-disable-line
  require('./filters/_d.filter-section.scss');
  require('./filters/_d.added-filter-list.scss');
} else {
  require('./filters/_m.filter-section.scss');
  require('./filters/_m.added-filter-list.scss');
}

export class _PlpFilterAndSortForm extends React.Component {
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
      prevSubDepartments: initialValues.subDepartments || null
    };

    this.shouldEspotReload = this.shouldEspotReload.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleImmediateSubmit = this.handleImmediateSubmit.bind(this);
    this.handleSubmitOnChange = this.handleSubmitOnChange.bind(this);
    this.handleRemoveAllFilters = this.handleRemoveAllFilters.bind(this);
    this.handleRemoveSizeFilters = this.handleRemoveSizeFilters.bind(this);
    this.handleRemoveColorFilters = this.handleRemoveColorFilters.bind(this);
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

  handleRemoveColorFilters () {
    let {change} = this.props;
    change(TOOLBAR_FIELD_NAMES.colors, []);
  }

  handleRemoveSizeFilters () {
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

  handleSubmitOnChange () {
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

      this.props.onSubmit(formValues, reloadEspot).then(() => {
        this.setState({
          isOpenFilterSection: false,
          prevDepartments: formValues.departments,
          prevSubDepartments: formValues.subDepartments
        });
      });
    });
  }

  render () {
    let {filtersMaps: {departments, subDepartments, colors, sizes},
      isMobile, initialValues} = this.props;

    let appliedFilters = {
      departments: initialValues[TOOLBAR_FIELD_NAMES.departments].map((departmentId) => departments.find((dep) => departmentId === dep.id)),
      subDepartments: initialValues[TOOLBAR_FIELD_NAMES.subDepartments].map((departmentId) => subDepartments.find((dep) => departmentId === dep.id)),
      colors: initialValues[TOOLBAR_FIELD_NAMES.colors].map((colorId) => colors.find((colorOption) => colorId === colorOption.id)),
      sizes: initialValues[TOOLBAR_FIELD_NAMES.sizes].map((sizeId) => sizes.find((sizeOption) => sizeId === sizeOption.id))
    };
    return isMobile ? this.renderMobile(appliedFilters) : this.renderDesktop(appliedFilters);
  }

  renderDesktop (appliedFilters) {
    let {filtersMaps, sortOptionsMap, isShowDepartmentFilterSelector, isShowSubDepartmentFilterSelector,
      currentSearchTerm, totalProductsCount, error, submitting, handleSubmit} = this.props;

    return (
      <div className="filter-and-sort-form-container">
        {error && <ErrorMessage error={error} />}
        <ProductListingCount currentSearchTerm={currentSearchTerm} isMobile={false} totalProductsCount={totalProductsCount} isShowAllEnabled={false} /> {/* NOTE: FPO isShowAllEnabled */}

        <form className="available-filters-sorting-container" onSubmit={handleSubmit(this.handleImmediateSubmit)}>
          {!isShowDepartmentFilterSelector
            ? <div className="filters-sorting-container">
              <span className="filter-title">Filter By:</span>
              {isShowSubDepartmentFilterSelector && this.renderSubDepartmentFilterField()}
              {this.renderSizeFilterField()}
              {this.renderColorFilterField()}
              <SortSelector isMobile={false} sortSelectOptions={getSortCustomOptionsMap(sortOptionsMap)} onChange={handleSubmit(this.handleSubmitOnChange)} />
            </div>

            : <div className="filters-sorting-container">
              <span className="filter-title">Filter By:</span>
              <DepartmentFilter isMobile={false} optionsMap={getDepartmentFilterOptionsMap(filtersMaps.departments)} onChange={handleSubmit(this.handleSubmitOnChange)}/>
              <SortSelector isMobile={false} sortSelectOptions={getSortCustomOptionsMap(sortOptionsMap)} onChange={handleSubmit(this.handleSubmitOnChange)} />
            </div>
          }

          {this.getAppliedFiltersCount() > 0 && <AppliedFiltersList isMobile={false} onRemoveFilter={this.handleRemoveFilter} appliedFilters={appliedFilters} />}
        </form>

        {submitting && <Spinner className="loading-more-product">Updating...</Spinner>}
      </div>
    );
  }

  renderMobile (appliedFilters) {
    let {totalProductsCount, isShowDepartmentFilterSelector, error, submitting, handleSubmit} = this.props;
    let {isOpenFilterSection} = this.state;
    let appliedFiltersCount = this.getAppliedFiltersCount();
    let selectedFiltersCount = this.getSelectedFiltersCount();

    return (
      <div className="filter-and-sort-form-container">
        {error && <ErrorMessage error={error} />}
        <ProductListingCount isMobile totalProductsCount={totalProductsCount} isShowAllEnabled={false} /> {/* NOTE: FPO isShowAllEnabled */}

        <form className="available-filters-sorting-container" onSubmit={handleSubmit(this.handleImmediateSubmit)}>
          {isOpenFilterSection && !isShowDepartmentFilterSelector && <MobileFormActions selectedFiltersCount={selectedFiltersCount} submitting={submitting} appliedFiltersCount={appliedFiltersCount} onRemoveAllFilters={this.handleRemoveAllFilters}/>}
          {isOpenFilterSection && this.renderMobilePlpFilterForm(appliedFilters)}
          {isOpenFilterSection && !isShowDepartmentFilterSelector && <ToggleFilterButton disabled={submitting} appliedFiltersCount={appliedFiltersCount} isOpenFilterSection />}
        </form>
        {!isOpenFilterSection && <ToggleFilterButton appliedFiltersCount={appliedFiltersCount} onToggleFilter={this.handleToggleFilterSection} isOpenFilterSection={false} />}
      </div>
    );
  }

  // ------------------ protected methods -------------------//

  renderMobilePlpFilterForm (appliedFilters) {
    let { filtersMaps: { departments, subDepartments, colors, sizes }, sortOptionsMap,
      isShowDepartmentFilterSelector, isShowSubDepartmentFilterSelector, submitting, handleSubmit } = this.props;
    let appliedFiltersCount = this.getAppliedFiltersCount();

    if (submitting) {
      return <Spinner className="loading-more-product">Updating...</Spinner>;
    } else if (isShowDepartmentFilterSelector) {
      return (
        <div>
          <div className="department-filter-container">
            <div className="department-filter-title">Filter By:</div>
            <DepartmentFilter isMobile={false} optionsMap={getDepartmentFilterOptionsMap(departments)} onChange={handleSubmit(this.handleSubmitOnChange)} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="filters-sorting-container">
            {!!appliedFiltersCount && <AppliedFiltersList isMobile onRemoveFilter={this.handleRemoveFilter} appliedFilters={appliedFilters} />}
            <SortSelector isMobile sortSelectOptions={getSortCustomOptionsMap(sortOptionsMap)} onChange={this.handleSortChange} />
            {isShowSubDepartmentFilterSelector && subDepartments.length > 0 && this.renderSubDepartmentFilterField()}
            {colors.length > 0 && this.renderColorFilterField()}
            {sizes.length > 0 && this.renderSizeFilterField()}
          </div>
        </div>
      );
    }
  }

  renderSubDepartmentFilterField () {
    let {isMobile, filtersMaps, handleSubmit} = this.props;
    let className = cssClassName(isMobile ? 'categories-details-chips' : 'size-detail categories-detail');
    return (
        <Field name={TOOLBAR_FIELD_NAMES.subDepartments} component={CustomSelect} optionsMap={getSubDepartmentFilterOptionsMap(filtersMaps.subDepartments)}
          title={isMobile ? 'Category' : ''} placeholder="Category" className={className} expanded={isMobile}
          disableExpandStateChanges={isMobile} ref={this.captureSubDepartmentFilterRef} withRef
          onChange={handleSubmit(this.handleSubmitOnChange)} parse={parseSubDepartment} format={formatSubDepartment} />
    );
  }

  renderColorFilterField () {
    let { isMobile, filtersMaps, selectedColorFilters } = this.props;
    let className = cssClassName(isMobile ? 'color-detail-chips' : 'color-detail');
    let colorFilters = <Field name={TOOLBAR_FIELD_NAMES.colors} component={CustomSelect} optionsMap={getColorFilterOptionsMap(filtersMaps.colors, isMobile)}
      title={isMobile ? 'Color' : ''} placeholder="Color" allowMultipleSelections className={className} expanded={isMobile}
      disableExpandStateChanges={isMobile} ref={this.captureColorFilterRef} withRef onBlur={this.handleColorFilterFieldBlur} />;

    return (!isMobile
      ? colorFilters
      : <div className="filter-size-and-color-container">
          {colorFilters}
          {!!selectedColorFilters && <button type="button" className="clear-all-color-plp-filters" onClick={this.handleRemoveColorFilters}>X Clear</button>}
        </div>);
  }

  renderSizeFilterField () {
    let { isMobile, filtersMaps, selectedSizesFilters } = this.props;
    let className = cssClassName(isMobile ? 'size-detail-chips' : 'size-detail');
    let sizeFilters = <Field name={TOOLBAR_FIELD_NAMES.sizes} component={CustomSelect} optionsMap={getSizeFilterOptionsMap(filtersMaps.sizes, isMobile)}
      title={isMobile ? 'Size' : ''} placeholder="Size" allowMultipleSelections className={className} expanded={isMobile}
      disableExpandStateChanges={isMobile} ref={this.captureSizeFilterRef} withRef onBlur={this.handleSizeFilterFieldBlur} />;

    return (!isMobile
        ? sizeFilters
        : <div className="filter-size-and-color-container">
            {sizeFilters}
            {!!selectedSizesFilters && <button type="button" className="clear-all-size-plp-filters" onClick={this.handleRemoveSizeFilters}>X Clear</button>}
          </div>);
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
    <div style={{display: 'flex'}}>
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
      {!isMobile && <span className="color-name">{color.displayName}</span>}
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
export let PlpFilterAndSortForm = reduxForm({
  form: formName,
  enableReinitialize: true
})(_PlpFilterAndSortForm);
