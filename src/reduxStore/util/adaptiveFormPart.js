/** @module AdaptiveFormPart
 * @summary provides a function that returns a HOC that renderes a given component that tracks and adapts
 * the props passed to that component to the value(s) of other fields in a containing redux-form, or an optionally specified external form.
 * In addition, support is provided for changing values of dependant form fields based on the values of the tracked fields.
 *
 * Note: if you want to wrap a single Field, you would almost always want to use the AdaptiveField convenience component instead.
 */
 // TODO: fix getWrappedInstance

import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {Field, formValueSelector, getFormSyncErrors, change as changeFormValue} from 'redux-form';
import invariant from 'invariant';
import shallowEqual from 'util/shallowEqual';
import deepEqual from 'util/deepEqual';
import {getNestedInObject} from 'util/getNestedInObject';

const SPLIT_REGEXP = /\s*,\s*/g;    // split on commas, and ignore spaces around commas

/**
 * @summary Returns an adaptiveFormPart wrapping the given component.
 *
 * This method returns two slightly different components based on whether the ComponentToAdapt is a
 * redux-form Field or not.
 * Note: in case you want to wrap a field it is more convenient to use the AdaptiveField component
 *      instead of directly invoking this method.
 *
 * In case ComponentToAdapt is a Field (or a descendent of) then the returned
 * component is tailored for wrapping and adapting a single field. The difference is in how the wrapping
 * is done, as well as in how the mapValuesToProps callback paased as a prop to the returned HOC behaves:
 * If ComponentToAdapt is a Field or a subclass of Field:
 *  1. The values parameter object passed to mapValuesToProps will contain an extra key called '_myValue'
 *     that contains the current value of the wrapped field.
 *  2. If mapValuesToProps wants to change the value of the wrapped field, it should specify the new desired value
 *     inside a key called _newValue in the object it returns.
 *  3. The wrapping is such that the props returned by mapValuesToProps are passed directly to the component
 *     that the Field wraps (i.e., the one specified in the 'component' prop passed to this component),
 *     instead of to Field (i.e., ComponentToAdapt) itself.
 * otherwise:
 *  1. The values parameter object passed to mapValuesToProps will contain no _myValue key.
 *  2. If mapValuesToProps wants to change the value of any field in the adapted-to form, it should specify the new
 *     desired values by including a key called _newValues in the object it returns, who's value is an object that
 *     maps field names to the new desired values.
 *  3. The wrapping is such that the props returned by mapValuesToProps are passed to ComponentToAdapt
 *
 * @param  {React.component} (ComponentToAdapt)   the component to wrapp and inject props into
 * @param  {string}          displayNamePrefix  the prefix of the display name of this component
 * @return {React.Component}                    a wrapping HOC
 */
export function getAdaptiveFormPart (ComponentToAdapt, displayNamePrefix = 'AdaptiveFormPart') {
  const isWrappingField = ComponentToAdapt === Field || ComponentToAdapt.prototype instanceof Field;

  function getDisplayName () {
    let adaptedComponentName = ComponentToAdapt.displayName || ComponentToAdapt.name || 'Component';
    return `${displayNamePrefix}(${adaptedComponentName})`;
  }

  class AdaptiveFormPart extends React.Component {

    static propTypes = {

      /**
       * An optional name of the form to adapt to.
       * Use only when outside the form you want to adapt to;
       * not needed (and not recommended due to no automatic support for formFields)
       * when used inside a form to adapt to changes in the same form
       * (since it is automatically picked from the react context).
       *
       *  Note: if this prop is specified then all fioeld names in the prop <code>adaptTo</code>
       *  must be full names and not relative to any formSection.
       */
      adaptToForm: PropTypes.string,

       /** A comma separated list of field names (as well as form section names) in the containing form
        * whoe's values should be tracked and adapted to (e.g. "email, firstName").
        * In other words, when any field in this list changes, the method specified in the mapValuesToProps
        * prop is called to calculate and inject new props to the wrapped component.
        *
        * Note: in case that the form has sections (created using redux-form's FormSection component)
        *       then the values of the form fields are stored in the redux-store as nested objects
        *       reflecting the nesting of FormSection names.
        *       If the prop adaptToForm is not specified (i.e., if adapting to fields in the containing redux-form) then
        *       field names specified here are considered to be relative to the inner-most FormSection containing this component
        *       unless the field name starts with '/', indicating that this name is a full name (aka absolute name) from the root of
        *       the form; if daptToForm is specified then all field names are considered to be absolute, and the '/' prefix is optional.
        *       Note that every dot '.' in a name designates stepping into a new form section.
        * @example <caption>tracking the shipping adddress country, and billing first name
        *            when this component is inside a billing FormSection (which has inside it another address FormSection)
        *          </caption>
        *          adaptTo="/shipTo.address.country, firstName, address.country"
        *
        * Note: spaces around the commas are removed and ignored.
        */
      adaptTo: PropTypes.string.isRequired,
      // note: adaptTo is not an array since the temptation to pass it inline is big,
      // and that will create a new array every time, and will force unnecessary renders

      /**
       * An optional comma separated list of field names that will not be tracked but can be adapted to.
       * In other words, when a field in this list changes the mapValuesToProps method is <strong>not</strong> called.
       * However, when a when a field mentioned in the <code>track</code> prop changes, then the mapValuesToProps
       * is called and is being presented with the current values of both the fields in the track prop and in this prop.
       *
       * This prop follows the same naming rules as the <code>adaptTo</code> prop.
       */
      extraFields: PropTypes.string,

       /**
        * This method will be called whenever the values of the tracked form fields change.
        * It will be passed the parameters: values, state, syncValidityInfo.
        *  values: this is a plain object with the values of the fields specified in adaptTo extraFields.
        *        (e.g. {email: "gg@gmail.com, firstName: "john", address: {state: "NY"}})
        *        In case the wrapped component is a Field, it will also contaion a _myValue key
        *        with the value of the wrapped field.
        *  state: this is the state of the redux store (not needed in many simple cases).
        *  syncValidityInfo: this parameter will be defined only if the prop <code>includeValidityInfo</code> is true.
        *                   This parameter is a plain object with the same structure as the values parameter.
        *                   However, instead of giving the value of each tracked field, it gives a Boolean
        *                   indicating whether this value passes synchronous validation.
        *
        * This method should return a simple object containing the props to be passed to the wrapped component.
        * In addition, the returned object can include one virtual prop spefifying new field values, as follows:
        *    in case the wrapped component is a Field: include a _newValue prop with the new value for the wrapped field.
        *    otherwise: include a _newValues prop that is a simple object with keys that are field names and values
        *    that are the requested new values for these fields. Note that you can reference this way any field
        *    in the formn, not necessarily fields that are wrapped by this component.
        *    Also note that the names of the fields should follow the same rules as the adaptTo prop does.
        */
      mapValuesToProps: PropTypes.func.isRequired,

      /** Flags that mapValuesToProps should be called whenever there is any change in the redux
       * store, and not only when the form values given by <code>adaptTo</code> change.
       * Defaults to <code>false</code>, i.e., mapValuesToProps is called only when the values
       * given by <code>adaptTo</code> change.
       */
      adaptToStore: PropTypes.bool,

      /** Flags if a syncValidityInfo parameter should be passed to mapValuesToProps */
      includeValidityInfo: PropTypes.bool,

      /**
       *  Flags that a prop called changeFormField should be passed to the wrapped component.
       *  This prop is a method that can be used to change form values. It accepts: formName, fieldName, fieldValue.
       */
      includeChangeFormFieldProp: PropTypes.bool,

      /** Flags if a ref to the instance of the wrapped component will be availble by
       * calling getWrappedInstance()
       */
      withRef: PropTypes.bool
    }

    static displayName = getDisplayName()

    static defaultProps = {
      adaptToStore: false
    }

    /*
     * Note that we have to introduce three HOC: AdaptiveFormPart, this.connectedComponent, and Adapter,
     * We render one of the following two hierarchies, depending on whether ComponentToAdapt is a redux-form Field or not:
     * If it is a Field: AdaptiveFormPart, ComponentToAdapt=Field, connectedComponent, Adapter
     * otherwise:        AdaptiveFormPart, connectedComponent, Adapter, ComponentToAdapt.
     * The reson we render connectedComponent inside Field is that this way connectedComponent can automatically capture
     * the current value passed to it by redux-form (inside props.input.value) and we can optimize
     * by removing redundant changes that specify the same new value.
     * Note that Field inserts two HOC after it (and before connectedComponent): connect(ConnectedField) ConnectedField.
     *
     * connectedComponent subscribes to the store (using react-redux connect())
     * to be notified when the tracked form values change. When they do, it calls the mapValuesToProps method
     * (that was passsed to this component as a prop) in order to calculate the new props to pass down. Note that
     * in order to do that, connectedComponent needs to have accesss to mapValuesToProps which in turn needs access to
     * at least the form name (so it can find the values in the store).
     *
     * AdaptiveField is the outer-most HOC, and it is the one that supplies a mapStateToProps method for connectedComponent.
     * inside mapStateToProps it can call mapValuesToProps and give it all the information it needs in order to work.
     * Note that even if we wanted we cannot get rid of this HOC as (due to encapsulation inside function closures) there
     * is no way to monkey-patch Field to either enhance its internally used connect(), nor to make it pass extra props
     * (such as mapValuesToProps) to connectedComponent.
     *
     * InputAdapter is the inner-most HOC, and it's sole purpose is to dispatch actions that will change the value of
     * the rendered input component. This component is needed since we cannot dispatch such actions while rendering
     * (React expects render() to be pure, with no side-effects), and thus we can not do it inside mapValuesToProps
     * (which is called by mapStateToProps, which is called during render). Thus, such actions are dispatched by InputAdapter
     * in its componentDidMount and componentWillReceiveProps methods, whenever it detects a new value prop.
     * Also note that we could dispatch inside mapStateToProps if we used setTiemout(), but this is less desirable
     * as it will dispatch later than inside componentWillReceiveProps.
     */

    constructor (props, context) {
      super(props, context);
      if (!context._reduxForm && !props.adaptToForm) {
        throw new Error(`${AdaptiveFormPart.displayName}: this component must either be inside a component decorated with reduxForm(), or be given the 'adaptToForm' prop`);
      }

      this.formValues = Object.create(null);         // the latest values of the tracked form fields
       // the latest props calculated based on the tracked form values, null indicates not assigned yet
      this.stateProps = null;
      this.componentRef = undefined;          // a ref to the instance of the wrapped component

      // initialize this. absoluteNamesArray, relativeFullNamesArray, extraAbsoluteNamesArray, extraRelativeFullNamesArray
      this.calculateFieldsNames(props);

      // bind callback funtions to this
      this.mapStateToProps = this.mapStateToProps.bind(this);
      this.mapDispatchToProps = this.mapDispatchToProps.bind(this);
      this.mergeProps = this.mergeProps.bind(this);
      this.captureComponentRef = this.captureComponentRef.bind(this);

      // initialise the component that will connect the wrapped component to the redux store
      this.connectedComponent = this.initConnectedComponent(props.withRef);
    }

    shouldComponentUpdate (nextProps) {
      return !shallowEqual(this.props, nextProps);
    }

    componentWillReceiveProps (nextProps) {
      if (this.props.adaptToForm !== nextProps.adaptToForm) {
        this.calculateFieldsNames(nextProps);
      } else {    // form to adapt to did not change
        this.calculateFieldsNames(nextProps,
          this.props.adaptTo !== nextProps.adaptTo, this.props.extraFields !== nextProps.extraFields);
      }
    }

    getWrappedInstance () {
      invariant(this.props.withRef,
       `If you want to access getRenderedComponent(), you must specify a withRef prop to ${AdaptiveFormPart.displayName}`);
      return this.componentRef;
    }

    render () {
      return (
        isWrappingField
        // nesting structure: Field=ComponentToAdapt -> connect(adapter) -> adapter -> this.props.component
        ? React.createElement(ComponentToAdapt, this.getComponentProps())
        // nesting structure: connect(adapter) -> adapter -> componentToAdapt
        : React.createElement(this.connectedComponent, this.getComponentProps())
      );
    }

    // ------------- private members ----------------------

    calculateFieldsNames (props, calculateBaseNames = true, calculateExtraNames = true) {
      if (calculateBaseNames) {
        // an array of the absolute names in adaptTo
        this.absoluteNamesArray = this.getNamesArray(props.adaptTo, true);
        // an array of the relative names in adaptTo, converted to absolute names
        this.relativeFullNamesArray = this.getNamesArray(props.adaptTo, false);
      }
      if (calculateExtraNames) {
        // an array of the absolute names in extraFields
        this.extraAbsoluteNamesArray = this.getNamesArray(props.extraFields, true);
        // an array of the relative names in extraFields, converted to absolute names
        this.extraRelativeFullNamesArray = this.getNamesArray(props.extraFields, false);
      }
    }

    // declare interest in having access to the React context
    static contextTypes = {
      _reduxForm: PropTypes.object
    }

    // returns the props that will be passed to the wrapped component
    getComponentProps () {
      let {adaptTo, extraFields, withRef, ...propsToPass} = this.props;   // eslint-disable-line no-unused-vars
      if (isWrappingField) {
        return {
          ...propsToPass,
          // Field will wrap this.connectedComponent (not the other way round)
          component: this.connectedComponent,
          ref: this.props.withRef ? this.captureComponentRef : undefined,
          withRef: withRef      // cascade withRef request
        };
      } else {
        return {...propsToPass};
      }
    }

    // initializes this.connectedComponent (it wraps Adapter)
    initConnectedComponent (withRef) {
      let result = connect(
        // note that we do not pass this.mapDispatchToProps directly since connect() needs to know that the function
        // has a single parameter, and this.mapDispatchToProps (being the result of calling bind() in the constructor) has zero parameters
        // in other words: this.mapDispatchToProps.length is zero, whereas ((dispatch) => this.mapDispatchToProps(dispatch)).length is one.
         this.mapStateToProps, (dispatch) => this.mapDispatchToProps(dispatch), this.mergeProps,
        {withRef: withRef}
      )(Adapter);
      result.displayName = 'Connect(Adapter)';
      return result;
    }

    getNamesArray (names, absolute) {
      if (!names || !absolute && this.props.adaptToForm) return [];    // recall that all names are considered absolute when adapting to another form

      let namesArray = names.split(SPLIT_REGEXP);
      let result = [];
      for (let name of namesArray) {
        if (absolute && (name.startsWith('/') || this.props.adaptToForm)) {     // all names are absolute when adapting to another form
          result.push(this.getAbsoluteFormFieldName(name));
        }
        if (!absolute && !name.startsWith('/') && !this.props.adaptToForm) {    // all names are absolute when adapting to another form
          result.push(this.getAbsoluteFormFieldName(name));
        }
      }
      return result;
    }

    // will be called by instances of this.connectedComponent
    mapStateToProps (state, ownProps) {
      let newFormValues = this.getRequestedFormValues(state, this.relativeFullNamesArray, this.absoluteNamesArray);
      // this.stateProps !== null because we want to run this on construction in any case
      // deep equal because a form with FormSection has nested values
      // !ownProps.adaptToStore  because when ownProps.adaptToStore is true, we have to always call mapStateToProps.
      if (this.stateProps !== null && deepEqual(this.formValues, newFormValues) && !ownProps.adaptToStore) {
        // no change in tracked values, return cached props (these do not have a value prop)
        return this.stateProps;
      }

      this.formValues = newFormValues;      // remember new tracked values

      let extraValues = this.getRequestedFormValues(state, this.extraRelativeFullNamesArray, this.extraAbsoluteNamesArray);
      let syncValidityInfo = undefined;       // eslint-disable-line no-undef-init
      if (ownProps.includeValidityInfo) {
        syncValidityInfo = this.getSyncValidityInfo(state);
      }

      let newStateProps = {};         // get the new prop values for Adapter
      if (isWrappingField) {    // pass an extra _myValue property inside the first parameter to mapValuesToProps
        newStateProps = ownProps.mapValuesToProps({...newFormValues, ...extraValues, _myValue: this.getMyFormValue(state)}, state, syncValidityInfo) || newStateProps;
        invariant(!newStateProps._newValues,
          `${AdaptiveFormPart.displayName}: you specified an invalid _newValues prop. Did you mean '_newValue' instead?`);
        // remember props for next call (in case we can reuse), but `remove' the _newValue prop.
        this.stateProps = {...newStateProps, '_newValue': undefined};
      } else {
        newStateProps = ownProps.mapValuesToProps({...newFormValues, ...extraValues}, state, syncValidityInfo) || newStateProps;
        invariant(!newStateProps._newValue,
          `${AdaptiveFormPart.displayName}: you specified an invalid _newValue prop. Did you mean '_newValues' instead?`);
        invariant(typeof newStateProps._newValues === 'object' || typeof newStateProps._newValues === 'undefined',
          `${AdaptiveFormPart.displayName}: prop '_newValues' should be an object mapping field names to new values`);
        // remember props for next call (in case we can reuse), but `remove' the _newValues prop.
        this.stateProps = {...newStateProps, '_newValues': undefined};
      }
      return newStateProps;       // return the new props
    }

    mapDispatchToProps (dispatch) {
      return {
        changeFormField: (formName, fieldName, value) => dispatch(changeFormValue(formName, fieldName, value))
      };
    }

    // will be called by instances of this.connectedComponent
    mergeProps (stateProps, dispatchProps, ownProps) {
      // remove the props consumed by this.connectedComponent
      let {mapValuesToProps, adaptToStore, includeValidityInfo, ...otherOwnProps} = ownProps;      // eslint-disable-line no-unused-vars
      let {_newValue, _newValues, ...otherStateProps} = stateProps;
      let patchedNewValues = this.getPatchedNewValuesProp(_newValues, _newValue);
      // pass all remaining props and add the _wrappedComponent (needed by InputAdapter), and
      // adaptToForm (needed by dispatchProps.changeFormField) plus the optional _myFieldName
      return {
        ...otherOwnProps,
        ...otherStateProps,
        ...(isWrappingField && {_myFieldName: this.getMyFullFormFieldName()}),
        ...dispatchProps,
        adaptToForm: this.getFormName(),
        _newValues: patchedNewValues,
        _wrappedComponent: isWrappingField ? this.props.component : ComponentToAdapt
      };
    }

    getPatchedNewValuesProp (_newValues, _newValue) {
      if (isWrappingField) {
        // ignore _newValues and return an object with this field's name mapping to _newValue
        return typeof _newValue !== 'undefined' ? {[this.getMyFullFormFieldName()]: _newValue} : undefined;
      } else {
        if (!_newValues) return undefined;
        // result is like _newValues, but the field names are absolute
        let result = {};
        for (let fieldName of Object.keys(_newValues)) {
          result[this.getAbsoluteFormFieldName(fieldName)] = _newValues[fieldName];
        }
        return result;
      }
    }

    getSyncValidityInfo (state) {
      if (this.relativeFullNamesArray.length + this.absoluteNamesArray.length === 0) {
        return Object.create(null);       // nothing to do
      }

      let syncErrors = getFormSyncErrors(this.getFormName())(state);
      let result = Object.create(null);
      // get the validity status for relative names and store them under their short name
      for (let name of this.relativeFullNamesArray.concat(this.extraRelativeFullNamesArray)) {
        setIsUnDefinedInObject(result, syncErrors, name, true);
      }

      // get the validity status for absolute names and store them in nested objects
      for (let name of this.absoluteNamesArray.concat(this.extraAbsoluteNamesArray)) {
        setIsUnDefinedInObject(result, syncErrors, name, false);
      }
      return result;
    }

    // returns the current values of the tracked fields
    getRequestedFormValues (state, relativeNames, absoluteNames) {
      if (relativeNames.length + absoluteNames.length === 0) {
        return Object.create(null);       // nothing to do
      }

      let selector = formValueSelector(this.getFormName());

      // the crazy half GUID is to force the selector to return values nested in an object
      // it does not do so if there is only one name (even if that name refers to a nested field (i.e., has a '.' in it))
      // get the values for relative names and store them under their short name
      let relativeFieldsValues = null;
      if (relativeNames.length > 0) {
        relativeFieldsValues = relativeNames.length === 1
          ? selector(state, ...relativeNames, '81bee4b4-1cc6')
          : selector(state, ...relativeNames);
      }
      // pull the relative values out of their absolute nesting
      relativeFieldsValues = relativeFieldsValues ? getNestedInObject(relativeFieldsValues, this.context._reduxForm.sectionPrefix) : null;

      // get the values for the absolute names and store them in nested objects
      let absoluteFieldsValues = null;
      if (absoluteNames.length > 0) {
        absoluteFieldsValues = absoluteNames.length === 1
          ? selector(state, ...absoluteNames, '81bee4b4-1cc6')
          : selector(state, ...absoluteNames);
      }
      return {...relativeFieldsValues, ...absoluteFieldsValues};
    }

    getAbsoluteFormFieldName (name) {
      if (name.startsWith('/')) {     // if the name is relative to the root of the form
        return name.substring(1);     // the name is already absolute so just remove the '/'
      } else {      // name is relative to the section this component is nested in
        return !this.props.adaptToForm && this.context._reduxForm.sectionPrefix        // if this component is embeded in some form section
          ? this.context._reduxForm.sectionPrefix + '.' + name     // prepend section name
          : name;
      }
    }

    getMyFullFormFieldName () {
      return this.getAbsoluteFormFieldName(this.props.name);
    }

    getMyFormValue (state) {
      // note that here we always refer to the from we are in (regardless of the prop adaptToForm)
      let selector = formValueSelector(this.context._reduxForm.form);
      return selector(state, this.getMyFullFormFieldName());
    }

    // callback to capture a ref to the Field we render
    captureComponentRef (ref) {
      this.componentRef = ref;
    }

    getFormName () {
      return this.props.adaptToForm || this.context._reduxForm.form;
    }
    // ------------- end of private members ----------------------
  }

  return AdaptiveFormPart;
}

class Adapter extends React.Component {

  componentWillMount () {
    if (this.props._newValues) {       // if received new values to set form fields to
      this.changeValues(this.props);
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps._newValues) {       // if received new values to set form fields to
      this.changeValues(nextProps);
      // flag that we should skip the next render since we are waiting for the change to take effect
      // this.waitingForChange = true;
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.waitingForChange) {
  //     this.waitingForChange = false;
  //     return false;
  //   }
  //   return true;
  // }

  render () {
    if (this.props.includeChangeFormFieldProp) {
      let {_newValues, _myFieldName, adaptToForm, _wrappedComponent, includeChangeFormFieldProp,  // eslint-disable-line no-unused-vars
        ...otherProps} = this.props;
      return React.createElement(_wrappedComponent, otherProps);
    } else {
      // also remove the changeFormField prop
      let {_newValues, _myFieldName, adaptToForm, _wrappedComponent, includeChangeFormFieldProp, changeFormField,  // eslint-disable-line no-unused-vars
        ...otherProps} = this.props;     // remove the changeFormField prop
      return React.createElement(_wrappedComponent, otherProps);
    }
  }

  changeValues (props) {
    let {changeFormField, adaptToForm, _myFieldName, _newValues, input} = props;

    if (_myFieldName) {      // if adapting a single Field
      // if this form field does not already have the correct value
      if (input.value !== _newValues[_myFieldName]) {
        changeFormField(adaptToForm, _myFieldName, _newValues[_myFieldName]);      // change the value of the field
      }
    } else {    // not adapting a Field
      for (let fieldName of Object.keys(_newValues)) {
        changeFormField(changeFormValue(adaptToForm, fieldName, _newValues[fieldName]));
      }
    }
  }

}

function setIsUnDefinedInObject (targetObject, srcObject, path, putInRoot) {
  let pathParts = path.split('.');
  let nestedTarget = targetObject;
  let nestedSrc = srcObject;
  for (let i = 0; i < pathParts.length - 1; i++) {
    let nestedName = pathParts[i];
    if (!putInRoot) {
      if (!nestedTarget[nestedName]) {
        nestedTarget[nestedName] = Object.create(null);
      }
      nestedTarget = nestedTarget[nestedName];
    }
    if (nestedSrc) {
      nestedSrc = nestedSrc[nestedName];
    }
  }
  let valueName = pathParts[pathParts.length - 1];
  nestedTarget[valueName] = typeof (nestedSrc && nestedSrc[valueName]) === 'undefined';
}
